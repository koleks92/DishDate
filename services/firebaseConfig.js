import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';     

const firebaseConfig = {
    apiKey: "AIzaSyAXm52KJfI7qegCTz_hWt5kq_Z1lqx_j0g",
    authDomain: "dishdate-2594f.firebaseapp.com",
    projectId: "dishdate-2594f",
    storageBucket: "dishdate-2594f.firebasestorage.app",
    messagingSenderId: "1063465788057",
    appId: "1:1063465788057:web:a30bd5387fb0629134ce08",
    measurementId: "G-0812RQP5VD"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth }
