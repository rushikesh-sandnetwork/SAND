import React from 'react';
import PageTitle from '../../../../../components/PageTitles/PageTitle';
import './MisViewCampaign.css';
import ViewCampaignsContainer from '../../../../../components/ViewCampaignsContainer/ViewCampaignsContainer';

const MisViewCampaign = ({ setActiveTab  }) => {
    return (
        <div className="adminViewCampaignsPage-container">
            <PageTitle title={`View Campaigns`} />
            <ViewCampaignsContainer setActiveTab={setActiveTab} />
        </div>
    );
}

export default MisViewCampaign;
