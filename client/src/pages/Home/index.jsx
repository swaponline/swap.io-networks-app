import React from 'react';
import './index.css';
import SearchBar from "../../components/SearchBar";
import axios from "axios";
import {Button} from "antd";

export default function Home(){

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
        .then(resp=>{console.log('respo',resp)})
        .catch(e=>{console.log(e)});
    }
  };
  return (
    <div className='container'>
      <SearchBar/>
      <div className='text-block'>Explore swap.io-networks repo. Find token, coin and network definitions.</div>
      <Button
        onClick={() => searchGithub('binance')}
      >Search</Button>
    </div>
  )
};
