import React, {Fragment, useState} from 'react';
import axios from 'axios';
// import {AutoComplete, Input, Select} from "antd";
import './SearchBar.css';

import {SearchOutlined} from '@ant-design/icons';
import {Input} from "antd";

let timeout;
const suggestionList = [
  "Alligator",
  "Bask",
  "Crocodilian",
  "Death Roll",
  "Eggs",
  "Jaws",
  "Reptile",
  "Solitary",
  "Tail",
  "Wetlands"
];

export default function SearchBar() {
  const [value, setValue] = useState('');
  const [hoveredSuggestion, setHoveredSuggestion] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState([]);

  const getAllData = (URLs) => {
    return Promise.all(URLs.map(fetchContent));
  };

  const fetchContent = (URL) => {
    return axios
      .get(URL)
      .then(function(response) {
        return response.data;
      });
  };

  const searchGithub = async (value) => {
    const res = await axios.get(`https://api.github.com/search/code?q=${value}+in:file+user:swaponline+repo:swaponline/swap.io-networks`);
    if (res) {
      const {data} = res;
      const {items} = data;
      let pathList = [];
      await items.map(item => {
        const path = `https://raw.githubusercontent.com/swaponline/swap.io-networks/main/${item.path}`;
        pathList.push(path);
      });
      getAllData(pathList)
        .then(resp=>{
          console.log('respo',resp);
          setResults(resp);
          const res = resp.map((item, i) => {
            return {label: item.name, value: i}
          });
          setSuggestions(res);
        })
        .catch(e=>{console.log(e)});
    }
  };
  const onSearch = (searchText) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (searchText) {
        searchGithub(searchText);
      }
    }, 1000);
  };

  const onSelect = e => {
    console.log('onSelect', e.currentTarget.innerText);
    setValue(e.currentTarget.innerText);
    setShowSuggestions(false);
  };

  const onChange = e => {
    const userInput = e.currentTarget.value;
    console.log('change', userInput);

    const suggestions = suggestionList.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    setSuggestions(suggestions);
    setShowSuggestions(true);
    setValue(userInput);
  };

  const suggestionsListComponent = () => {
    if (showSuggestions && value) {
      if (suggestions.length) {
        return <ul className="suggestions">
            {suggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === hoveredSuggestion) {
                className = "suggestion-active";
              }
              return (
                <li className={className} key={suggestion} onClick={onSelect}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
      } else {
        return <div className="no-suggestions">
            <em>No suggestions available.</em>
          </div>
      }
    }
    return '';
  };

  return (
    <div>
      <Input.Group className='input-group'>
        <input
          className='autocomplete-input'
          type="text"
          onChange={onChange}
          value={value}
        />
      </Input.Group>
      {suggestionsListComponent()}
    </div>
  );
}
