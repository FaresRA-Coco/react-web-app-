// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // <-- Add this line!
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqBEorLY-3vlS6jM0k-0K45PZvkp5csK4",
  authDomain: "cocoportfolio-dc844.firebaseapp.com",
  projectId: "cocoportfolio-dc844",
  storageBucket: "cocoportfolio-dc844.firebasestorage.app",
  messagingSenderId: "179483245209",
  appId: "1:179483245209:web:a864011a00d7cf560b9608",
  measurementId: "G-TPP12SDH58"
};

// Initialize Firebase
// 3. Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// 4. Initialize Firebase services using the 'app' instance
const auth = getAuth(app);
const db = getFirestore(app); // <--- THIS IS THE LINE THAT CREATES THE FIRESTORE INSTANCE!

// 5. Export all initialized instances for use throughout your app
export { app, auth, db }; // <--- Make sure 'db' is included in your export!
