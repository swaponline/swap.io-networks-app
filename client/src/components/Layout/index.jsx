import React from 'react';
import Header from "../Header";
import './Layout.css';

export default function Layout(props) {
  return (
    <>
      <Header/>
      <div style={{ backgroundImage: "url(/img/background.png)" }} className='content'>
        {props.children}
      </div>
    </>
  )
}
