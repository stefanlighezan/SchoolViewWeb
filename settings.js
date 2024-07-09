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
    if (currentUser) {
        document.addEventListener("DOMContentLoaded", async () => {
          const coursesRef = collection(db, "users");
          const q = query(coursesRef, where("uid", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          let globalUserRef = null;
          let privateGlobalUserRef = null;
          let settings = null;
          let settingsOriginal = null;
      
          querySnapshot.forEach((doc) => {
            globalUserRef = doc.data();
            privateGlobalUserRef = doc;
            settings = doc.data().settings;
            settingsOriginal = settings
          });
      
          let isAnyUnchecked = false;
          let checkBoxes = [];
      
          Object.keys(settings).forEach((key) => {
            const settingValue = settings[key];
            console.log(`Setting '${key}' has value '${settingValue.checked}'`);
            let isChecked = settingValue.checked;
      
            let root = document.getElementById("settingsContainer");
      
            const div = document.createElement("div");
            div.classList.add("setting")
      
            const textDocument = document.createElement("p");
            textDocument.textContent = settingValue.name;
      
            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.checked = settingValue.checked;
            let anyUnchecked = false;

            checkBoxes.push(checkBox);
      
            checkBox.addEventListener("change", () => {
                
              
                checkBoxes.forEach((cb) => {
                anyUnchecked = false
                  if (cb.checked != isChecked) {
                    anyUnchecked = true;
                    console.log(settings[key])
                    settingsOriginal[key].checked = checkBox.checked;
                  }
                });
              
                isAnyUnchecked = anyUnchecked;
                let btn = document.getElementById("saveSettingsButton");
                btn.disabled = !isAnyUnchecked; // Disable button if no checkboxes are changed
              });
              
      
            div.appendChild(textDocument);
            div.appendChild(checkBox);
    
            root.appendChild(div);
          });
      
          // Initially disable button if no checkboxes are changed
          let btn = document.getElementById("saveSettingsButton");
          btn.disabled = true;
      
          btn.addEventListener("click", async () => {
            // Prepare updated settings object
            let updatedSettings = settingsOriginal

      
            // Update Firestore document with the updated settings
            await updateDoc(privateGlobalUserRef.ref, { settings: updatedSettings });
      
            // Reset button state after saving
            btn.disabled = true;
            console.log("Settings updated successfully!");
          });
        });
      }
      
      
}
