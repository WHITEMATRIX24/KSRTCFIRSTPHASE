import React, { useEffect, useState } from 'react'
import Header from '../components/common/Header'
import RealTimeData from '../components/RealTimeData/RealTimeData'
import './Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faBus, faIndianRupee, faCarBurst, faCarSide, faChevronRight, faCircleExclamation, faFan, faGasPump, faGauge, faHandHoldingDollar, faLocationDot, faOilCan, faScrewdriverWrench, faTowerBroadcast, faTriangleExclamation, faVanShuttle } from '@fortawesome/free-solid-svg-icons'
import ChartPie from '../components/ChartPie'
import ChartBar from '../components/ChartBar'
import { faServicestack } from '@fortawesome/free-brands-svg-icons'
import { getAllTripApi, getAllVehiclesApi, getOnRouteServicesApi, getAvilableServicesApi, getAllCollectionAPi, getAllOutofServicesApi, getAllAlottedDepoVehicleApi, getTripOfDepotApi, getAllUpcomingTripApi, getAllLiveTripApi, getAllConductor, getAllDrivers, getOnRouteServicesByDepoApi, getAllOutofServicesByDepoApi, getCollectionByDepoAPi } from '../services/allAPI'
import ExcelExport from '../components/ExcelExport '


function Dashboard() {
  const [AllvehicleData, setAllVehicleData] = useState([])
  const [AllTripDetails, setAllTripDetails] = useState([])
  const [AllUpcomingTDByDepo, setAllUpcomingTDByDepo] = useState([])
  const [AllLiveTripdetails, setAllLiveTripDetails] = useState([])
  // const [AllLiveTripdetailsbyDepo, setAllLiveTripDetailsbyDepo] = useState([])
  const [ConductorDetails, setConductorDetails] = useState([])
  const [DriverDetails, setDriverDetails] = useState([])
  const [AllTripDataCount, setAllTripDataCount] = useState(0)
  const [AllOnRouteBusesCount, setAllOnRouteBusesCount] = useState(0)
  const [AllBusesInServiceCount, setAllBusesInServiceCount] = useState(0)
  const [TotalCollection, setTotalcollection] = useState(0)
  const [TotalFuelConsumption, setTotalFuelComsumption] = useState(0)
  const [outOfServicesCount, setOutOfServicesCount] = useState(0);
  const [CompletedTripDetails, setCompletedTripDetails] = useState({})


  // get all Vehicle details
  const getAllVehicleDetails = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    if (userDetails.depoName == "Admin") {
      const result = await getAllVehiclesApi()
      // console.log(result.data);
      if (result.status == 200) {
        setAllVehicleData(result.data)
      }
    }
    else {
      // get all Vehicle details by depoName

      const result = await getAllAlottedDepoVehicleApi(userDetails.depoName)
      // console.log(result.data);
      if (result.status == 200) {
        setAllVehicleData(result.data)
      }
    }
  }

  // get all trip details
  const getAllTripDetails = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    if (userDetails.depoName == "Admin") {
      const result = await getAllTripApi()
      // console.log(result.data);
      if (result.status == 200) {
        setAllTripDetails(result.data);
        const count = result.data.length;
        setAllTripDataCount(count)
      }
    }
    else {
      //get all trip by DepoName
      const result = await getTripOfDepotApi(userDetails.depoName)
      // console.log(result);
      if (result.status == 200) {
        setAllTripDetails(result.data);
        const count = result.data.length;
        setAllTripDataCount(count)
      }
    }
  }
  // console.log(AllTripDetails);

  //trip Upcomming departure_location == depoName
  const getUpComingTripDetailsByDepo = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    const result = await getAllUpcomingTripApi(userDetails.depoName)
    if (result.status == 200) {
      setAllUpcomingTDByDepo(result.data);
    }
  }
  // console.log(AllUpcomingTDByDepo);

  // to get all live trip details based upon depo
  const getAllLiveTripByDepo = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    const result = await getAllLiveTripApi(userDetails.depoName)
    if (result.status == 200) {
      setAllLiveTripDetails(result.data);
    }
  }
  // console.log(AllLiveTripdetails);

  //get total number of bussess in route
  const getAllOnRouteDetails = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    if (userDetails.depoName == "Admin") {
      const result = await getOnRouteServicesApi()
      // console.log(result);
      if (result.status == 200) {
        const count = result.data.length;
        setAllOnRouteBusesCount(count)
      }

    }
    else {
      //get total number of bussess in route by depo
      const result = await getOnRouteServicesByDepoApi(userDetails.depoName)
      console.log(result.data);
      if (result.status == 200) {
        const count = result.data.length;
        setAllOnRouteBusesCount(count)
      }

    }

  }

  //get total number of out of services bussess in route
  const getOutOfServicesCount = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    if (userDetails.depoName == "Admin") {
      const result = await getAllOutofServicesApi();
      // console.log(result);
      if (result.status == 200) {
        const count = result.data.length;
        setOutOfServicesCount(count);
      }
    }
    else {
      const result = await getAllOutofServicesByDepoApi(userDetails.depoName)
      // console.log(result.data);
      if (result.status == 200) {
        const count = result.data.length;
        setOutOfServicesCount(count);
      }
    }
  };

  //get All buses in servises
  const getAllBusesInServices = async () => {
    const result = await getAvilableServicesApi()
    const count = result.data.length
    setAllBusesInServiceCount(count);
  }

  // get All completed Trip details
  const getAllCompletedTripDetails = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));

    if (userDetails.depoName == "Admin") {

      const result = await getAllCollectionAPi()
      // Fuel Consumption total
      const ftotal = result.data.reduce((total, item) => {
        return total + item.fuelCost;
      }, 0)
      setTotalFuelComsumption(ftotal)
      // Total Collection total
      const ctotal = result.data.reduce((total, item) => {
        return total + item.Tripcollection;
      }, 0)
      setTotalcollection(ctotal);
      console.log(ctotal);
      setCompletedTripDetails(result.data);
    }
    else {

      const result = await getCollectionByDepoAPi(userDetails.depoName)
      // Fuel Consumption total
      const ftotal = result.data.reduce((total, item) => {
        return total + item.fuelCost;
      }, 0)
      setTotalFuelComsumption(ftotal)
      console.log(ftotal);

      // Total Collection total
      const ctotal = result.data.reduce((total, item) => {
        return total + item.Tripcollection;
      }, 0)
      setTotalcollection(ctotal);
      console.log(ctotal);
      setCompletedTripDetails(result.data);

    }



  }

  //get all conductor details
  const getAllConductordetails = async () => {
    const result = await getAllConductor()
    // console.log(result.data);
    setConductorDetails(result.data)
  }

  //get all driver details
  const getAllDriverdetails = async () => {
    const result = await getAllDrivers()
    // console.log(result.data);
    setDriverDetails(result.data)
  }

  // Function to map conductorId to conductorName
  const getConductorName = (conductorId) => {
    const conductor = ConductorDetails.find(conductor => conductor._id === conductorId);
    return conductor ? conductor.EmployeeName : 'Unknown';
  };

  // Function to map driverId to DriverName
  const getDriverName = (driverId) => {
    const driver = DriverDetails.find(driver => driver._id === driverId);
    return driver ? driver.EmployeeName : 'Unknown';
  };

  // // Function to map vehicleId to BusNumber
  const getBusNumber = (vehicleId) => {
    const vehicle = AllvehicleData.find(vehicle => vehicle._id === vehicleId);
    return vehicle ? vehicle.BUSNO : 'Unknown';
  };

  // Function to map driverId to Driver Pen number
  const getDriverPen = (driverId) => {
    const driver = DriverDetails.find(driver => driver._id === driverId);
    return driver ? driver.PEN : 'Unknown';
  };

  //Function to map driverId to Driver Pen number
  const getConductorPen = (conductorId) => {
    const conductor = ConductorDetails.find(conductor => conductor._id === conductorId);
    return conductor ? conductor.PEN : 'Unknown';
  };

  // console.log(AllTripDetails);
  // Update AllTripdetals by replacing conductorId with conductorName 
  // Reusable transformation function
  function transformTripDetails(tripDetails) {
    return tripDetails.map(trip => ({
      ...trip,
      // Replace IDs with corresponding values
      conductorName: getConductorName(trip.conductor_id),
      driverName: getDriverName(trip.driver_id),
      BusNo: getBusNumber(trip.vehicle_id),
      DriverPenNumber: getDriverPen(trip.driver_id),
      ConductorPenNumber: getConductorPen(trip.conductor_id),
      // Flatten location properties
      'arrival_location.depo': trip.arrival_location.depo,
      'departure_location.depo': trip.departure_location.depo,
      departure_location: undefined, // Remove original location properties
      arrival_location: undefined,
    }));
  }

  // Apply the transformation to AllTripDetails
  const updatedTripDetails = transformTripDetails(AllTripDetails);
  // console.log(updatedTripDetails);

  // Apply the transformation to AllUpcomingTDByDepo
  const AllUpcomingTDByDepoUpdated = transformTripDetails(AllUpcomingTDByDepo);
  // console.log(AllUpcomingTDByDepoUpdated);

  // Apply the transformation to AllLiveTripdetails
  const AllLiveTDByDepoUpdated = transformTripDetails(AllLiveTripdetails);
  // console.log(AllLiveTDByDepoUpdated);

  // console.log(AllLiveTDByDepoUpdatedflatten);

  //Array of Objects flat() function
  const AllvehicleDataFlatten = AllvehicleData.map(obj => ({
    ...obj,           // Spread the original object properties
    // Flatten the 'lastWeekelyMaintenanceUpdateDate' object, prefixing 'lastWeekelyMaintenanceUpdateDate.' to the keys
    'lastWeekelyMaintenanceUpdateDate': obj.maintenance_data.lastWeekelyMaintenanceUpdateDate,
    // Flatten the 'weeklyMaintenanceDueDate' object, prefixing 'weeklyMaintenanceDueDate.' to the keys
    'weeklyMaintenanceDueDate': obj.maintenance_data.weeklyMaintenanceDueDate,

    // Flatten the 'lastdailyMaintenanceUpdateDate' object, prefixing 'lastdailyMaintenanceUpdateDate.' to the keys
    'lastdailyMaintenanceUpdateDate': obj.maintenance_data.lastdailyMaintenanceUpdateDate,

    // Flatten the 'weekleyMaintenanceUpdateStatus' object, prefixing 'weekleyMaintenanceUpdateStatus' to the keys
    'weekleyMaintenanceUpdateStatus': obj.maintenance_data.weekleyMaintenanceUpdateStatus,

    // Flatten the 'dailyMaintenanceUpdateStatus' object, prefixing 'dailyMaintenanceUpdateStatus.' to the keys
    'dailyMaintenanceUpdateStatus': obj.maintenance_data.dailyMaintenanceUpdateStatus,

    maintenance_data: undefined, // Optionally remove the  maintenance_data  property

  }));


  // console.log(AllvehicleDataFlatten);
  useEffect(() => {
    getAllVehicleDetails()
    getAllTripDetails()
    getAllOnRouteDetails()
    getAllBusesInServices()
    getAllCompletedTripDetails()
    getOutOfServicesCount()
    getUpComingTripDetailsByDepo()
    getAllLiveTripByDepo()
    getAllConductordetails()
    getAllDriverdetails()
  }, [])

  // console.log(TotalCollection,TotalFuelConsumption);




  return (
    <>
      <Header />
      <div className='container-fluid w-100 dashboard-container'>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-10">
            <ExcelExport data={CompletedTripDetails} data1={AllvehicleDataFlatten} data2={updatedTripDetails} data3={AllUpcomingTDByDepoUpdated} data4={AllLiveTDByDepoUpdated} fileName="Report" />
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
                    <h6 className='text-secondary' style={{ fontSize: '13px', fontWeight: 'normal' }}>Total number of buses in dock</h6></div>
                </div>
              </div>
            </div>



            {/* Section 2 */}
            <div className="row mt-2">
              <div className="col-md-6 " >
                <div className='p-3 shadow' style={{ backgroundColor: 'white' }}>
                  {/* Pie Chart */}
                  <h4 className='mt-2' style={{ color: '#737373', fontWeight: "600" }}>FLEET OVERVIEW</h4>
                  <ChartPie data={AllvehicleData} />

                </div>

              </div>
              <div className="col-md-6">
                <div className='p-3 shadow' style={{ backgroundColor: 'white' }}>
                  <h4 className='mt-2' style={{ color: '#737373', fontWeight: "600" }}>REVENUE OVERVIEW</h4>

                  {/* Bar Chart */}
                  <ChartBar collection={TotalCollection} fuelconsumtion={TotalFuelConsumption} revenew={TotalCollection - TotalFuelConsumption} />
                  {/* <div style={{ padding: "25px" }}></div> */}

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