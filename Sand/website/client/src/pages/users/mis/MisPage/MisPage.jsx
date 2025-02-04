import React from 'react'
import MisProfilePage from '../MisProfilePage/MisProfilePage'
import MisLandingPage from '../MisLandingPage/MisLandingPage'
import { Routes, Route } from 'react-router-dom'
import MisViewAttendance from '../MisViewAttendance/MisViewAttendance'
import './MisPage.css';
import MisViewCampaign from '../MisViewCampaign/MisViewCampaign'
import AdminCampaignDetailsPage from '../../admin/pages/AdminCampaignDetailsPage/AdminCampaignDetailsPage'
import AdminFormDetails from '../../admin/pages/AdminFormDetails/AdminFormDetails'
import AdminFormItems from '../../admin/pages/AdminFormItems/AdminFormItems'
const MisPage = () => {
    return (
        <>
            <div className="vertical-navbar">
                <MisLandingPage></MisLandingPage>
            </div>
            <div className="Mis-page-content">
                <Routes>
                    <Route path="" element={<MisViewCampaign />} />
                    <Route path="profile" element={<MisProfilePage />} />
                    <Route path="promoterAttendance" element={<MisViewAttendance />} />
                    {/* <Route path="viewCampaigns" element={<MisViewCampaign />} /> */}
                    <Route path="campaignDetailsPage/:campaignId" element={<AdminCampaignDetailsPage />} />
                    <Route path="campaignDetailsPage/:campaignId/viewForms" element={<AdminFormDetails />} />
                    <Route path = "campaignDetailsPage/:campaignId/viewForms/viewFormData/:formId" element={<AdminFormItems />} />
                </Routes>
            </div>

        </>
    )
}

export default MisPage;
