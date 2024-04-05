import React, { useState } from 'react';

function DynamicSelect() {
 const [options, setOptions] = useState(['Opção 1', 'Opção 2', 'Opção 3']);
 const [selectedOptions, setSelectedOptions] = useState([]);

 const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedOptions(prevOptions => [...prevOptions, selectedOption]);
    setOptions(prevOptions => prevOptions.filter(option => option !== selectedOption));
 };

 const handleRemoveOption = (optionToRemove) => {
    setSelectedOptions(prevOptions => prevOptions.filter(option => option !== optionToRemove));
    setOptions(prevOptions => [...prevOptions, optionToRemove]);
 };

 return (
    <div>
      <select onChange={handleSelectChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>

      <div>
        {selectedOptions.map((option, index) => (
          <div key={index}>
            {option}
            <button onClick={() => handleRemoveOption(option)}>Remover</button>
          </div>
        ))}
      </div>
    </div>
 );
}

export default DynamicSelect;
