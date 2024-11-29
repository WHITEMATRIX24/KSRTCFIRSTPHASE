// Import necessary modules
import express from "express";
import {
  addNewVehicle,
  editVehicleDetails,
  getAllVehicles,
  getAllOutofServicesDetails,
  getAllAvilableServicesDetails,
  getAllOnRouteDetails,
  getAllVehiclesNumber,
  deleteVehicleById,
  getvehicleById,
  updateVehichelWeeklyMaintanenceController,
  updateVehichelDailyMaintanenceController,
  getAllVehicleMaintanenceDataController,
  getDailyVehicleMaintanenceDataController,
  getWeeklyVehicleMaintanenceDataController,
  deleteSelectedVehicle,
  getAllVehiclesByDepoName,
  getAllOnRouteDetailsByDepo,
  getAllOutofServicesDetailsByDepo,
  getFilteredVehiclesForTrip,
} from "../Controllers/VehicleController.js";
import {
  addNewTrip,
  editTripDetails,
  editTripDetailsNew,
  getAllTripDetails,
  getAllCompletedTripDetails,
  getAllTripByDepoName,
  getTripdetailsUpcomingbyDepoName,
  getTripLiveBydepoName,
  getAllUpcomingTrip,
  getAllTripLive,
  searchForDriverConductorVehicleController,
  getAllTripByDepoNameAndDate,
} from "../Controllers/TripController.js";
import {
  addNewDriver,
  deleteDriverById,
  deleteSelectedDriver,
  editDriverDetails,
  editLeaveStatus,
  getAllDriverDetails,
  getDriverByPagination,
  getFilteredDriversForTrip,
} from "../Controllers/DriverController.js";
import {
  addNewConductor,
  deleteConductorById,
  deleteSelectedConductor,
  editConductorDetails,
  editLeaveStatusConductor,
  getAllConductorDetails,
  getFilteredConductorsForTrip,
  getFilteredConductorsList,
} from "../Controllers/ConductorController.js";
import {
  getAllLedgerData,
  newLedgerData,
} from "../Controllers/LedgerController.js";
import {
  adminLogin,
  editAdmindetailsById,
  getAllAdminDetails,
  Register,
} from "../Controllers/AdminController.js";
import {
  addCollection,
  getAllCollection,
  getCollectionsOfDate,
  getCollectionsOfDepot,
  getCollectionsOfDepotAndDate,
} from "../Controllers/TrpCollectionController.js";
import { getFilteredDCEmployeesForTrip } from "../Controllers/dcEmployeesController.js";
// Initialize router
const router = express.Router();

// <<<<<<<........VehicleRouter........>>>>>>>

// Adding New Vehicle
router.post("/addNewVehichle", addNewVehicle);
// Get all Vehicle Details
router.get("/getAllVehicles", getAllVehicles);
// Edit Vehicle Details By vehicle_id
router.put("/editVehicleById/:vehicle_id", editVehicleDetails);
// GET All Out Of Service Details
router.get("/getAllOutofServices", getAllOutofServicesDetails);
//Get All Avilable services Details
router.get("/getAvilableServices", getAllAvilableServicesDetails);
//Get All on route services Details
router.get("/getOnRouteServices", getAllOnRouteDetails);
// Get all Vehicles number
router.get("/get-all-vehicles-number", getAllVehiclesNumber);
// Get Vehicle Details by id
router.get("/getVehicleById/:vehicle_id", getvehicleById);
// Delete Vehicle By Id
router.delete("/deleteVehicleById/:vehicle_id", deleteVehicleById);
// Delete Selected Vehicles
router.delete("/deleteSelectedVehicles", deleteSelectedVehicle);
// get All vehicles By depoName;
router.get("/getAllVehicleByDeponame/:depoName", getAllVehiclesByDepoName);
//Get All on route services Details by depo
router.get("/getOnRouteServicesByDepo/:depoName", getAllOnRouteDetailsByDepo);
// GET All Out Of Service Details by depo
router.get(
  "/getAllOutofServicesByDepo/:depoName",
  getAllOutofServicesDetailsByDepo
);

// <<<<<<<........Vehichel Maintanence Routes.........>>>>>>>

// get all Vehicles Maintenance routes
router.get(
  "/get-all-vehicle-maintanence-data",
  getAllVehicleMaintanenceDataController
);

// get all daily Vehicles Maintenance routes
router.get(
  "/get-all-daily-vehicle-maintanence-data",
  getDailyVehicleMaintanenceDataController
);

// get all weekly Vehicles Maintenance routes
router.get(
  "/get-all-weekly-vehicle-maintanence-data",
  getWeeklyVehicleMaintanenceDataController
);

// update weekly maintanence
router.put(
  "/update-vehicle-weekly-maintanence/:id",
  updateVehichelWeeklyMaintanenceController
);

// update daily maintanence
router.put(
  "/update-vehicle-daily-maintanence/:id",
  updateVehichelDailyMaintanenceController
);

