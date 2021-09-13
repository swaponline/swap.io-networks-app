import React, {useState} from 'react';
import {Switch,Input,Select} from "antd";

import Editor from "react-simple-code-editor";
import Prism from 'prismjs';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism.css";
import { ReactComponent as GithubLogo } from "../../assets/svg/github.svg";

import Field from "../Field";
import Tabs from "../Tabs";


import './SearchResult.css';

const {Option} = Select;

export default function SearchResult({selectedValue}) {


  console.log('Search result selected', selectedValue);
  const {name, network, address, symbol, decimals, isTestnet, logo} = selectedValue;
  const logoUrl = `https://raw.githubusercontent.com/swaponline/swap.io-networks/main${logo}`;
  const code = JSON.stringify(selectedValue, null, 4);
  const pathUrl = logo.replace('logo.png', 'info.json');
  const path = `https://github.com/swaponline/swap.io-networks/tree/main${pathUrl}`;
  // const code = `function add(a, b) {
  //   return a + b;ges
  // }
  //
  // const a = 123;
  // `;

  const [darkMode, setDarkMode] = useState(true);
  const [showInfo, setShowInfo] = useState(true);


  const onClickTabCallback = (tab) => {
    setShowInfo(tab);
  } 
  /*const onDarkModeChange = (change) =>{
    setDarkMode(change);
  };*/

  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, Prism.languages.javascript, 'javascript')
      .split("\n")
      .map((line, i) => `<span class='editorLineNumber'>${i + 1}. </span>${line}`)
      .join("\n");


  const renderInfo = () => {
    return (
      <React.Fragment>
        <div className='info-field logo-field' style={{backgroundColor: darkMode ? 'white' : '#F6F6F6'}}>
          <div><img alt='logo' src={logoUrl}/>Logo.svg</div>
          <div><span>Dark mode</span><Switch size="small" onChange={()=>setDarkMode(!darkMode)} /></div>
        </div>
      
        {<Field label={'Name'} value={name} mode={darkMode}/>}
        {network && <Field label={'Network'} value={network} mode={darkMode}/>}
        {address && <Field label={'Address'} value={address} mode={darkMode}/>}
        {symbol && <Field label={'Symbol'} value={symbol} mode={darkMode}/>}
        {isTestnet && <Field label={'Testnet'} value={isTestnet ? 'True' : 'False'} mode={darkMode}/>}
        {decimals && <Field label={'Decimals'} value={decimals} mode={darkMode}/>}
      
        <div className='code-field' style={{backgroundColor: darkMode ? 'white' : '#F6F6F6'}}>
          <div>
            <GithubLogo/>
            <a href={path} target="_blank" className='github-url'>{name}</a>
          </div>
          <Editor
            disabled
            highlight={code => hightlightWithLineNumbers(code, languages.js)}
            value={code}
            onValueChange={code => console.log(code)}
            padding={10}
          />
        
        </div>
      </React.Fragment>
    );
  };



  const [functionSelect, setFunctionSelect] = useState('createAddress()');
  const [mnemoic, setMnemoic] = useState('...');
  const [addressTemplate, setAddressTemplate] = useState('bip44');
  const [originalNumber, setOriginalNumber] = useState(1);
  const [purpose, setPurpose] = useState(44);
  const [chainId, setChainId] = useState(0);
  const [account, setAccount] = useState(0);
  const [txHex, setTxHex] = useState("");
  const [txMessage, setTxMessage] = useState("");
  const renderTest = () => {

    const testCode = 
    `{
  ${functionSelect}( 
    template=${addressTemplate}( 
    \tpurpose = ${purpose},
    \tchainId = ${chainId},
    \taccount = ${account},
    \tindex("${originalNumber}")${
      functionSelect === 'sign' ? `)\ntx='${txHex}'\n)` :
        functionSelect === 'signMessage'?
           `)\nmessage='${txMessage}'\n)` : "))" 
      }
}
    `

    return (
      <React.Fragment>

        <Field label="Select function"  mode={darkMode}>
          <div className="test-select">
            <Select value={functionSelect} onChange={(e)=>setFunctionSelect(e)} >
              <Option value="createAddress">createAddress()</Option>
              <Option value="sign">sign()</Option>
              <Option value="signMessage">signMessage()</Option>
            </Select>
          </div>
        </Field>


        <Field label="Mnemoic phrase" mode={darkMode}>
          <input value={mnemoic} className="test-input" onChange={(e)=>setMnemoic(e.target.value)}/>
        </Field>

        <hr />

        <Field label="Address template" mode={darkMode}>
          <div className="test-select">
            <Select value={addressTemplate} onChange={(e)=>setAddressTemplate(e)} >
              <Option value="bip44">bip44</Option>
              <Option value="bip39">bip39</Option>
              <Option value="bip32">bip32</Option>
            </Select>
          </div>
        </Field>

        <Field label="Original number of the address" mode={darkMode}>
          <div className="test-select">
            <Select value={originalNumber} onChange={(e)=>setOriginalNumber(e)} >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
            </Select>
          </div>
        </Field>

        <Field label="Purpose" mode={darkMode}>
          <input value={purpose} className="test-input" onChange={(e)=>setPurpose(e.target.value)}/>
        </Field>

        <Field label="ChainID" mode={darkMode}>
          <input value={chainId} className="test-input" onChange={(e)=>setChainId(e.target.value)}/>
        </Field>

        <Field label="Account" mode={darkMode}>
          <input value={account} className="test-input" onChange={(e)=>setAccount(e.target.value)}/>
        </Field>

        <div style={{display: functionSelect === 'sign' ? "block" : "none"}}>
          <Field label="Transaction hex" mode={darkMode}>
            <textarea  value={txHex} onChange={(e)=>setTxHex(e.target.value)}></textarea>
          </Field>
        </div>

        <div style={{display: functionSelect === 'signMessage' ? "block" : "none"}}>
          <Field label="Enter message" mode={darkMode} onChange> 
            <textarea value={txMessage} onChange={(e)=>setTxMessage(e.target.value)}></textarea>
          </Field>
        </div>
        <hr />
        <button className='test-button'>Test</button>

        <div className="code-editor">
          <Editor disabled value={testCode} highlight={functionSelect =>hightlightWithLineNumbers(testCode, languages.js)} padding={10}/>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Tabs onClickTabCallback={onClickTabCallback}/>
      <div style={{display: showInfo ? 'block' : 'none'}}>
        {renderInfo()}
      </div>
      <div className="test-mode" style={{display: showInfo ? 'none' : 'block'}}>
        {renderTest()}
      </div>
    </div>
  );
}
//<Info selectedValue darkMode onDarkModeChange />
/*
<Editor
            disabled
            highlight={code => hightlightWithLineNumbers(code, languages.js)}
            value={code}
            onValueChange={code => console.log(code)}
            padding={10}
          />
*/