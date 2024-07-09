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
    let globalUserRef = null;
    let privateGlobalUserRef = null;
    let settings = null;
    
    querySnapshot.forEach((doc) => {
      globalUserRef = doc.data();
      privateGlobalUserRef = doc;
      settings = doc.data().settings;
    });

    Object.keys(settings).forEach((key) => {
        const settingValue = settings[key].name;
        console.log(`Setting '${key}' has value '${settingValue}'`);

        let root = document.getElementById("settingsContainer")

        const div = document.createElement("div")

        const textDocument = document.createElement("p")
        textDocument.textContent = settingValue        
        const checkBox = document.createElement("input")
        checkBox.type = "checkbox"

        div.appendChild(textDocument)
        div.appendChild(checkBox)
        root.appendChild(div)
        // Do something with each settingValue as needed
      });




  });
}
