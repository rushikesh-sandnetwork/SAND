import React from 'react';
import './MisViewCampaign.css';
import ViewCampaignsContainer from '../../../../components/ViewCampaignsContainer/ViewCampaignsContainer';
import PageTitle from '../../../../components/PageTitles/PageTitle';

const MisViewCampaign = ({ setActiveTab  }) => {
    return (
        <div className="adminViewCampaignsPage-container">
            <PageTitle title={`View Campaigns`} />
            <ViewCampaignsContainer setActiveTab={setActiveTab} role="mis"/>
        </div>
    );
}

export default MisViewCampaign;
