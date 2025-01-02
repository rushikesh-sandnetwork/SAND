import React from 'react'
import "./OverViewTileTwo.css"
const OverViewTileTwoBox = ({id, title, details, setActiveTab }) => {
  return (
    <div className="OverViewTileTwoBox-container">
      <h1 className='container-title'>{title}</h1>
      <p className='container-content'>{details}</p>
      <input className="moredetailsBtn" type="button" value="MORE DETAILS >"
        onClick={() => {
          setActiveTab(`campaignDetailsPage/${id}`);
        }}
      />
    </div>
  )
}

export default OverViewTileTwoBox
