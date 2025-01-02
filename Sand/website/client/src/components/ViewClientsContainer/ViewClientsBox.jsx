import React from 'react';
import './ViewClientsBox.css';

const ViewClientsBox = ({ imgSrc, clientName, clientId, setActiveTab }) => {
  return (
    <div className="viewClientsBox-container">
      <img src={imgSrc} alt={clientName} className="clientImage" />
      <h3>{clientName}</h3>
      <input
        type="button"
        value="More Details >"
        className="detailsBtn"
        onClick={() => setActiveTab(`client-detail/${clientId}`)}
      />
    </div>
  );
};

export default ViewClientsBox;