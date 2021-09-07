import React from 'react';
import './index.css';
import SearchBar from "../../components/SearchBar";

export default function Home(){
  return (
    <div className='container'>
      <SearchBar/>
      <div className='text-block'>Explore swap.io-networks repo. Find token, coin and network definitions.</div>
    </div>
  )
};
