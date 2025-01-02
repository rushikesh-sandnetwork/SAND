import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminOverViewPage from "../AdminOverViewPage/AdminOverViewPage";
import AdminViewClientsPage from "../AdminViewClientsPage/AdminViewClientsPage";
import AdminProfilePage from "../AdminProfilePage/AdminProfilePage";
import AdminViewCampaignsPage from "../AdminViewCampaignsPage/AdminViewCampaignsPage";
import AdminCreateNewClient from "../AdminCreateNewClient/AdminCreateNewClient";
import AdminCampaignDetailsPage from "../AdminCampaignDetailsPage/AdminCampaignDetailsPage";
import AdminFormDetails from "../AdminFormDetails/AdminFormDetails";
import AdminCreateNewCampaign from "../AdminCreateNewCampaign/AdminCreateNewCampaign";
import AdminFormItems from "../AdminFormItems/AdminFormItems";
import AdminCreateNewUser from "../AdminCreateNewUser/AdminCreateNewUser";
import "./AdminLandingPage.css";
import "./AdminLandingPage.css";
import Logo from "./SAND 1 logo.png"; // Corrected import statement
import AdminViewAttendance from "../AdminViewAttendance/AdminViewAttendance";
import { useAuth } from "../../../../../context/AuthContext";

const AdminLandingPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeClient, setActiveClient] = useState("");
  const { id } = useParams(); // Destructure to get the `id` from useParams
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="LandingPage-container">
      <div className="sidebar">
        <div className="navbar">
          <img src={Logo} alt="" />
          <a onClick={() => setActiveTab("overview")}>Overview</a>
          <a onClick={() => setActiveTab("newClient")}>New Client</a>
          <a onClick={() => setActiveTab("viewClients")}>View Clients</a>
          <a onClick={() => setActiveTab("profile")}>Profile</a>
          <a onClick={() => setActiveTab("newUser")}>New User</a>
          <a onClick={() => setActiveTab("promoterAttendance")}>
            Promoter Attendance
          </a>
          <input type="button" value="Logout" onClick={handleLogout} />
        </div>
      </div>
      <div className="content">
        {activeTab === "overview" && (
          <AdminOverViewPage setActiveTab={setActiveTab} />
        )}
        {activeTab === "newClient" && <AdminCreateNewClient />}
        {activeTab === "viewClients" && (
          <AdminViewClientsPage
            setActiveTab={setActiveTab}
            setActiveClient={setActiveClient}
          />
        )}
        {activeTab === "profile" && <AdminProfilePage userId={id} />}{" "}
        {/* Pass `id` to AdminProfilePage */}
        {activeTab === "newUser" && <AdminCreateNewUser />}
        {activeTab === "promoterAttendance" && <AdminViewAttendance />}
        {activeTab.startsWith("client-detail") && (
          <AdminViewCampaignsPage
            clientId={activeTab.substring("client-detail".length + 1)}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab.startsWith("createNewCampaign") && (
          <AdminCreateNewCampaign
            clientId={activeTab.substring("createNewCampaign".length + 1)}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab.startsWith("campaignDetailsPage") && (
          <AdminCampaignDetailsPage
            campaignId={activeTab.substring("campaignDetailsPage".length + 1)}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab.startsWith("view-all-forms") && (
          <AdminFormDetails
            campaignId={activeTab.substring("view-all-forms".length + 1)}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab.startsWith("viewFormData") && (
          <AdminFormItems
            formId={activeTab.substring("viewFormData".length + 1)}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
};

export default AdminLandingPage;
