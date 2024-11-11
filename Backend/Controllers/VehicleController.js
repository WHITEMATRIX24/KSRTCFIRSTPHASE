import Vehicles from "../Models/VechicleSchema.js";

// <<<<<<::::::::Adding New Vehicle Details::::::::>>>
// <<<<<<::::::::Adding New Vehicle Details::::::::>>>
export const addNewVehicle = async (req, res) => {
    // console.log("in controller");

    const { transport_type, number, model, status, fuelconsumption, odometer } = req.body;
    console.log(req.body);

    try {
        const existingVehicle = await Vehicles.findOne({ number });
        if (existingVehicle) {
            res.status(406).json("Vehicle is Already Existing:::::");
        } else {
            const newVehicle = new Vehicles({
                transport_type, number, model, status, fuelconsumption, odometer
            });
            await newVehicle.save();
            res.status(201).json(newVehicle);
        }
    } catch (err) {
        console.log("Error at catch in vehicleController/addNewVehicle::::::", err);
        res.status(500).json({ error: "Internal server error" });

    }
};


// <<<<<<<:::::::Getting All Vehicle Details From DB::::::::>>>>>>>>>
export const getAllVehicles = async (req, res) => {
    try {
        const allVehicleDetails = await Vehicles.find();
        if (allVehicleDetails) {
            res.status(200).json(allVehicleDetails);
        } else {
            res.status(406).json("Can't find any vehicle Details:::: ");
        }
    } catch (err) {
        console.log("Error at catch in vehicleController/getAllVehicles::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// <<<<<:::::::::Editing Vehicle Details By vehicle_id:::::::::>>>>>>>> 
export const editVehicleDetails = async (req, res) => {
    const { vehicle_id } = req.params;
    const { number, model, status, transport_type, odometer } = req.body;
    try {
        const updatedVehicle = await Vehicles.findByIdAndUpdate(vehicle_id, {
            number, model, status, transport_type, odometer
        }, { new: true });

        if (updatedVehicle) {
            res.status(200).json(updatedVehicle);
        } else {
            res.status(406).json("Updation Failed Error at editVehicleDetails::::: ");
        }
    } catch (err) {
        console.log("Error at catch in vehicleController/editVehicleDetails::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// <<<::::::::get all Vechicle number :::::::>>>>>>
export const getAllVehiclesNumber = async (req, res) => {
    try {
        const allVehicleDetails = await Vehicles.find({}, { _id: 1, number: 1 });
        if (allVehicleDetails) {
            res.status(200).json(allVehicleDetails);
        } else {
            res.status(406).json("Can't find any vehicle Details:::: ");
        }
    } catch (err) {
        console.log(
            "Error at catch in vehicleController/getAllVehicles::::::",
            err
        );
        res.status(500).json({ error: "Internal server error" });
    }
};

// <<<<<:::::::::Getting All out of service Vehicle Details from Db :::::::::>>>>>>>>
export const getAllOutofServicesDetails = async (req, res) => {
    try {
        const AllOSDetails = await Vehicles.find({ status: "out_of_services" });
        if (AllOSDetails) {
            res.status(200).json(AllOSDetails);
        } else {
            res.status(406).json("Can't find any vehicle Details:::: ");
        }
    } catch (err) {
        console.log(
            "Error at catch in vehicleController/getAllVehicles::::::",
            err
        );
        res.status(500).json({ error: "Internal server error" });
    }
};

// <<<<<:::::::::Getting All Avilable service Vehicle Details from Db :::::::::>>>>>>>>
export const getAllAvilableServicesDetails = async (req, res) => {
    try {
        const AllAvilableDetails = await Vehicles.find({ status: "available" });
        if (AllAvilableDetails) {
            res.status(200).json(AllAvilableDetails);
        } else {
            res.status(406).json("Can't find any vehicle Details:::: ");
        }
    } catch (err) {
        console.log(
            "Error at catch in vehicleController/getAllVehicles::::::",
            err
        );
        res.status(500).json({ error: "Internal server error" });
    }
};

// <<<<<:::::::::Getting All on route Vehicle Details from Db :::::::::>>>>>>>>
export const getAllOnRouteDetails = async (req, res) => {
    try {
        const AllOnRouteDetails = await Vehicles.find({ status: "enroute" });
        if (AllOnRouteDetails) {
            res.status(200).json(AllOnRouteDetails);
        } else {
            res.status(406).json("Can't find any vehicle Details:::: ");
        }
    } catch (err) {
        console.log(
            "Error at catch in vehicleController/getAllVehicles::::::",
            err
        );
        res.status(500).json({ error: "Internal server error" });
    }
};

