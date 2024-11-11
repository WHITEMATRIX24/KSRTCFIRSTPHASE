import React from 'react'
import TripOverviewComponent from './TripOverviewComponent'
import Header from '../../components/common/Header'
import './TripOverview.css'

function TripOverview() {
  return (
    <>
      <Header />
      <div className="row mt-1" style={{ width: "100%" }}>
        <div className="col-2"></div>
        <div className="col-10 border">
          <TripOverviewComponent />
        </div>
      </div>

    </>
  )
}

export default TripOverview
