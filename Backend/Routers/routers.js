// Import necessary modules
import express from 'express';
import multerConfig from '../MiddleWares/MulterMiddleware.js';  // Add .js extension
import { addNewVehicle, editVehicleDetails, getAllVehicles, getAllOutofServicesDetails, getAllAvilableServicesDetails, getAllOnRouteDetails, getAllVehiclesNumber } from '../Controllers/VehicleController.js';  // Add .js extension
import { addNewTrip, editTripDetails, editTripDetailsNew, getAllTripDetails } from '../Controllers/TripController.js';  // Add .js extension
import { getAllLedgerData, newLedgerData } from '../Controllers/LedgerController.js';  // Add .js extension
import { addNewDriver, editDriverDetails, editLeaveStatus, getAllDriverDetails } from '../Controllers/DriverController.js';  // Add .js extension
import { addNewConductor, editConductorDetails, editLeaveStatusConductor, getAllConductorDetails } from '../Controllers/ConductorController.js';  // Add .js extension
// Initialize router
const router = express.Router();

// <<<<<<<........VehicleRouter........>>>>>>>

// Adding New Vehicle
router.post('/addNewVehichle', addNewVehicle);
// Get all Vehicle Details
router.get('/getAllVehicles', getAllVehicles);
// Edit Vehicle Details By vehicle_id
router.put('/editVehicleById/:vehicle_id', editVehicleDetails);

router.get("/getAllOutofServices", getAllOutofServicesDetails);

//Get All Avilable services Details
router.get("/getAvilableServices", getAllAvilableServicesDetails);
//Get All on route services Details
router.get("/getOnRouteServices", getAllOnRouteDetails);
// Get all Vehicles number
router.get("/get-all-vehicles-number", getAllVehiclesNumber);
// Get Vehicle Details by id
// router.get("/get-vehicle-by-id/:vehicle_id", getVehicleById);
// Get all Vehicles number


// <<<<<<<........DriverRouter.........>>>>>>>
// Adding new Driver
router.post('/addNewDriver', addNewDriver);
// Get all Driver Details
router.get('/getAllDriverDetails', getAllDriverDetails);
// Edit Driver Details By driver_id
router.put('/editDriverById/:driver_id', editDriverDetails);
// edit DriverLeave Status
router.put('/editLeaveStatus/:driver_id', editLeaveStatus)


// <<<<<<<.......ConductorRouter.......>>>>>>>

// Adding new Conductor
router.post('/addNewConductor', addNewConductor);
// Get all Conductor Details
router.get('/getAllConductordetails', getAllConductorDetails);
// Edit Conductor Details By conductor_id
router.put('/editConductorById/:conductor_id', editConductorDetails);
// edit DriverLeave Status
router.put('/editLeaveStatusConductor/:conductor_id', editLeaveStatusConductor)


// <<<<<<<...........TripRouter.......>>>>>>>>

// Adding new Trip info
router.post('/addnewTrip/:vehicle_id/:driver_id/:conductor_id', addNewTrip);
// Get all Trip Details
router.get('/getAllTripDetails', getAllTripDetails);
// Edit Trip Details by trip_id
router.put('/editTripDetails/:_id', editTripDetails);
// New Edit Trip Details
router.put('/editTripDetailsnew/:trip_id/:vehicle_id/:driver_id/:conductor_id', editTripDetailsNew);



// <<<<<<<...........LedgerRouter.......>>>>>>>>

// Adding ledger details
router.post('/addNewLedgerData', newLedgerData);
// Get all Ledger Data
router.get('/getAllLedgerData', getAllLedgerData);

// Export the router
export default router;
