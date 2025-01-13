import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDrag } from 'react-dnd';
import './Email.css';
import { setFullNameData } from '../actions/fullNameActions';
import { v4 as uuidv4 } from 'uuid';

const Email = ({ fullNameDataList, setFullNameData }) => {
  const [componentId] = useState(uuidv4()); // Unique ID for this component instance

  const handleBlur = (event) => {
    const inputValue = event.target.value.trim();

    if (inputValue) {
      const existingEntry = fullNameDataList.find(
        (entry) => entry.uniqueId === componentId // Check if the entry already exists
      );

      if (existingEntry) {
        // Update the existing entry
        setFullNameData(existingEntry.uniqueId, inputValue, 'Email');
      } else {
        // Create a new entry
        setFullNameData(componentId, inputValue, 'Email');
      }
    }
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: 'item',
    item: { id: componentId, type: 'Email', text: 'Email' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    console.log('Full Name Data List:', fullNameDataList);
  }, [fullNameDataList]);

  return (
    <div className={`email-container ${isDragging ? 'dragging' : ''}`} ref={dragRef}>
      <input
        type="email"
        name="emailTitle"
        className="email-title"
        placeholder="Email"
        onBlur={handleBlur} // Trigger save on losing focus
      />
      <input
        type="text"
        name="emailInput"
        className="email-input"
        placeholder="Additional Info"
        onBlur={handleBlur} // Trigger save for additional info
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  fullNameDataList: state.fullName.fullNameDataList,
});

const mapDispatchToProps = {
  setFullNameData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Email);
