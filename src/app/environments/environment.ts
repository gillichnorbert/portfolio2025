// src/environments/environment.ts

// Importálja az érzékeny adatokat tartalmazó fájlt
// Vegye figyelembe, hogy a 'privateEnvironment' objektumot importáljuk
import { privateEnvironment } from './environment.private';

export const environment = {
  // A production változó, ahogy eddig is
  production: true,

  // Összefűzzük a nyilvános és privát Firebase konfigurációt
  firebaseConfig: {
    ...privateEnvironment.firebaseConfig, // Az API kulcs innen jön
    authDomain: "gn-portfolio.firebaseapp.com",
    databaseURL: "https://gn-portfolio-default-rtdb.europe-west3.firebasedatabase.app",
    projectId: "gn-portfolio",
    storageBucket: "gn-portfolio.firebasestorage.app",
    messagingSenderId: "521699209610",
    appId: "1:521699209610:web:c92ff8b3f85643f5d79873",
    measurementId: "G-5GJ0HHFVFT"
  }
};

