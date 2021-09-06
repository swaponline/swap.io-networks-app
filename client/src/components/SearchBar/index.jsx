import React, {useState} from 'react';
import axios from 'axios';
import {AutoComplete, Input, Select} from "antd";
import './index.css';
import {SearchOutlined} from '@ant-design/icons';
const { Option } = AutoComplete;

export default function SearchBar() {
  const mockVal = (str, repeat = 1) => ({
    value: str.repeat(repeat),
  });

  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);

  const onSearch = (searchText) => {
    setOptions(
      !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
    );
  };

  const onSelect = (data) => {
    console.log('onSelect', data);
  };

  const onChange = (data) => {
    setValue(data);
  };

  return (
    <Input.Group className='input-group'>
      <SearchOutlined className='search-icon'/>
      <AutoComplete
        className='autocomplete-input'
        placeholder="Search..."
        options={options}
        onSelect={onSelect}
        onSearch={onSearch}
      >
      </AutoComplete>
      <Select className='select-input' defaultValue="all">
        <Option value="all">All</Option>
        <Option value="token">Token</Option>
        <Option value="blockchain">Blockchain</Option>
      </Select>
    </Input.Group>

  );
}
