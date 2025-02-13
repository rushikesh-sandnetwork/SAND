import React from "react";
import { useNavigate } from "react-router-dom";
import "./CampaignDeleteBox.css";
import axios from "axios";
const CampaignDeleteBox = ({ campaignId, title, imgSrc, setActiveTab }) => {
  const handleDeleteClient = async () => {
    // Confirmation dialog before deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this campaign?");
    
    if (!isConfirmed) {
      return; // Stop execution if the user cancels
    }
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/v1/admin/deleteCampaign",
        {
          data: { campaignId },
        }
      );

      if (response.status === 200) {
        alert("Campaign deleted successfully.");
        setActiveTab("viewClients");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete campaign");
    }
  };

  return (
    <div className="campaign-delete-box">
      <div className="icon-box">
        <img src={imgSrc} alt="" />
      </div>
      <input
        type="button"
        className="detailsBtn"
        value={title}
        onClick={handleDeleteClient}
      />
    </div>
  );
};

export default CampaignDeleteBox;
