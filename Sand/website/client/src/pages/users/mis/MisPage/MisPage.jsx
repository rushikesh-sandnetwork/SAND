import React from 'react'
import MisProfilePage from '../MisProfilePage/MisProfilePage'
import MisLandingPage from '../MisLandingPage/MisLandingPage'
import { Routes, Route } from 'react-router-dom'
import MisViewAttendance from '../MisViewAttendance/MisViewAttendance'
import './MisPage.css';
import MisViewCampaign from '../MisViewCampaign/MisViewCampaign'
const MisPage = () => {
    return (
        <>
            <div className="vertical-navbar">
                <MisLandingPage></MisLandingPage>
            </div>
            <div className="Mis-page-content">
                <Routes>
                    <Route path="" element={<MisLandingPage />} />
                    <Route path="profile" element={<MisProfilePage />} />
                    <Route path="promoterAttendance" element={<MisViewAttendance />} />
                    <Route path="viewCampaigns" element={<MisViewCampaign />} />
                </Routes>
            </div>

        </>
    )
}

export default MisPage;
