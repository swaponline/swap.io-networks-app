import React, {useState} from 'react';
import './SearchContainer.css';
import SearchBar from "../../components/SearchBar";
import SearchResult from "../../components/SearchResult";

export default function SearchContainer(){
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <div className='container'>
      <SearchBar setSelectedValue={setSelectedValue}/>
      {selectedValue
        ? <SearchResult selectedValue={selectedValue}/>
        : <div className='text-block'>Explore swap.io-networks repo. Find token, coin and network definitions.</div>
      }
    </div>
  )
};
