import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyD84EH1g-09TT5F-NUkarKnRmMLSvSZk9o',
  authDomain: 'msports-8c153.firebaseapp.com',
  projectId: 'msports-8c153',
  storageBucket: 'msports-8c153.appspot.com',
  messagingSenderId: '567889119473',
  appId: '1:567889119473:web:0ecd1504a9da7cb5b84150',
  measurementId: 'G-BX5T349CZ9',
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
