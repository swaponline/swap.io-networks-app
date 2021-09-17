import React from 'react';
import './Field.css';

export default function Field({label, value, disabled, children}) {
  return (
    <div className='info-field input-field' style={{backgroundColor: disabled ? '#F6F6F6' : 'white'}}>
      <div className='info-label'>{label}</div>
      <div className='info-value'>{value}</div>
      {children}
   </div>
  );
}
