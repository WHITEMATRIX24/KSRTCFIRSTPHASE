import Vehicles from "../Models/VechicleSchema.js";

// <<<<<<::::::::Adding New Vehicle Details::::::::>>>
export const addNewVehicle = async (req, res) => {
    // console.log("in controller");
    const { REGNO, BUSNO, CLASS, ALLOTTEDDEPOT, status } = req.body;
    console.log(req.body);

    try {
        const existingVehicle = await Vehicles.findOne({ BUSNO });
        if (existingVehicle) {
            res.status(406).json("Vehicle is Already Existing:::::");
        } else {
            const newVehicle = new Vehicles({
                REGNO, BUSNO, CLASS, ALLOTTEDDEPOT, status
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
    const { REGNO, BUSNO, CLASS, ALLOTTEDDEPOT, status } = req.body;
    try {
        const updatedVehicle = await Vehicles.findByIdAndUpdate(vehicle_id, {
            REGNO, BUSNO, CLASS, ALLOTTEDDEPOT, status
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
        const allVehicleDetails = await Vehicles.find({}, { _id: 1, BUSNO: 1 });
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
        const AllOSDetails = await Vehicles.find({ status: "doc" });
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

// <<<<<:::::::::Getting All in_service  Vehicle Details from Db :::::::::>>>>>>>>
export const getAllAvilableServicesDetails = async (req, res) => {
    try {
        const AllAvilableDetails = await Vehicles.find({ status: "in_service" });
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
        const AllOnRouteDetails = await Vehicles.find({ status: "en_route" });
        if (AllOnRouteDetails) {
            res.status(200).json(AllOnRouteDetails);
        } else {
            res.status(406).json("Can't find any vehicle Details:::: ");
        }
    } catch (err) {
        console.log("Error at catch in vehicleController/getAllOnRouteDetails::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// <<<<<:::::Delete Vehicle By ID::::::>>>>>
export const deleteVehicleById = async (req, res) => {
    const { vehicle_id } = req.params;
    try {
        const vehicleById = await Vehicles.findByIdAndDelete(vehicle_id);
        if (vehicleById) {
            res.status(200).json(vehicleById);
            console.log("Delete Successfully::::");
        } else {
            res.status(406).json("No vehicles found By this Id::::::");
        }
    } catch (err) {
        console.log("Error at catch in vehicleController/addNewVehicle::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

