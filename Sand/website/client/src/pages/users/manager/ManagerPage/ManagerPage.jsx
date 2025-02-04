import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './ManagerPage.css';

// import AdminCampaignDetailsPage from '../../admin/pages/AdminCampaignDetailsPage/AdminCampaignDetailsPage'
// import AdminFormDetails from '../../admin/pages/AdminFormDetails/AdminFormDetails'
// import AdminFormItems from '../../admin/pages/AdminFormItems/AdminFormItems'
import ManagerProfilePage from '../ManagerProfilePage/ManagerProfilePage';
import ManagerLandingPage from '../ManagerLandingPage/ManagerLandingPage';
import ManagerViewAttendance from '../ManagerViewAttendance/ManagerViewAttendance';
import ManagerCreateNewClient from '../ManagerCreateNewClient/ManagerCreateNewClient';
import ManagerViewClient from '../ManagerViewClient/ManagerViewClient';

import AdminViewCampaignsPage from '../../admin/pages/AdminViewCampaignsPage/AdminViewCampaignsPage';
import AdminCampaignDetailsPage from '../../admin/pages/AdminCampaignDetailsPage/AdminCampaignDetailsPage';
import AdminFormDetails from '../../admin/pages/AdminFormDetails/AdminFormDetails';
import AdminFormItems from '../../admin/pages/AdminFormItems/AdminFormItems';
import AdminNestedViewData from '../../admin/pages/AdminNestedViewData/AdminNestedViewData';
const ManagerPage = () => {
    return (
        <>
            <div className="vertical-navbar">
                <ManagerLandingPage></ManagerLandingPage>
            </div>
            <div className="Manager-page-content">
                <Routes>
                    <Route path="" element={<ManagerLandingPage />} />
                    <Route path="profile" element={<ManagerProfilePage />} />
                    <Route path="promoterAttendance" element={<ManagerViewAttendance     />} />
                    <Route path="newClient" element={<ManagerCreateNewClient />} />
                    <Route path="viewClients" element={<ManagerViewClient />} />
                    <Route path="viewClients/client-detail/:clientId" element={<AdminViewCampaignsPage  role = "manager"/>} />
                    <Route path="viewClients/client-detail/:clientId/campaignDetailsPage/:campaignId" element={<AdminCampaignDetailsPage role =""/>} />
                    <Route path="viewClients/client-detail/:clientId/campaignDetailsPage/:campaignId/viewForms" element={<AdminFormDetails />} />
                    <Route path = "viewClients/client-detail/:clientId/campaignDetailsPage/:campaignId/viewForms/viewFormData/:formId" element={<AdminFormItems role ="admin"/>} />
                    <Route path = "viewClients/client-detail/:clientId/campaignDetailsPage/:campaignId/viewForms/viewFormData/:formId/viewNestedFormData" element={<AdminNestedViewData />} />  
                </Routes>
            </div>

        </>
    )
}

export default ManagerPage;
