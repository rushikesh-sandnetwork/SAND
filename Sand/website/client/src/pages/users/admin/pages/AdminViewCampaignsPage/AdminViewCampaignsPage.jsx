import React from 'react';
import './AdminViewCampaignPage.css';
import ViewCampaignsContainer from '../../../../../components/ViewCampaignsContainer/ViewCampaignsContainer';
import PageTitle from '../../../../../components/PageTitles/PageTitle';

const AdminViewCampaignsPage = ({role}) => {
    return (
        <div className="adminViewCampaignsPage-container">
            <PageTitle title={`View Campaigns`} />
            <ViewCampaignsContainer  role={role}/>
        </div>
    );
}

export default AdminViewCampaignsPage;
