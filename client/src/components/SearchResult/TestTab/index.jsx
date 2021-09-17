import React, {useState} from 'react';
import {Select} from "antd";

import Editor from "react-simple-code-editor";
import Prism from 'prismjs';

import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism.css";

import Field from "../../Field";

const {Option} = Select;

export default function TestTab({selectedValue}) {

  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, Prism.languages.javascript, 'javascript')
      .split("\n")
      .map((line, i) => `<span class='editorLineNumber'>${i + 1}. </span>${line}`)
      .join("\n");


  const [functionSelect, setFunctionSelect] = useState('createAddress()');
  const [mnemoic, setMnemoic] = useState('...');
  const [addressTemplate, setAddressTemplate] = useState('bip44');
  const [originalNumber, setOriginalNumber] = useState(1);
  const [purpose, setPurpose] = useState(44);
  const [chainId, setChainId] = useState(0);
  const [account, setAccount] = useState(0);
  const [txHex, setTxHex] = useState("");
  const [txMessage, setTxMessage] = useState("");

  const testCode =
    `{
  ${functionSelect}( 
    template=${addressTemplate}( 
    \tpurpose = ${purpose},
    \tchainId = ${chainId},
    \taccount = ${account},
    \tindex("${originalNumber}")${
      functionSelect === 'sign' ? `)\ntx='${txHex}'\n)` :
        functionSelect === 'signMessage' ?
          `)\nmessage='${txMessage}'\n)` : "))"
    }
}
    `

  return (
    <React.Fragment>

      <Field label="Select function">
        <div className="test-select">
          <Select value={functionSelect} onChange={(e) => setFunctionSelect(e)}>
            <Option value="createAddress">createAddress()</Option>
            <Option value="sign">sign()</Option>
            <Option value="signMessage">signMessage()</Option>
          </Select>
        </div>
      </Field>


      <Field label="Mnemoic phrase">
        <input value={mnemoic} className="test-input" onChange={(e) => setMnemoic(e.target.value)}/>
      </Field>

      <hr/>

      <Field label="Address template">
        <div className="test-select">
          <Select value={addressTemplate} onChange={(e) => setAddressTemplate(e)}>
            <Option value="bip44">bip44</Option>
            <Option value="bip39">bip39</Option>
            <Option value="bip32">bip32</Option>
          </Select>
        </div>
      </Field>

      <Field label="Original number of the address">
        <div className="test-select">
          <Select value={originalNumber} onChange={(e) => setOriginalNumber(e)}>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
          </Select>
        </div>
      </Field>

      <Field label="Purpose">
        <input value={purpose} className="test-input" onChange={(e) => setPurpose(e.target.value)}/>
      </Field>

      <Field label="ChainID">
        <input value={chainId} className="test-input" onChange={(e) => setChainId(e.target.value)}/>
      </Field>

      <Field label="Account">
        <input value={account} className="test-input" onChange={(e) => setAccount(e.target.value)}/>
      </Field>

      <div style={{display: functionSelect === 'sign' ? "block" : "none"}}>
        <Field label="Transaction hex">
          <textarea value={txHex} onChange={(e) => setTxHex(e.target.value)}/>
        </Field>
      </div>

      <div style={{display: functionSelect === 'signMessage' ? "block" : "none"}}>
        <Field label="Enter message" onChange>
          <textarea value={txMessage} onChange={(e) => setTxMessage(e.target.value)}/>
        </Field>
      </div>
      <hr/>
      <button className='test-button'>Test</button>

      <div className="code-editor">
        <Editor disabled value={testCode}
                highlight={() => hightlightWithLineNumbers(testCode, languages.js)} padding={10}/>
      </div>
    </React.Fragment>
  );
}