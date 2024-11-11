import React, { useEffect, useState } from 'react'
import Header from '../components/common/Header'
import RealTimeData from '../components/RealTimeData/RealTimeData'
import './Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faBus, faIndianRupeeSign, faCarBurst, faCarSide, faChevronRight, faCircleExclamation, faFan, faGasPump, faGauge, faHandHoldingDollar, faLocationDot, faOilCan, faScrewdriverWrench, faTowerBroadcast, faTriangleExclamation, faVanShuttle } from '@fortawesome/free-solid-svg-icons'
import ChartPie from '../components/ChartPie'
import ChartBar from '../components/ChartBar'
import { faServicestack } from '@fortawesome/free-brands-svg-icons'
import { getAllTripApi, getAllVehiclesApi } from '../services/allAPI'



function Dashboard() {
  const [AllvehicleData, setAllVehicleData] = useState({})
  const [AllTripDataCount, setAllTripDataCount] = useState(0)
  const [AllOnRouteBusesCount, setAllOnRouteBusesCount] = useState(0)

  // get all Vehicle details
  const getAllVehicleDetails = async () => {

    const result = await getAllVehiclesApi()
    // console.log(result.data);
    setAllVehicleData(result.data)

  }

  // get all trip details
  const getAllTripDetails = async () => {
    const result = await getAllTripApi()
    // console.log(result);
    const count = result.data.length;
    setAllTripDataCount(count)
  }

  //get total number of bussess in route
  const getAllOnRouteDetails = async () => {
    const result = await getOnRouteServicesApi()
    // console.log(result);
    const count = result.data.length;
    setAllOnRouteBusesCount(count)
  }

  useEffect(() => {
    getAllVehicleDetails()
    getAllTripDetails()
    getAllOnRouteDetails()

  }, [])

  // console.log(AllTripData);

  return (
    <>
      <Header />
      <div className='container-fluid w-100 dashboard-container'>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-10">
            <RealTimeData />
            {/* section1 */}
            {/* Dashboard Content */}
            <div className='d-flex mt-2'>
              <div style={{ backgroundColor: 'white' }} className='vehicle-data shadow mx-1'>
                <FontAwesomeIcon icon={faLocationDot} style={{ color: "#f73b3b", fontSize: '20px' }} className='ms-3 mt-2' />
                <div className='d-flex align-items-center justify-content-center flex-column vehicle-data-text' >
                  <p className='fw-bold fs-4 mt-3'>{AllTripDataCount}</p>
                  <h6 className='text-secondary' style={{ fontSize: '13px', fontWeight: 'normal' }}>Total number of trips</h6></div>
              </div>

              <div style={{ backgroundColor: 'white' }} className='vehicle-data shadow mx-1'>
                <FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: "#f73b3b", fontSize: '25px' }} className='ms-3 mt-1' />
                <div className='d-flex align-items-center justify-content-center flex-column vehicle-data-text '>
                  <p className='fw-bold fs-4 mt-3'>1400</p>
                  <h6 className='text-secondary' style={{ fontSize: '13px', fontWeight: 'normal' }}>Total Revenue</h6></div>
              </div>

              <div style={{ backgroundColor: 'white' }} className='vehicle-data shadow  mx-1'>
                <FontAwesomeIcon icon={faBus} style={{ color: "#f73b3b", fontSize: '20px' }} className='ms-3 mt-2' />
                <div className='d-flex align-items-center justify-content-center flex-column vehicle-data-text '> <p className='fw-bold fs-4 mt-3'>6</p>
                  <h6 className='text-secondary' style={{ fontSize: '13px', fontWeight: 'normal' }}>Total number of buses on route</h6></div>
              </div>

              <div style={{ backgroundColor: 'white' }} className='vehicle-data  shadow mx-1 '>
                <FontAwesomeIcon icon={faServicestack} style={{ color: "#f73b3b", fontSize: '25px' }} className='ms-3 mt-1' />
                <div className='d-flex align-items-center justify-content-center flex-column vehicle-data-text '> <p className='fw-bold fs-4 mt-3'>3</p>
                  <h6 className='text-secondary' style={{ fontSize: '13px', fontWeight: 'normal' }}>Total number of buses in services</h6></div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="row mt-4">
              <div className="col-md-6 " >
                <div className='p-3' style={{ backgroundColor: 'white' }}>
                  {/* Pie Chart */}
                  <h3 style={{ alignItem: 'center', fontWeight: '600', color: "#737373" }}>FLEET OVERVIEW</h3>
                  <ChartPie data={AllvehicleData} />
                  {/* <h3 style={{ alignItem: 'center' }}>Fleet Overview</h3> */}
                  <h4 style={{ alignItem: 'center', fontWeight: '600', color: "#737373" }}>Total Fleet Size: {AllvehicleData.length}</h4>
                </div>

              </div>
              <div className="col-md-6">
                <div className='p-3' style={{ backgroundColor: 'white' }}>
                  <h3 style={{ alignItem: 'center', fontWeight: '600', color: "#737373" }}>REVENUE OVERVIEW</h3>
                  {/* Bar Chart */}
                  <ChartBar />

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>


    </>
  )
}

export default Dashboard