import React, {useEffect} from 'react';
import {Switch} from "antd";
import Editor from "react-simple-code-editor";
import Prism from 'prismjs';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism.css";
import { ReactComponent as GithubLogo } from "../../assets/svg/github.svg";
import Field from "../Field";
import './SearchResult.css';

export default function SearchResult({selectedValue}) {
  console.log('Search result selected', selectedValue);
  const {name, network, address, symbol, decimals, isTestnet, logo} = selectedValue;
  const logoUrl = `https://raw.githubusercontent.com/swaponline/swap.io-networks/main${logo}`;
  const code = JSON.stringify(selectedValue, null, 4);
  const pathUrl = logo.replace('logo.png', 'info.json');
  const path = `https://github.com/swaponline/swap.io-networks/tree/main${pathUrl}`;
  // const code = `function add(a, b) {
  //   return a + b;
  // }
  //
  // const a = 123;
  // `;

  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, Prism.languages.javascript, 'javascript')
      .split("\n")
      .map((line, i) => `<span class='editorLineNumber'>${i + 1}. </span>${line}`)
      .join("\n");

  return (
    <div>
      <div className='info-field logo-field'>
        <div><img alt='logo' src={logoUrl}/>Logo.svg</div>
        <div><span>Dark mode</span><Switch size="small" /></div>
      </div>
      <Field label={'Name'} value={name}/>
      {network && <Field label={'Network'} value={network}/>}
      {address && <Field label={'Address'} value={address}/>}
      {symbol && <Field label={'Symbol'} value={symbol}/>}
      {isTestnet && <Field label={'Testnet'} value={isTestnet ? 'True' : 'False'}/>}
      {decimals && <Field label={'Decimals'} value={decimals}/>}
      <div className='code-field'>
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
    </div>
  );
}
