import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signOut  } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Retrieve user and access token from session storage
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
const accessToken = sessionStorage.getItem('accessToken');

if (!currentUser || !accessToken) {
    // Handle case where authentication information is missing
    // Redirect user back to login page or handle accordingly
    window.location.href = 'index.html'; // Redirect to login page
} else {
    // Initialize Firebase app and services

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

    // Fetch courses data from Firestore
    async function fetchCourses() {
        const coursesRef = collection(db, 'users');
        const q = query(coursesRef, where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        let courses = [];
        querySnapshot.forEach((doc) => {
            courses = doc.data().courses;
        });
        return courses;
    }

    // Wait for DOM content to load before manipulating
    // Wait for DOM content to load before manipulating
// Fetch drafts data from Firestore
async function fetchDrafts() {
    const draftsRef = collection(db, 'users');
    const q = query(draftsRef, where("uid", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    let drafts = [];
    querySnapshot.forEach((doc) => {
        drafts = doc.data().drafts;
    });
    return drafts;
}

// Function to render drafts
async function renderDrafts() {
    try {
        // Fetch drafts data
        const drafts = await fetchDrafts();

        // Select the draftsList element where drafts will be displayed
        const draftsListDiv = document.getElementById('draftsList');

        // Clear any existing content
        draftsListDiv.innerHTML = '';

        // Loop through each draft and create HTML elements
        drafts.forEach(draft => {
            const draftDiv = document.createElement('div');
            draftDiv.classList.add('draft-card');

            const draftImage = document.createElement('img');
            draftImage.src = draft.url;
            draftImage.alt = draft.title;
            draftImage.classList.add('draft-image');

            const draftTitle = document.createElement('p');
            draftTitle.textContent = draft.title;
            draftTitle.classList.add('draft-title');

            draftDiv.appendChild(draftImage);
            draftDiv.appendChild(draftTitle);

            draftsListDiv.appendChild(draftDiv);
        });
    } catch (error) {
        console.error('Error fetching drafts:', error);
    }
}

// Wait for DOM content to load before manipulating
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch courses data
        const courses = await fetchCourses();

        // Select the root element where courses will be displayed
        const rootDiv = document.getElementById('root');

        // Loop through each course and create HTML elements
        courses.forEach(course => {
            const courseDiv = document.createElement('div');
            courseDiv.classList.add('course-card');

            const courseName = document.createElement('h2');
            courseName.textContent = course.name;
            courseName.classList.add('course-name');

            const courseId = document.createElement('p');
            courseId.textContent = `Course ID: ${course.id}`;

            const courseCreatedAt = document.createElement('p');
            courseCreatedAt.textContent = `Created At: ${course.created_at}`;
            courseCreatedAt.classList.add('course-created');

            courseDiv.appendChild(courseName);
            courseDiv.appendChild(courseId);
            courseDiv.appendChild(courseCreatedAt);

            rootDiv.appendChild(courseDiv);
        });

        // Render drafts
        await renderDrafts();
    } catch (error) {
        console.error('Error fetching courses or drafts:', error);
    }
});
}
