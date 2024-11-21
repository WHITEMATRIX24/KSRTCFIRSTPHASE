import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard";
import Vehicles from "./Pages/vehicles/Vehicles";
import VehicleDetails from "./Pages/VehicleDetails/VehicleDetails";
import Drivers from "./Pages/drivers/Drivers";
import AddDriver from "./Pages/drivers/AddDriver";
import TripOverview from "./Pages/TripOverview/TripOverview";
import TripParameters from "./Pages/TripParameters/TripParameters";
import ScheduleTrip from "./Pages/ScheduleTrip/ScheduleTrip";
import Conductors from "./Pages/conductors/Conductors";
import AddConductor from "./Pages/conductors/AddConductor";
import AddVehicle from "./Pages/AddVehicle/AddVehicle";
import OnGoingTrips from "./Pages/OnGoingTrip/OnGoingTrips";
import LoginPage from "./Pages/LoginPage/LoginPage";
import ProtectRoutes from "./utils/protectRoutes";
import Maintenance from "./Pages/Maintenance/Maintenance";
import Collection from "./Pages/Collection/Collection";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route element={<ProtectRoutes allowedRoles={["Admin", "Staff", "Supervisor"]} />}>
          <Route path="/fleet" element={<Vehicles />}></Route>
          <Route path="/vehicle-details" element={<VehicleDetails />}></Route>
          <Route path="/add-vehicle" element={<AddVehicle />}></Route>
          <Route path="/driver" element={<Drivers />}></Route>
          <Route path="/add-driver" element={<AddDriver />}></Route>
          <Route path="/conductor" element={<Conductors />}></Route>
          <Route path="/add-conductor" element={<AddConductor />}></Route>
          <Route path="/trip-overview" element={<TripOverview />}></Route>
          <Route path="/add-trip" element={<TripParameters />}></Route>
          <Route path="/scheduled-trips" element={<ScheduleTrip />}></Route>
          <Route path="/ongoing-trips" element={<OnGoingTrips />}></Route>
          <Route path="/collection" element={<Collection />}></Route>
          </Route>
          <Route element={<ProtectRoutes allowedRoles={["Admin", "Maintenance", "Supervisor"]} />}>
            <Route path="/maintanance" element={<Maintenance />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
