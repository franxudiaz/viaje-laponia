import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOVAMF30wzIIKTEIy-RCB84WjEiNyuAco",
    authDomain: "viaje-laponia-2.firebaseapp.com",
    projectId: "viaje-laponia-2",
    storageBucket: "viaje-laponia-2.firebasestorage.app",
    messagingSenderId: "817357783502",
    appId: "1:817357783502:web:96dd9fac1eb2dffb7eeb9f",
    measurementId: "G-K7TDXP3YFE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Helper: Compress image to Base64 (Limit 700KB for Firestore safety)
// Firestore max document size is 1MB. We aim lower to be safe.
const compressImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_WIDTH = 1000;
                const MAX_HEIGHT = 1000;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to JPEG 0.6 quality
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(new Error("Error loading image for compression"));
        };
        reader.onerror = (err) => reject(new Error("Error reading file"));
    });
};

window.fbServices = {
    auth: auth,

    signIn: async () => {
        try {
            await signInAnonymously(auth);
            console.log("Signed in anonymously");
        } catch (error) {
            console.error("Error signing in", error);
            throw error;
        }
    },

    /**
     * Upload photo as Base64 string to Firestore
     * @param {File} file - The file to upload
     * @param {number} dayId - The ID of the day
     * @param {Function} onProgress - Callback for upload progress (0-100)
     */
    uploadPhoto: (file, dayId, onProgress) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (onProgress) onProgress(10); // Start processing

                console.log("Compressing image...");
                const base64Image = await compressImage(file);

                if (onProgress) onProgress(50); // Compression done

                console.log("Saving to Firestore...");
                await addDoc(collection(db, "photos"), {
                    dayId: dayId,
                    url: base64Image, // Storing the base64 string directly
                    timestamp: serverTimestamp(),
                    fileName: file.name
                });

                if (onProgress) onProgress(100); // Done
                resolve(base64Image);
            } catch (error) {
                console.error("Upload failure:", error);
                reject(error);
            }
        });
    },

    /**
     * Subscribe to real-time updates for a day's photos
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
                    url: data.url, // This is now a Base64 string
                    filePath: null // No longer needed
                });
            });
            callback(photos);
        });
    },

    /**
     * Delete a photo document
     */
    deletePhoto: async (docId, filePath) => {
        try {
            console.log("Deleting photo doc:", docId);
            await deleteDoc(doc(db, "photos", docId));
            console.log("Photo deleted successfully");
        } catch (error) {
            console.error("Error deleting photo:", error);
            throw error;
        }
    }
};

// Dispatch event to let app.js know firebase is ready
window.dispatchEvent(new Event('firebase-ready'));
