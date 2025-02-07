import React from 'react';
import './ManagerOverViewPage.css';
import OverViewTileOne from '../../../../components/OverViewTile1/OverViewTileOne';
import OverViewTileTwo from '../../../../components/OverViewTile2/OverViewTileTwo';
import PageTitle from '../../../../components/PageTitles/PageTitle';

const ManagerOverViewPage = ({setActiveTab}) => {
  return (
    <div className="admin-overview-container">
      <PageTitle title="Overview" />
      <OverViewTileOne />
      <OverViewTileTwo  setActiveTab= {setActiveTab}/>
    </div>
  );
}

export default ManagerOverViewPage;