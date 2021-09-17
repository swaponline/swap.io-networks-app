import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import CryptoInterface from './swap.io-keys/src/crypto/interface'

const cInterface = new CryptoInterface()
const testMnemonic = "talk crisp crane dose network winner lumber harvest actual brand loud patch achieve army turtle warm section grab wish traffic anger steak rate square"
cInterface
  .createProfileFromMnemonic(
    testMnemonic.split(` `), // mnemonic (array)
    `` // password - use empty
  )
  .then((testProfile) => {
    console.log('>>> testProfile', testProfile)
  })


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
