import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBfDWirWpYcTC1j3zfz4GdF_H6jisl0V7o",
    authDomain: "viaje-laponia.firebaseapp.com",
    projectId: "viaje-laponia",
    storageBucket: "viaje-laponia.firebasestorage.app",
    messagingSenderId: "510764075530",
    appId: "1:510764075530:web:469d215004cee7f2a2adf3",
    measurementId: "G-W6G0CRPMPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

console.log("Firebase initialized");

// Expose functions to window for app.js to use
window.fbServices = {
    /**
     * Upload a file for a specific day
     * @param {File} file - The file object
     * @param {number} dayId - The ID of the day
     * @returns {Promise<string>} - The download URL
     */
    uploadPhoto: async (file, dayId) => {
        try {
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `photos/day_${dayId}/${fileName}`);

            console.log("Uploading...", fileName);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Save reference to Firestore
            await addDoc(collection(db, "photos"), {
                dayId: dayId,
                url: downloadURL,
                timestamp: serverTimestamp(),
                fileName: fileName
            });

            return downloadURL;
        } catch (error) {
            console.error("Error uploading photo:", error);
            throw error;
        }
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
