import React from 'react';
import './Field.css';

export default function Field({label, value, mode,children}) {
  return (
    <div className='info-field input-field' style={{backgroundColor: mode ? 'white' : '#F6F6F6'}}>
      <div className='info-label'>{label}</div>
      <div className='info-value'>{value}</div>
      {children}
   </div>
  );
}
