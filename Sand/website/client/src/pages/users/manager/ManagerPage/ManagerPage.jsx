import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './ManagerPage.css';

// import AdminCampaignDetailsPage from '../../admin/pages/AdminCampaignDetailsPage/AdminCampaignDetailsPage'
// import AdminFormDetails from '../../admin/pages/AdminFormDetails/AdminFormDetails'
// import AdminFormItems from '../../admin/pages/AdminFormItems/AdminFormItems'
import ManagerProfilePage from '../ManagerProfilePage/ManagerProfilePage';
import ManagerLandingPage from '../ManagerLandingPage/ManagerLandingPage';
import ManagerViewAttendance from '../ManagerViewAttendance/ManagerViewAttendance';
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
                    {/* <Route path="viewCampaigns" element={<MisViewCampaign />} /> */}
                    {/* <Route path="campaignDetailsPage/:campaignId" element={<AdminCampaignDetailsPage />} />
                    <Route path="campaignDetailsPage/:campaignId/viewForms" element={<AdminFormDetails />} />
                    <Route path = "campaignDetailsPage/:campaignId/viewForms/viewFormData/:formId" element={<AdminFormItems />} /> */}
                </Routes>
            </div>

        </>
    )
}

export default ManagerPage;