// <<<<<<<........DriverRouter.........>>>>>>>
// Adding new Driver
router.post("/addNewDriver", addNewDriver);
// Get all Driver Details
router.get("/getAllDriverDetails", getAllDriverDetails);
// Edit Driver Details By driver_id
router.put("/editDriverById/:driver_id", editDriverDetails);
// edit DriverLeave Status
router.put("/editLeaveStatus/:driver_id", editLeaveStatus);
// Delete Driver By driver_Id
router.delete("/deleteDriverById/:driver_id", deleteDriverById);
// Delete Selected Drivers
router.delete("/deleteSelectedDrivers", deleteSelectedDriver);
// get Driver Details By Pagination
router.get("/getDriverByPagination", getDriverByPagination);

// <<<<<<<.......ConductorRouter.......>>>>>>>

// Adding new Conductor
router.post("/addNewConductor", addNewConductor);
// Get all Conductor Details
router.get("/getAllConductordetails", getAllConductorDetails);
// Edit Conductor Details By conductor_id
router.put("/editConductorById/:conductor_id", editConductorDetails);
// edit DriverLeave Status
router.put("/editLeaveStatusConductor/:conductor_id", editLeaveStatusConductor);
// Delete Conductor By conductor_Id
router.delete("/deleteConductorById/:conductor_id", deleteConductorById);
// Delete Selected Conductors
router.delete("/deleteSelectedConductors", deleteSelectedConductor);
// get filtered conductors list
router.get("/conductors/:pageNum/:itemsPerPage", getFilteredConductorsList);
// <<<<<<<...........TripRouter.......>>>>>>>>

// Adding new Trip info
router.post("/addnewTrip/:vehicle_id/:driver_id/:conductor_id", addNewTrip);
// Get all Trip Details
router.get("/getAllTripDetails", getAllTripDetails);
// Edit Trip Details by trip_id
router.put("/editTripDetails/:_id", editTripDetails);
// New Edit Trip Details
router.put(
  "/editTripDetailsnew/:trip_id/:vehicle_id/:driver_id/:conductor_id",
  editTripDetailsNew
);
// get All Completed Trips
router.get("/getAllCompletedTripDetails", getAllCompletedTripDetails);
// get Trip details in OverView arrival_Location || departure_location==depoName
router.get("/getTripinOverView/:depoName", getAllTripByDepoName);
// get TripDetails By status==Upcoming && departure_location==deponame
router.get(
  "/getUpcomingTripByDeponame/:depoName",
  getTripdetailsUpcomingbyDepoName
);
// get Trip Details By live Status && departure_location||arrival_location==depoName
router.get("/getLiveTripsBydepoName/:depoName", getTripLiveBydepoName);
// get all upcoming trips
router.get("/get-all-upcoming-trips", getAllUpcomingTrip);
// get all trip live
router.get("/get-all-trip-live", getAllTripLive);
// search driver conductor and vehicle for trip edit
router.get(
  "/search-driver-conductor-vehicle",
  searchForDriverConductorVehicleController
);
// overview data filter by depo and date
router.get(
  "/getTripinOverViewDate/:depoName/:date",
  getAllTripByDepoNameAndDate
);

// <<<<<<<........routers to get data for scheduling trips.........>>>>>>>

// get filtered conductos for schedule trip
router.get("/filteredConductors", getFilteredConductorsForTrip);

// get filtered vehicles to schedule trip
router.get("/filteredVehicles", getFilteredVehiclesForTrip);

// get filtered employees to schedule trip
router.get("/filteredDCEmployee", getFilteredDCEmployeesForTrip);

// get filtered drivers to schedule Trip
router.get("/filteredDrivers", getFilteredDriversForTrip);

// <<<<<<.......Admin Router.......>>>>>
// Reigster New Admin
router.post("/registerAdmin", Register);
// Login for Admins
router.post("/adminLogin", adminLogin);
// Get All Admin Details
router.get("/allAdminDetails", getAllAdminDetails);
// Edit Admin Details
router.put("/editAdminDetails/:admin_id", editAdmindetailsById);

// <<<<<<<...........LedgerRouter.......>>>>>>>>

// Adding ledger details
router.post("/addNewLedgerData", newLedgerData);
// Get all Ledger Data
router.get("/getAllLedgerData", getAllLedgerData);

// collection routes---------------------------------------------------------------

// add collection
router.post("/addCollection", addCollection);

// get all collection
router.get("/getAllCollection", getAllCollection);

// get collection by depot
router.get("/getCollectionByDepot/:depot", getCollectionsOfDepot);

// get collection by date
router.get("/getCollectionByDate/:date", getCollectionsOfDate);

// get collection by date and depot
router.get("/getFilteredCollection/:date/:depot", getCollectionsOfDepotAndDate);

// <<<<<<<........DC Employees Routes.........>>>>>>>

// // get all employees
// router.get('/dcEmployees',getDCEmployees)

// // add employee
// router.post('/dcEmployees',addDCEmployee)

// // update employee
// router.put('/dcEmployees/:id',updateDCEmployee)

// Export the router
export default router;
