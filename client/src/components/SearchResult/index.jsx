import React, {useState} from 'react';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism.css";

import Tabs from "../Tabs";
import InfoTab from "./InfoTab";
import TestTab from "./TestTab";

import './SearchResult.css';

export default function SearchResult({selectedValue}) {
  const [showInfo, setShowInfo] = useState(true);

  const onClickTabCallback = (tab) => {
    setShowInfo(tab);
  };

  return (
    <div>
      <Tabs onClickTabCallback={onClickTabCallback}/>
      <div style={{display: showInfo ? 'block' : 'none'}}>
        <InfoTab selectedValue={selectedValue}/>
      </div>
      <div className="test-mode" style={{display: showInfo ? 'none' : 'block'}}>
        <TestTab selectedValue={selectedValue}/>
      </div>
    </div>
  );
}
