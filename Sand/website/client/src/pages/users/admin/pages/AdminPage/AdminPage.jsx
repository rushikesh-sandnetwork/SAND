import React from 'react'
import AdminLandingPage from '../AdminLandingPage/AdminLandingPage'
import { Routes, Route } from 'react-router-dom';
import AdminOverViewPage from '../AdminOverViewPage/AdminOverViewPage';
import './AdminPage.css'
import AdminCreateNewClient from '../AdminCreateNewClient/AdminCreateNewClient';
import AdminViewClientsPage from '../AdminViewClientsPage/AdminViewClientsPage';
import AdminCreateNewUser from '../AdminCreateNewUser/AdminCreateNewUser';
import AdminViewAttendance from '../AdminViewAttendance/AdminViewAttendance';
import AdminCampaignDetailsPage from '../AdminCampaignDetailsPage/AdminCampaignDetailsPage';
import AdminProfilePage from '../AdminProfilePage/AdminProfilePage';
const AdminPage = () => {
    return (
        <>
            <div className="vertical-navbar">
                <AdminLandingPage></AdminLandingPage>
            </div>
            <div className="admin-page-content">
                <Routes>
                    <Route path="" element={<AdminOverViewPage />} />
                    <Route path="newClient" element={<AdminCreateNewClient />} />
                    <Route path="viewClients" element={<AdminViewClientsPage />} />
                    <Route path="profile" element={<AdminProfilePage />} />
                    <Route path="newUser" element={<AdminCreateNewUser />} />
                    <Route path="promoterAttendance" element={<AdminViewAttendance />} />
                    <Route path="campaignDetailsPage/:id" element={<AdminCampaignDetailsPage/>}/>
                </Routes>
            </div>


        </>
    )
}


export default AdminPage


