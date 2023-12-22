const { signInWithEmailAndPassword, getAuth } = require("firebase/auth");
const { initializeApp } = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyDCTgpIaiS5ev1cOQv54mDzTEN4egsnUfs",
    authDomain: "csci5410-f23-sdp4.firebaseapp.com",
    projectId: "csci5410-f23-sdp4",
    storageBucket: "csci5410-f23-sdp4.appspot.com",
    messagingSenderId: "288084611264",
    appId: "1:288084611264:web:7bb8e93b4f387437331d25"
}

const app = initializeApp(firebaseConfig); // Initialize Firebase Admin SDK

exports.handler = async (event) => {
    console.log("Event: ", event)
    const email= event.email;
    const password = event.password;

    try {
        const auth = getAuth(app)
        const user = await signInWithEmailAndPassword(auth, email, password);
        successResponse = { message: "Log In Successful", user: user }
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: successResponse,
        };
    } catch (error) {
        errorResponse = { error: error.message }
        return {
            statusCode: 500,
            body: errorResponse,
        };
    }
};
