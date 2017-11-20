import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';


var config = {
  apiKey: "AIzaSyA92EbnKd1KgBBVPaTIfNzkbwH2DFYKYwY",
  authDomain: "emberjs-208a3.firebaseapp.com",
  databaseURL: "https://emberjs-208a3.firebaseio.com",
  projectId: "emberjs-208a3",
  storageBucket: "emberjs-208a3.appspot.com",
  messagingSenderId: "944105123761"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
