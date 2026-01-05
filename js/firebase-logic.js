import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOVAMF30wzIIKTEIy-RCB84WJEiNyuAco",
    authDomain: "viaje-laponia-2.firebaseapp.com",
    projectId: "viaje-laponia-2",
    storageBucket: "viaje-laponia-2.firebasestorage.app",
    messagingSenderId: "817357783502",
    appId: "1:817357783502:web:96dd9fac1eb2dffb7eeb9f",
    measurementId: "G-K7TDXP3YFE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

console.log("Firebase initialized");

// Ensure Auth
signInAnonymously(auth)
    .then(() => {
        console.log("Signed in anonymously");
    })
    .catch((error) => {
        console.error("Error signing in anonymously:", error);
    });

// Expose functions to window for app.js to use
window.fbServices = {
    /**
     * Upload a file for a specific day with progress monitoring
     * @param {File} file - The file object
     * @param {number} dayId - The ID of the day
     * @param {Function} onProgress - Callback for progress updates (0-100)
     * @returns {Promise<string>} - The download URL
     */
    uploadPhoto: (file, dayId, onProgress) => {
        return new Promise((resolve, reject) => {
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `photos/day_${dayId}/${fileName}`);

            console.log("Starting upload...", fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    if (onProgress) onProgress(Math.round(progress));
                },
                (error) => {
                    console.error("Upload failure:", error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                        // Save reference to Firestore
                        await addDoc(collection(db, "photos"), {
                            dayId: dayId,
                            url: downloadURL,
                            timestamp: serverTimestamp(),
                            fileName: fileName
                        });

                        resolve(downloadURL);
                    } catch (dbError) {
                        console.error("Firestore save error:", dbError);
                        reject(dbError);
                    }
                }
            );
        });
    },

    /**
     * Subscribe to real-time updates for a day's photos
     * @param {number} dayId - The ID of the day
     * @param {Function} callback - Function to call with array of photo objects {id, url, filePath}
     */
    subscribeToPhotos: (dayId, callback) => {
        const q = query(
            collection(db, "photos"),
            where("dayId", "==", dayId),
            orderBy("timestamp", "desc")
        );

        return onSnapshot(q, (querySnapshot) => {
            const photos = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                photos.push({
                    id: doc.id,
                    url: data.url,
                    filePath: data.fileName ? `photos/day_${dayId}/${data.fileName}` : null
                });
            });
            callback(photos);
        });
    },

    /**
     * Delete a photo
     * @param {string} docId - The Firestore document ID
     * @param {string} filePath - The Storage path
     */
    deletePhoto: async (docId, filePath) => {
        try {
            console.log("Deleting photo:", docId, filePath);
            // 1. Delete from Firestore
            await deleteDoc(doc(db, "photos", docId));

            // 2. Delete from Storage (if path exists)
            if (filePath) {
                const storageRef = ref(storage, filePath);
                await deleteObject(storageRef);
            }
            console.log("Photo deleted successfully");
        } catch (error) {
            console.error("Error deleting photo:", error);
            throw error;
        }
    }
};

// Dispatch event to let app.js know firebase is ready
window.dispatchEvent(new Event('firebase-ready'));
