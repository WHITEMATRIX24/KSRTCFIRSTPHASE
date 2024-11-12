import React, { useEffect, useState } from 'react'
import Header from '../components/common/Header'
import RealTimeData from '../components/RealTimeData/RealTimeData'
import './Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faBus, faIndianRupee, faCarBurst, faCarSide, faChevronRight, faCircleExclamation, faFan, faGasPump, faGauge, faHandHoldingDollar, faLocationDot, faOilCan, faScrewdriverWrench, faTowerBroadcast, faTriangleExclamation, faVanShuttle } from '@fortawesome/free-solid-svg-icons'
import ChartPie from '../components/ChartPie'
import ChartBar from '../components/ChartBar'
import { faServicestack } from '@fortawesome/free-brands-svg-icons'
import { getAllTripApi, getAllVehiclesApi, getOnRouteServicesApi, getAvilableServicesApi, getAllCompletedTripApi, getAllOutofServicesApi } from '../services/allAPI'




function Dashboard() {
  const [AllvehicleData, setAllVehicleData] = useState({})
  const [AllTripDataCount, setAllTripDataCount] = useState(0)
  const [AllOnRouteBusesCount, setAllOnRouteBusesCount] = useState(0)
  const [AllBusesInServiceCount, setAllBusesInServiceCount] = useState(0)
  const [TotalCollection, setTotalcollection] = useState(0)
  const [TotalFuelConsumption, setTotalFuelComsumption] = useState(0)
  const [outOfServicesCount, setOutOfServicesCount] = useState(0);


  // const[CompletedTripDetails,setCompletedTripDetails]=useState({})

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
  const getOutOfServicesCount = async () => {
    const result = await getAllOutofServicesApi();
    console.log(result);
    const count = result.data.length;
    setOutOfServicesCount(count);
  };

  //get All buses in servises
  const getAllBusesInServices = async () => {
    const result = await getAvilableServicesApi()
    const count = result.data.length
    setAllBusesInServiceCount(count);
  }

  // get All completed Trip details
  const getAllCompletedTripDetails = async () => {
    const result = await getAllCompletedTripApi()
    // Fuel Consumption total
    const ftotal = result.data.reduce((total, item) => {
      return total + item.fuelCost;
    }, 0)
    setTotalFuelComsumption(ftotal)
    // Total Collection total
    const ctotal = result.data.reduce((total, item) => {
      return total + item.collection_amount;
    }, 0)
    setTotalcollection(ctotal);
    // setCompletedTripDetails(result.data);
  }

  useEffect(() => {
    getAllVehicleDetails()
    getAllTripDetails()
    getAllOnRouteDetails()
    getAllBusesInServices()
    getAllCompletedTripDetails()
    getOutOfServicesCount()
  }, [])

  // console.log(TotalCollection,TotalFuelConsumption);



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

            <div className="row mt-2 ">
              <div className="col-md-3">
                <div style={{ backgroundColor: 'white' }} className='vehicle-data shadow w-100'>
                  <FontAwesomeIcon icon={faLocationDot} style={{ color: "#f73b3b", fontSize: '20px' }} className='ms-3 mt-2' />
                  <div className='d-flex align-items-center justify-content-center flex-column vehicle-data-text' >
                    <p className='fw-bold fs-4 mt-3'>{AllTripDataCount}</p>
                    <h6 className='text-secondary' style={{ fontSize: '13px', fontWeight: 'normal' }}>Total number of trips</h6></div>
                </div>
              </div>
              <div className="col-md-3">
                <div style={{ backgroundColor: 'white' }} className='vehicle-data shadow  w-100'>
                  <FontAwesomeIcon icon={faIndianRupee} style={{ color: "#f73b3b", fontSize: '25px' }} className='ms-3 mt-1' />
                  <div className='d-flex align-items-center justify-content-center flex-column vehicle-data-text '>
                    <p className='fw-bold fs-4 mt-3'>{TotalCollection - TotalFuelConsumption}</p>
                    <h6 className='text-secondary' style={{ fontSize: '13px', fontWeight: 'normal' }}>Total Revenue</h6></div>
                </div>
              </div>
              <div className="col-md-3">
                <div style={{ backgroundColor: 'white' }} className='vehicle-data shadow  w-100'>
                  <FontAwesomeIcon icon={faBus} style={{ color: "#f73b3b", fontSize: '20px' }} className='ms-3 mt-2' />
                  <div className='d-flex align-items-center justify-content-center flex-column vehicle-data-text '> <p className='fw-bold fs-4 mt-3'>{AllOnRouteBusesCount}</p>
                    <h6 className='text-secondary' style={{ fontSize: '13px', fontWeight: 'normal' }}>Total number of buses in route</h6></div>
                </div>
              </div>
              <div className="col-md-3">
                <div style={{ backgroundColor: 'white' }} className='vehicle-data  shadow  w-100 '>
                  <FontAwesomeIcon icon={faServicestack} style={{ color: "#f73b3b", fontSize: '25px' }} className='ms-3 mt-1' />
                  <div className='d-flex align-items-center justify-content-center flex-column vehicle-data-text '> <p className='fw-bold fs-4 mt-3'>{outOfServicesCount}</p>
                    <h6 className='text-secondary' style={{ fontSize: '13px', fontWeight: 'normal' }}>Total number of buses out of service</h6></div>
                </div>
              </div>
            </div>



            {/* Section 2 */}
            <div className="row mt-2">
              <div className="col-md-6 " >
                <div className='p-3 shadow' style={{ backgroundColor: 'white' }}>
                  {/* Pie Chart */}
                  <h3 style={{ color: '#737373', fontWeight: "600", padding: "10px" }}>FLEET OVERVIEW</h3>
                  <ChartPie data={AllvehicleData} />
                  <h5 style={{ color: '#737373', fontWeight: "600", padding: "10px" }}>Total Fleet Size: {AllvehicleData.length}</h5>

                </div>

              </div>
              <div className="col-md-6">
                <div className='p-3 shadow' style={{ backgroundColor: 'white' }}>
                  <h3 style={{ color: '#737373', fontWeight: "600", padding: "10px" }}>REVENUE OVERVIEW</h3>

                  {/* Bar Chart */}
                  <ChartBar collection={TotalCollection} fuelconsumtion={TotalFuelConsumption} revenew={TotalCollection - TotalFuelConsumption} />
                  <div style={{ padding: "25px" }}></div>

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