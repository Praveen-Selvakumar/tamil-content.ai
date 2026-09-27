// ============================================================
// VANIKIO - Firebase Configuration
// Auth + Firestore + Storage + Firebase AI Logic
// ============================================================


// ============================================================
// Firebase App
// ============================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";


// ============================================================
// Firebase Authentication
// ============================================================

import {
    getAuth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


// ============================================================
// Firebase Firestore
// ============================================================

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ============================================================
// Firebase Storage
// ============================================================

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";


// ============================================================
// Firebase AI Logic
// Gemini Developer API
// ============================================================

import {
    getAI,
    getGenerativeModel,
    GoogleAIBackend
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-ai.js";


// ============================================================
// Firebase Configuration
// ============================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyDQp3SzKyJRSW4iAKgtVRATLkdm55y4JHQ",

    authDomain:
        "tabletap-3c1b9.firebaseapp.com",

    projectId:
        "tabletap-3c1b9",

    storageBucket:
        "tabletap-3c1b9.firebasestorage.app",

    messagingSenderId:
        "17540244686",

    appId:
        "1:17540244686:web:993d4136b661d5bbe3dc9f",

    measurementId:
        "G-L88D3WK9LW"

};


// ============================================================
// Initialize Firebase
// ============================================================

const app =
    initializeApp(firebaseConfig);


// ============================================================
// Authentication
// ============================================================

const auth =
    getAuth(app);


// ============================================================
// Firestore
// ============================================================

const db =
    getFirestore(app);


// ============================================================
// Storage
// ============================================================

const storage =
    getStorage(app);


// ============================================================
// Google Authentication
// ============================================================

const googleProvider =
    new GoogleAuthProvider();

googleProvider.setCustomParameters({

    prompt:
        "select_account"

});


// ============================================================
// Authentication Persistence
// ============================================================

async function setAuthPersistence(
    rememberMe
) {

    await setPersistence(

        auth,

        rememberMe
            ? browserLocalPersistence
            : browserSessionPersistence

    );

}


// ============================================================
// Create / Update User Profile
//
// Firestore:
// /users/{uid}
// ============================================================

async function createUserProfile(
    user,
    extraData = {}
) {

    if (!user) {

        throw new Error(
            "User is required."
        );

    }


    const userRef =
        doc(
            db,
            "users",
            user.uid
        );


    const existingUser =
        await getDoc(
            userRef
        );


    const userData = {

        uid:
            user.uid,

        displayName:
            user.displayName ||
            extraData.displayName ||
            "",

        email:
            user.email ||
            "",

        photoURL:
            user.photoURL ||
            "",

        provider:
            extraData.provider ||
            "password",

        updatedAt:
            serverTimestamp()

    };


    if (!existingUser.exists()) {

        userData.createdAt =
            serverTimestamp();

    }


    await setDoc(

        userRef,

        userData,

        {
            merge: true
        }

    );

}


// ============================================================
// Firebase AI Logic
// ============================================================
//
// Web equivalent of:
//
// Firebase.ai(
//     backend = GenerativeBackend.googleAI()
// ).generativeModel(
//     modelName = "gemini-3.6-flash"
// )
//
// Web:
//
// getAI()
//     ↓
// GoogleAIBackend()
//     ↓
// getGenerativeModel()
// ============================================================

const ai =
    getAI(

        app,

        {
            backend:
                new GoogleAIBackend()
        }

    );


// ============================================================
// Gemini Model
// ============================================================
//
// Same model used by your Android implementation.
//
// gemini-3.6-flash
//
// ============================================================

const model =
    getGenerativeModel(

        ai,

        {
            model:
                "gemini-3.6-flash"
        }

    );


// ============================================================
// Generate AI Content
// ============================================================
//
// Used by:
//
// content_creation.html
//
// Example:
//
// const text = await generateAIContent(
//     "Write 5 natural Tamil hooks."
// );
//
// ============================================================

async function generateAIContent(
    prompt
) {

    console.log(
        "VANIKIO AI: Request started"
    );


    if (
        !prompt ||
        !prompt.trim()
    ) {

        throw new Error(
            "AI prompt is required."
        );

    }


    try {

        console.log(
            "VANIKIO AI: Model = gemini-3.6-flash"
        );


        const result =
            await model.generateContent(
                prompt
            );


        console.log(
            "VANIKIO AI: Response received",
            result
        );


        const response =
            result.response;


        if (!response) {

            throw new Error(
                "Gemini returned no response."
            );

        }


        const text =
            response.text();


        console.log(
            "VANIKIO AI: Text received",
            text
        );


        if (
            !text ||
            !text.trim()
        ) {

            throw new Error(
                "Gemini returned an empty response."
            );

        }


        return text;


    } catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "VANIKIO AI ERROR"
        );

        console.error(
            "Message:",
            error?.message
        );

        console.error(
            "Code:",
            error?.code
        );

        console.error(
            "Full error:",
            error
        );

        console.error(
            "===================================="
        );


        throw new Error(

            error?.message ||
            "Firebase AI request failed."

        );

    }

}


// ============================================================
// Exports
// ============================================================

export {

    // --------------------------------------------------------
    // Firebase
    // --------------------------------------------------------

    app,
    auth,
    db,
    storage,


    // --------------------------------------------------------
    // Google Authentication
    // --------------------------------------------------------

    googleProvider,


    // --------------------------------------------------------
    // Authentication
    // --------------------------------------------------------

    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    sendPasswordResetEmail,

    createUserWithEmailAndPassword,
    updateProfile,
    signOut,


    // --------------------------------------------------------
    // Persistence
    // --------------------------------------------------------

    setAuthPersistence,
    browserLocalPersistence,
    browserSessionPersistence,


    // --------------------------------------------------------
    // Auth State
    // --------------------------------------------------------

    onAuthStateChanged,


    // --------------------------------------------------------
    // User Profile
    // --------------------------------------------------------

    createUserProfile,


    // --------------------------------------------------------
    // Firestore
    // --------------------------------------------------------

    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    serverTimestamp,


    // --------------------------------------------------------
    // Storage
    // --------------------------------------------------------

    getStorage,


    // --------------------------------------------------------
    // Firebase AI
    // --------------------------------------------------------

    ai,
    model,
    generateAIContent

};