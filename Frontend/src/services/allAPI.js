import commonAPI from "./commonAPI";
import SERVERURL from "./serverUrl";

//get all vehicles
export const getAllVehicles = async () => {
  return await commonAPI("GET", `${SERVERURL}/getAllVehicles`, "");
};

//delete single vehicle
export const deleteSingleVehicleAPI = async (vehicleId) => {
  return await commonAPI(
    "DELETE",
    `${SERVERURL}/deleteVehicleById/${vehicleId}`,
    {}
  );
};

// addvehicle
export const addvehicleAPI = async (reqBody) => {
  return await commonAPI("POST", `${SERVERURL}/addNewVehichle`, reqBody, "");
};

export const getAllTripApi = async () => {
  return await commonAPI("GET", `${SERVERURL}/getAllTripDetails`, "", "");
};

export const updateTripApi = async (reqBody, trip_id) => {
  return await commonAPI(
    "PUT",
    `${SERVERURL}/editTripDetails/${trip_id}`,
    reqBody,
    ""
  );
};

export const updateVehicleStatus = async (vehicleId, vehicleFormData) => {
  return await commonAPI(
    "PUT",
    `${SERVERURL}/editVehicleById/${vehicleId}`,
    vehicleFormData
  );
};

// add Trip
export const addTripApi = async (vehicleId, driverId, conductorId, data) => {
  return commonAPI(
    "POST",
    `${SERVERURL}/addnewTrip/${vehicleId}/${driverId}/${conductorId}`,
    data,
    ""
  );
};

// new edit trip
export const updateTripApiNew = async (
  trip_id,
  vehicle_id,
  driver_id,
  conductor_id,
  data
) => {
  return commonAPI(
    "PUT",
    `${SERVERURL}/editTripDetailsnew/${trip_id}/${vehicle_id}/${driver_id}/${conductor_id}`,
    data,
    ""
  );
};
// all completed trip details
export const getAllCompletedTripApi = async () => {
  return await commonAPI(
    "GET",
    `${SERVERURL}/getAllCompletedTripDetails`,
    "",
    ""
  );
};

// get all drivers
export const getDriversListApi = async () => {
  return commonAPI("GET", `${SERVERURL}/getAllDriverDetails`, "", "");
};

// get all conductors
export const getConductorsListApi = async () => {
  return commonAPI("GET", `${SERVERURL}/getAllConductordetails`, "", "");
};
export const getVehiclesNumberDetails = async () => {
  return await commonAPI("GET", `${SERVERURL}/get-all-vehicles-number`, "", "");
};

export const getAllVehiclesApi = async () => {
  return await commonAPI("GET", `${SERVERURL}/getAllVehicles`, "", "");
};
//get all outof services
export const getAllOutofServicesApi = async () => {
  return await commonAPI("GET", `${SERVERURL}/getAllOutofServices`, "", "");
};
//get avilable services
export const getAvilableServicesApi = async () => {
  return await commonAPI("GET", `${SERVERURL}/getAvilableServices`, "", "");
};
//get on route  services
export const getOnRouteServicesApi = async () => {
  return await commonAPI("GET", `${SERVERURL}/getOnRouteServices`, "", "");
};

// Adding New Driver
export const addNewDriver = async (reqbody) => {
  return await commonAPI("POST", `${SERVERURL}/addNewDriver`, reqbody, "");
};
// Get All Driver
export const getAllDrivers = async () => {
  return await commonAPI("GET", `${SERVERURL}/getAllDriverDetails`, "", "");
};

//delete single driver
export const deleteSingleDriverAPI = async (driverId) => {
  return await commonAPI(
    "DELETE",
    `${SERVERURL}/deleteDriverIdById/${driverId}`,
    {}
  );
};

//  Edit driver Leave Status
//  Edit driver Leave Status
export const editLeaveStatusDriver = async (driver_id, reqbody) => {
  return await commonAPI(
    "PUT",
    `${SERVERURL}/editLeaveStatus/${driver_id}`,
    reqbody,
    ""
  );
};
export const addNewConductor = async (reqbody) => {
  return await commonAPI("POST", `${SERVERURL}/addNewConductor`, reqbody, "");
};
//  Edit Conductor Leave Status
export const editLeaveStatusConductor = async (conductor_id, reqbody) => {
  return await commonAPI(
    "PUT",
    `${SERVERURL}/editLeaveStatusConductor/${conductor_id}`,
    reqbody,
    ""
  );
};
// Get All Conductor
export const getAllConductor = async () => {
  return await commonAPI("GET", `${SERVERURL}/getAllConductordetails`, "", "");
};

//delete single conductor
export const deleteSingleConductorAPI = async (conductorId) => {
  return await commonAPI(
    "DELETE",
    `${SERVERURL}/deleteConductorById/${conductorId}`,
    {}
  );
};

export const getVechileByIdVD = async (vehicle_id) => {
  return await commonAPI(
    "GET",
    `${SERVERURL}/getVehichleById/${vehicle_id}`,
    "",
    ""
  );
};

export const EditVechicleStatus = async (vehicle_id, reBody) => {
  return await commonAPI(
    "PUT",
    `${SERVERURL}/editVehicleById/${vehicle_id}`,
    reBody,
    ""
  );
};

// login api
export const loginApiHandler = async (loginData) => {
  return await commonAPI("POST", `${SERVERURL}/adminLogin`, loginData, "");
};
