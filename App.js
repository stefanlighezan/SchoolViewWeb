import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, query, where,getDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Retrieve user and access token from session storage
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

if (!currentUser) {
    // Handle case where authentication information is missing
    // Redirect user back to login page or handle accordingly
    window.location.href = 'index.html'; // Redirect to login page
} else {
    // Initialize Firebase app and services

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
    const db = getFirestore(app);
    let globalCourses = []
    let globalUserRef = null

    // Fetch courses data from Firestore
    async function fetchCourses() {
        const coursesRef = collection(db, 'users');
        const q = query(coursesRef, where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        let courses = [];
        querySnapshot.forEach((doc) => {
            globalUserRef = doc
            courses = doc.data().courses;
        });
        globalCourses = courses
        return courses;
    }

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        // Clear session storage
        sessionStorage.removeItem('currentUser');

        // Redirect to login page
        window.location.href = 'index.html';
    });

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

            // Create an anchor tag to wrap the draft image
            const draftLink = document.createElement('a');
            draftLink.href = `${draft.url}`; // Pass the image URL as a query parameter to the new page

            const draftImage = document.createElement('img');
            draftImage.src = draft.url;
            draftImage.alt = draft.title;
            draftImage.classList.add('draft-image');

            const br = document.createElement("br")

            const draftDropdown = document.createElement("select")

            let defaultOption = new Option()
            defaultOption.value = 0
            defaultOption.text = "No Course Selected"

            draftDropdown.selectedIndex = 0

            draftDropdown.options.add(defaultOption)

            for(let i = 0; i < globalCourses.length; i++) {
                let dropDownOption = new Option()
                dropDownOption.value = i + 1
                dropDownOption.text = `${globalCourses[i].name}`
                draftDropdown.options.add(dropDownOption)
            }

            let draftDropdownChange = document.createElement("button")
            draftDropdownChange.textContent = "Change Location of Draft?"
            draftDropdownChange.style.display = "none"

            draftDropdown.addEventListener("change", () => {
               if (draftDropdown.value != 0) {
                    draftDropdownChange.style.display = "block"
               } else {
                draftDropdownChange.style.display = "none"
               }
            })

            draftDropdownChange.addEventListener("click", async () => {
                    let courseToUpdate = draftDropdown.selectedOptions[0].text;
            
                    // Find the selected course from globalCourses array
                    let selectedCourse = globalCourses.find(course => course.name === courseToUpdate);
            
                    // Ensure both selectedCourse and globalUserRef are valid
                    console.log("her")
                    console.log(globalUserRef)
                    if (selectedCourse && globalUserRef) {
                        // Get the index of the draft in globalUserRef.drafts
                        let draftIndex = globalUserRef.data().drafts.findIndex(_draft => _draft.id === draft.id);
            
                        if (draftIndex !== -1) {
                            // Remove the draft from globalUserRef.drafts
                            console.log("here")
                            let __drafts = globalUserRef.data().drafts
                            __drafts.splice(draftIndex, 1);
                            
                            // Append the draft to the selected course's notes array
                            if (!selectedCourse.notes) {
                                selectedCourse.notes = [];
                            }
            
                            selectedCourse.notes.push({
                                title: draft.title,
                                url: draft.url
                            });
            
                            // Update the document with the modified drafts and courses
                            await updateDoc(globalUserRef.ref, {
                                drafts: __drafts,
                                courses: globalCourses
                            });
            
                            // After saving, re-render drafts
                            await renderDrafts();

                            alert(`Moved draft to ${courseToUpdate}`)
                        }
                    }
            });
            

            draftLink.appendChild(draftImage); // Append the image to the anchor tag
            draftDiv.appendChild(draftLink); // Append the anchor tag to the draftDiv

            const draftTitle = document.createElement('input');
            draftTitle.value = draft.title;
            draftTitle.classList.add('draft-title');

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save?';
            saveButton.classList.add('save-button');
            saveButton.style.display = "none";

            draftTitle.addEventListener("change", () => {
                if (draftTitle.value !== draft.title) {
                    saveButton.style.display = "block";
                } else {
                    saveButton.style.display = "none";
                }
            });

            saveButton.addEventListener('click', async () => {
                await saveDraftChanges(draft.id, draftTitle.value);
            });

            draftDiv.appendChild(draftTitle);
            draftDiv.appendChild(saveButton);
            draftDiv.appendChild(br)
            draftDiv.appendChild(draftDropdown)
            draftDiv.appendChild(draftDropdownChange)
            draftsListDiv.appendChild(draftDiv);
        });

        // Add event listener to each course card to navigate to CourseView.html
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(courseCard => {
            courseCard.addEventListener('click', () => {
                const courseName = courseCard.querySelector('.course-name').textContent.trim();
                window.location.href = `CourseView.html?name=${encodeURIComponent(courseName)}`;
            });
        });

    } catch (error) {
        console.error('Error fetching drafts:', error);
    }
}


async function saveDraftChanges(draftId, newTitle) {
    try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        
        querySnapshot.forEach(async (doc) => {
            const userData = doc.data();
            
            // Check if the current document's uid matches currentUser.uid
            if (userData.uid === currentUser.uid) {
                const updatedDrafts = userData.drafts.map(draft => {
                    if (draft.id === draftId) {
                        return { ...draft, title: newTitle };
                    } else {
                        return draft;
                    }
                });

                // Update the document with the new drafts array
                await updateDoc(doc.ref, { drafts: updatedDrafts });
                
                // After saving, re-render drafts
                await renderDrafts();
            }
        });
    } catch (error) {
        console.error('Error updating draft:', error);
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
