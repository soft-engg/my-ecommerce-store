import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyCkJ3OUDKu6F1xoKNhmzs_HOH8colc2HIk',
  authDomain: 'myecommercestore-fdf51.firebaseapp.com',
  projectId: 'myecommercestore-fdf51',
  storageBucket: 'myecommercestore-fdf51.appspot.com',
  messagingSenderId: '865238895862',
  appId: '1:865238895862:web:98801f24dd889ca2b070d7',
  measurementId: 'G-QTT3GF01K5',
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
