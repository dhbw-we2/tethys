import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "",
  authDomain: "meal-o-mat-calendar.firebaseapp.com",
  databaseURL: "https://meal-o-mat-calendar.firebaseio.com",
  projectId: "meal-o-mat-calendar",
  storageBucket: "meal-o-mat-calendar.appspot.com",
  messagingSenderId: "221271990775",
  appId: "1:221271990775:web:15125ed2bab083f3328ef2"
};


const db = firebase.initializeApp(firebaseConfig).firestore()
export default db

const { TimeStamp, GeoPoint } = firebase.firestore
export { TimeStamp, GeoPoint }
