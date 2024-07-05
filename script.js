import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDchFtmBO2kAmHz5nXhJoynpkzYlOypTIU",
    authDomain: "schoolviewapp-197d2.firebaseapp.com",
    projectId: "schoolviewapp-197d2",
    storageBucket: "schoolviewapp-197d2.appspot.com",
    messagingSenderId: "74687319461",
    appId: "1:74687319461:web:880eb0e5c043bf99896c4c",
    measurementId: "G-DQHSNYT08D"
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

    try {
        // Try to create a new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const courses = await fetchCourses(accessToken);

        // Prepare courses data for Firestore
        let coursesData = []

        console.log(courses)

        courses.forEach(course => {
            if(!course.isNull())coursesData.push(course)
        });

        let finalCoursesList = []

        coursesData.forEach((c) => {
            let dict = {
                name: c.name,
                id: c.id,
                created_at: c.created_at
            }

            finalCoursesList.push(dict)
        })

        try {
            console.log(...coursesData)
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                accessToken: accessToken,
                drafts: [],
                courses: finalCoursesList
            });
        } catch (error){
            console.log(error)
        }
        alert('Account created successfully!');
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            try {
                // If email is already in use, try to sign in instead
                await signInWithEmailAndPassword(auth, email, password);
                alert('Logged in successfully!');
            } catch (signInError) {
                alert(`Error signing in: ${signInError.message}`);
            }
        } else {
            alert(`Error creating account: ${error.message}`);
        }
    }
});

async function fetchCourses(access_token) {
    let allCourses = [];
    let pageNumber = 1;
    let hasMorePages = true;

        while (hasMorePages) {
            const response = await fetch(`${access_token}&page=${pageNumber}`);
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
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Compare course creation date with one year ago
        return this.created_at < oneYearAgo;
    }
}
