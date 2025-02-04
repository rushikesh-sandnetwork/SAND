import React from 'react'
import PageTitle from '../../../../components/PageTitles/PageTitle';
import './ManagerViewClient.css'
import ViewClientsContainer from '../../../../components/ViewClientsContainer/ViewClientsContainer';
const ManagerViewClient = ({}) => {
  return (
    <div className="adminViewClientsPage-container">
            <PageTitle title="View Clients" />
            <ViewClientsContainer ></ViewClientsContainer>
    </div>
  )
}

export default ManagerViewClient
