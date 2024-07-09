import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

if (currentUser) {
  document.addEventListener("DOMContentLoaded", async () => {
    const coursesRef = collection(db, "users");
    const q = query(coursesRef, where("uid", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    let settings = {};
    let globalUserRef = null;
    let privateGlobalUserRef = null;
    
    querySnapshot.forEach((doc) => {
      globalUserRef = doc.data();
      privateGlobalUserRef = doc;
      settings = doc.data().settings;
    });

    let settings_outdatedCourses = settings.viewOutdatedCourses;
    let settings_deleteCourses = settings.deleteCourses;

    let outdatedCoursesCheckbox = document.getElementById("viewOutdatedCourses");
    let deleteCoursesCheckbox = document.getElementById("deleteCourses");
    let saveSettingsButton = document.getElementById("saveSettingsButton");

    // Initialize checkboxes based on stored settings
    outdatedCoursesCheckbox.checked = settings_outdatedCourses;
    deleteCoursesCheckbox.checked = settings_deleteCourses;

    // Function to update the UI state and Firestore settings
    function updateSettings() {
      settings.viewOutdatedCourses = outdatedCoursesCheckbox.checked;
      settings.deleteCourses = deleteCoursesCheckbox.checked;
      
      // Update Firestore with new settings
      updateDoc(privateGlobalUserRef.ref, { settings }).then(() => {
        console.log("Settings updated successfully.");
      }).catch((error) => {
        console.error("Error updating settings: ", error);
      });
      
      // Enable or disable saveSettingsButton based on checkbox states
      saveSettingsButton.disabled = !(outdatedCoursesCheckbox.checked || deleteCoursesCheckbox.checked);
    }

    // Update UI state when checkboxes change
    outdatedCoursesCheckbox.addEventListener("change", updateSettings);
    deleteCoursesCheckbox.addEventListener("change", updateSettings);

    // Initial enable/disable state of saveSettingsButton
    saveSettingsButton.disabled = !(outdatedCoursesCheckbox.checked || deleteCoursesCheckbox.checked);

    // Save settings when saveSettingsButton is clicked
    saveSettingsButton.addEventListener("click", () => {
      updateSettings();
      console.log("Settings saved.");
    });
  });
}
