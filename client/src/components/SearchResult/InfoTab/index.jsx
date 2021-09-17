import React, {useState} from 'react';
import {Switch} from "antd";

import Editor from "react-simple-code-editor";
import Prism from 'prismjs';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism.css";
import { ReactComponent as GithubLogo } from "../../../assets/svg/github.svg";

import Field from "../../Field";

export default function InfoTab({selectedValue}) {
  const {name, network, address, symbol, decimals, isTestnet, logo} = selectedValue?._source;
  const logoUrl = `https://raw.githubusercontent.com/swaponline/swap.io-networks/main${logo}`;
  const code = JSON.stringify(selectedValue._source, null, 4);
  const pathUrl = logo?.replace('logo.png', 'info.json');
  const path = `https://github.com/swaponline/swap.io-networks/tree/main${pathUrl}`;

  const [darkMode, setDarkMode] = useState(false);

  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, Prism.languages.javascript, 'javascript')
      .split("\n")
      .map((line, i) => `<span class='editorLineNumber'>${i + 1}. </span>${line}`)
      .join("\n");


    return (
      <React.Fragment>
        <div className='info-field logo-field' style={{backgroundColor: darkMode && '#101010', color: darkMode && 'white'}}>
          <div><img alt='logo' src={logoUrl}/>Logo.svg</div>
          <div><span>{darkMode ? 'On black': 'On white'}</span><Switch className='custom-switch' size="small" onChange={()=>setDarkMode(!darkMode)} /></div>
        </div>

        {<Field label={'Name'} value={name} disabled/>}
        {network && <Field label={'Network'} value={network} disabled/>}
        {address && <Field label={'Address'} value={address} disabled/>}
        {symbol && <Field label={'Symbol'} value={symbol} disabled/>}
        {isTestnet && <Field label={'Testnet'} value={isTestnet ? 'True' : 'False'} disabled/>}
        {decimals && <Field label={'Decimals'} value={decimals} disabled/>}

        <div className='code-field' style={{backgroundColor: '#F6F6F6'}}>
          <div>
            <GithubLogo/>
            <a href={path} target="_blank" rel="noreferrer" className='github-url'>{name}</a>
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
}
