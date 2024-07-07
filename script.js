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

// Handle form submission
const authForm = document.getElementById('authForm');

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = authForm.email.value;
    const password = authForm.password.value;
    const accessToken = authForm.accessToken.value;

    if (error.code === 'auth/email-already-in-use') {
        try {
            // If email is already in use, try to sign in instead
            await signInWithEmailAndPassword(auth, email, password);
            alert('Logged in successfully!');

            sessionStorage.setItem('currentUser', JSON.stringify(user));
            sessionStorage.setItem('accessToken', accessToken);

            // Redirect to App.html
            window.location.href = 'App.html';
        } catch (signInError) {
            alert(`Error signing in: ${signInError.message}`);
        }
    } else {
        alert(`Error creating account: ${error.message}`);
    }
});

<<<<<<< HEAD
// Data class for Course
=======
async function fetchCourses(access_token) {
    let allCourses = [];
    let pageNumber = 1;
    let hasMorePages = true;

        while (hasMorePages) {
            const response = await fetch(`${access_token}&page=${pageNumber}`, {
                credentials: 'omit',
                mode: 'no-cors' 
              })
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const _courses = await response.json();

            if (Array.isArray(_courses) && _courses.length > 0) {
                _courses.forEach((course) => {
                    allCourses.push(new Course(course.id, course.name, course.created_at))
                })
                pageNumber++
            } else {
                hasMorePages = false;
            }
        }

    return allCourses
}

// Data class for Course
class Course {
    constructor(id, name, created_at) {
        this.id = id
        this.name = name
        this.created_at = created_at
    }

    isNull() {
        return !this.id || !this.name || !this.created_at;
    }

    isOutdated() {
        // Calculate current date and one year ago
        const currentDate = new Date();
        const oneYearFromCreatedAt = new Date(this.created_at);
        oneYearFromCreatedAt.setFullYear(oneYearFromCreatedAt.getFullYear() + 1);
        oneYearFromCreatedAt.setMonth(5)

        console.log(currentDate > oneYearFromCreatedAt)

        // Compare course creation date with one year from now

        return currentDate > oneYearFromCreatedAt;
    }
}
>>>>>>> 8e0fa09ec3b49e30d56b7b187775d02e0f4d067b
