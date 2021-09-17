import React, {useState} from 'react';
import axios from 'axios';
import {Input, Select, Spin} from "antd";
import './SearchBar.css';

import {SearchOutlined, CloseCircleFilled} from '@ant-design/icons';
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
const {Option} = Select;

let timeout;

export default function SearchBar({setSelectedValue}) {
  const [searchText, setSearchText] = useState(null);
  const [filter, setFilter] = useState('all');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchNetwork = async (q, type) => {
    const res = await axios.get(`/search?q=${q}&type=${type}`);
    setLoading(false);
    if (res) {
      const {data} = res;
      setSuggestions(data);
      setShowSuggestions(Boolean(q));
    }
  };

  const onSearch = (input, type) => {
    clearTimeout(timeout);
    setLoading(true);
    timeout = setTimeout(() => {
      if (input) {
        searchNetwork(input, type);
      }
    }, 1000);
  };

  const onSelect = suggestion => {
    setSelectedValue(suggestion);
    setShowSuggestions(false);
  };

  const onInputChange = e => {
    const userInput = e.currentTarget.value;

    setSearchText(userInput);
    onSearch(userInput, filter);
    if (!userInput.length) {
      clearInput();
    }
  };

  function handleSelectType(value) {
    setFilter(value);
    onSearch(searchText, value);
  }

  const clearInput = () => {
    setShowSuggestions(false);
    setSearchText('');
    setSelectedValue(null);
    setLoading(false);
  };

  const suggestionsListComponent = () => {
    console.log('suggestions', suggestions);
    if (showSuggestions && searchText) {
      if (suggestions.length) {
        return <ul className={`suggestions ${showSuggestions && 'show-suggestions-dropdown'}`}>
            {suggestions.map((suggestion) => {
              const {name, isToken, symbol} = suggestion._source;
              const id = suggestion._id;
              return (
                <li className={`suggestion`} key={id} onClick={() => onSelect(suggestion)}>
                  <SearchOutlined className='search-icon'/>
                  {name}
                  {isToken && ` / ${symbol}`}
                  <span>{isToken ? 'Coin': 'Network'}</span>
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
        {loading ? <Spin className='search-icon' indicator={<LoadingOutlined />}/> : <SearchOutlined className='search-icon'/> }
        <Input
          className='autocomplete-input'
          type="text"
          onChange={onInputChange}
          value={searchText}
          suffix={
            <CloseCircleFilled
              className='close-icon'
              onClick={clearInput}
            />
          }
        />
        <Select className='select-input' value={filter} onChange={handleSelectType}>
          <Option value='all'>All</Option>
          <Option value='blockchain'>Blockchain</Option>
          <Option value='token'>Token</Option>
        </Select>
      </Input.Group>
      {suggestionsListComponent()}
    </div>
  );
}
