import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let user = null

// Handle form submission
const authForm = document.getElementById('authForm');

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = authForm.email.value;
    const password = authForm.password.value;

    try{

    await signInWithEmailAndPassword(auth, email, password);
            alert('Logged in successfully!');

            user = auth.currentUser

            sessionStorage.setItem('currentUser', JSON.stringify(user));

            // Redirect to App.html
            window.location.href = 'App.html';
        } catch (signInError) {
            alert(`Error signing in: ${signInError.message}`);
            console.log(signInError)
        }
});

