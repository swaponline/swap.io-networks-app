import React from 'react';
import './Header.css';
import { ReactComponent as Logo } from '../../assets/svg/logo.svg';
import { ReactComponent as GithubLogo } from "../../assets/svg/github.svg";

export default function Header() {

  return (
    <div className='header'>
      <div className='left'>
        <Logo/>
        <div className='header-title'>Networks.swap.io</div>
      </div>
      <div className='right'>
        <a className='github-button' href='https://github.com/swaponline/swap.io-networks'><GithubLogo/> Github</a>
      </div>
    </div>
  )
}
