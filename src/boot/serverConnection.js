import firebaseService from '../services/firebase'

export default async () => {
  const config = {
    "apiKey": "AIzaSyD2d7_cMhVANtJdT7ec0qUlh6oWlDF4xs8",
      "authDomain": "meal-o-mat-calendar.firebaseapp.com",
      "databaseURL": "https://meal-o-mat-calendar.firebaseio.com",
      "projectId": "meal-o-mat-calendar",
      "storageBucket": "meal-o-mat-calendar.appspot.com",
      "messagingSenderId": "221271990775",
      "appId": "1:221271990775:web:15125ed2bab083f3328ef2"
  };
  firebaseService.fBInit(config)

  // Validation that our service structure is working
  // with a firebase app instance. Does not validate a
  // valid API key.
  console.log(firebaseService.auth())
}
