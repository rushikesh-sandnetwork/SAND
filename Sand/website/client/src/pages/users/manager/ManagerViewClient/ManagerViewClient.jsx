import React from 'react'
import PageTitle from '../../../../components/PageTitles/PageTitle';
import './ManagerViewClient.css'
import ViewClientsContainer from '../../../../components/ViewClientsContainer/ViewClientsContainer';
const ManagerViewClient = () => {
  return (
    <div className="adminViewClientsPage-container">
            <PageTitle title="View Clients" />
            <ViewClientsContainer role="manager" ></ViewClientsContainer>
    </div>
  )
}

export default ManagerViewClient
