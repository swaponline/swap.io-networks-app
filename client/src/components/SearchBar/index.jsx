import React, {useState} from 'react';
import axios from 'axios';
import {AutoComplete, Input, Select} from "antd";
import './index.css';
import {SearchOutlined} from '@ant-design/icons';
const { Option } = AutoComplete;

let timeout;

export default function SearchBar() {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
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
          setOptions(res);
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

  const onSelect = (data) => {
    console.log('onSelect', data);
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
