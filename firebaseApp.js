import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: "AIzaSyAONchcXNIGH3afDwF293E7rEqvX1hD4qQ",
	authDomain: "facebook-17-next.firebaseapp.com",
	projectId: "facebook-17-next",
	storageBucket: "facebook-17-next.appspot.com",
	messagingSenderId: "196963481992",
	appId: "1:196963481992:web:1344507c6cfe9322e1223d"
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const fireStore = getFirestore(app)
const storage = getStorage(app)

export { app, fireStore, storage }