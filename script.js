import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDchFtmBO2kAmHz5nXhJoynpkzYlOypTIU",
    authDomain: "schoolviewapp-197d2.firebaseapp.com",
    projectId: "schoolviewapp-197d2",
    storageBucket: "schoolviewapp-197d2",
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
        const coursesData = courses.map(course => {
            return {
                name: course.name,
                createdAt: course.created_at,
                notes: [] // Initialize notes array for each course
            };
        });

        console.log("here")

        await addDoc(collection(db, 'users'), {
            uid: user.uid,
            accessToken: accessToken,
            drafts: [],
            courses: arrayUnion(...coursesData)
        });
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

async function fetchCourses(accessToken) {
    let allCourses = [];
    let pageNumber = 1;
    let hasMorePages = true;

    while (hasMorePages) {
        const response = await fetch(`${accessToken}`);
        if (!response.ok) {
            throw new Error('Failed to fetch classes');
        }
        const courses = await response.json();

        if (Array.isArray(courses) && courses.length > 0) {
            // Convert API data to Course objects
            const convertedCourses = courses.map(course => {
                return new Course(course.id, course.name, course.course_code, course.start_date, course.end_date, course.enrollment_term);
            });
            allCourses = allCourses.concat(convertedCourses);
            pageNumber++;
        } else {
            hasMorePages = false;
        }
    }

    return allCourses
    
}

// Data class for Course
class Course {
    constructor(id, name, courseCode, startDate, endDate, enrollmentTerm) {
        this.id = id;
        this.name = name;
        this.courseCode = courseCode;
        this.startDate = startDate;
        this.endDate = endDate;
        this.enrollmentTerm = enrollmentTerm;
    }
}