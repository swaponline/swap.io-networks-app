import React, {Fragment, useState} from 'react';
import axios from 'axios';
import {Input, Select} from "antd";
import './SearchBar.css';

import {SearchOutlined, CloseCircleFilled} from '@ant-design/icons';
const {Option} = Select;

let timeout;

export default function SearchBar({setSelectedValue}) {
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
        .then(res=>{
          console.log('respo',res);
          setResults(res);
          // const res = resp.map((item, i) => {
          //   return {label: item.name, value: i}
          // });
          setShowSuggestions(Boolean(value));
          setValue(value);

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
    const selected = suggestions.find(item => item.name === e.currentTarget.innerText);
    console.log('onSelect', e.currentTarget.innerText, selected);

    setSelectedValue(selected);
    setValue(e.currentTarget.innerText);
    setShowSuggestions(false);
  };

  const onChange = e => {
    const userInput = e.currentTarget.value;

    onSearch(userInput);
    // const suggestions = suggestionList.filter(
    //   suggestion =>
    //     suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    // );

    // setSuggestions(suggestions);
    // setShowSuggestions(Boolean(userInput));
    setValue(userInput);
  };

  const clearInput = () => {
    setShowSuggestions(false);
    setValue('');
    setSelectedValue(null);
  };

  const suggestionsListComponent = () => {
    if (showSuggestions && value) {
      if (suggestions.length) {
        return <ul className={`suggestions ${showSuggestions && 'show-suggestions-dropdown'}`}>
            {suggestions.map((suggestion, index) => {
              console.log('suggestion', suggestion);
              let className;
              if (index === hoveredSuggestion) {
                className = "suggestion-active";
              }
              return (
                <li className={className} key={suggestion.name} onClick={onSelect}>
                  <SearchOutlined className='search-icon'/>{suggestion.name}
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
    <div className='input-container'>
      <Input.Group className={`input-group ${showSuggestions && 'show-suggestions-input'}`}>
        <SearchOutlined className='search-icon'/>
        <Input
          className='autocomplete-input'
          type="text"
          onChange={onChange}
          value={value}
          suffix={
            <CloseCircleFilled
              className='close-icon'
              onClick={clearInput}
            />
          }
        />
        <Select className='select-input' value='All'>
          <Option>All</Option>
          <Option>Blockchain</Option>
          <Option>Token</Option>
        </Select>
      </Input.Group>
      {suggestionsListComponent()}
    </div>
  );
}
