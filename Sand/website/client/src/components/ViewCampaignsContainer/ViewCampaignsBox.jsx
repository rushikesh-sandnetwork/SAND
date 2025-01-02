import React from 'react';
import './ViewCampaignsBox.css';

const ViewCampaignsBox = ({ campaign, url, campaignId, setActiveTab }) => {
  return (
    <div className="viewCampaignsBox">
      <img src={url} alt={campaign.title} className="campaignImage" />
      <div className="campaignDetails">
        <h3>{campaign.title}</h3>
        <input
          type="button"
          value="More Details >"
          className="detailsBtn"
          onClick={() => {
            setActiveTab(`campaignDetailsPage/${campaignId}`);
          }}
        />
      </div>
    </div>
  );
};

export default ViewCampaignsBox;
