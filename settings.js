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
      
          querySnapshot.forEach((doc) => {
            globalUserRef = doc.data();
            privateGlobalUserRef = doc;
            settings = doc.data().settings;
          });
      
          let isAnyUnchecked = false;
          let checkBoxes = [];
      
          Object.keys(settings).forEach((key) => {
            const settingValue = settings[key];
            console.log(`Setting '${key}' has value '${settingValue.checked}'`);
      
            let root = document.getElementById("settingsContainer");
      
            const div = document.createElement("div");
      
            const textDocument = document.createElement("p");
            textDocument.textContent = settingValue.name;
      
            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.checked = settingValue.checked;
      
            checkBox.addEventListener("change", () => {
              let anyUnchecked = false;
      
              checkBoxes.forEach((cb) => {
                if (cb.checked !== settings[key].checked) {
                  anyUnchecked = true;
                }
              });
      
              isAnyUnchecked = anyUnchecked;
              let btn = document.getElementById("saveSettingsButton");
              btn.disabled = !isAnyUnchecked;
            });
      
            div.appendChild(textDocument);
            div.appendChild(checkBox);
            checkBoxes.push(checkBox);
            root.appendChild(div);
          });
      
          // Initially disable button if no checkboxes are changed
          let btn = document.getElementById("saveSettingsButton");
          btn.disabled = true;
      
          btn.addEventListener("click", async () => {
            // Prepare updated settings object
            let updatedSettings = settings
            for(let i = 0; i < Object.keys(settings).length; i++) {
                let key = updatedSettings[i]

                updatedSettings[i] = checkBoxes[i].checked
            }

      
            // Update Firestore document with the updated settings
            await updateDoc(privateGlobalUserRef.ref, { settings: updatedSettings });
      
            // Reset button state after saving
            btn.disabled = true;
            console.log("Settings updated successfully!");
          });
        });
      }
      
      
}
