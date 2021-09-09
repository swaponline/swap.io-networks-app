import React from 'react';
import './Field.css';

export default function Field({label, value}) {
  return (
    <div className='info-field input-field'>
      <div className='info-label'>{label}</div>
      <div className='info-value'>{value}</div>
    </div>
  );
}
