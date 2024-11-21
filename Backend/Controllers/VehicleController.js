import Vehicles from "../Models/VechicleSchema.js";

// <<<<<<::::::::Adding New Vehicle Details::::::::>>>
export const addNewVehicle = async (req, res) => {
  // console.log("in controller");
  const {
    REGNO,
    BUSNO,
    CLASS,
    ALLOTTEDDEPOT,
    status,
    dock_reason,
    dock_depot,
    breakdown_time,
    breakdown_depot,
  } = req.body;
  console.log(req.body);

  try {
    const existingVehicle = await Vehicles.findOne({ BUSNO });
    if (existingVehicle) {
      res.status(406).json("Vehicle is Already Existing:::::");
    } else {
      const newVehicle = new Vehicles({
        REGNO,
        BUSNO,
        CLASS,
        ALLOTTEDDEPOT,
        status,
        dock_reason,
        dock_depot,
        breakdown_time,
        breakdown_depot,
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
    console.log(
      "Error at catch in vehicleController/getAllVehicles::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<<:::::::::Editing Vehicle Details By vehicle_id:::::::::>>>>>>>>
export const editVehicleDetails = async (req, res) => {
  const { vehicle_id } = req.params;
  const {
    REGNO,
    BUSNO,
    CLASS,
    ALLOTTEDDEPOT,
    status,
    dock_reason,
    dock_depot,
    breakdown_time,
    breakdown_depot,
  } = req.body;
  try {
    const updatedVehicle = await Vehicles.findByIdAndUpdate(
      vehicle_id,
      {
        REGNO,
        BUSNO,
        CLASS,
        ALLOTTEDDEPOT,
        status,
        dock_reason,
        dock_depot,
        breakdown_time,
        breakdown_depot,
      },
      { new: true }
    );

    if (updatedVehicle) {
      res.status(200).json(updatedVehicle);
    } else {
      res.status(406).json("Updation Failed Error at editVehicleDetails::::: ");
    }
  } catch (err) {
    console.log(
      "Error at catch in vehicleController/editVehicleDetails::::::",
      err
    );
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
    const AllOSDetails = await Vehicles.find({ status: "dock" });
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
    console.log(
      "Error at catch in vehicleController/getAllOnRouteDetails::::::",
      err
    );
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
    console.log(
      "Error at catch in vehicleController/deleteVehicleById::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<<:::::get Vehicle By ID::::::>>>>>
export const getvehicleById = async (req, res) => {
  const { vehicle_id } = req.params;
  try {
    const findvehicle = await Vehicles.findById(vehicle_id);
    if (findvehicle) {
      res.status(200).json(findvehicle);
    } else {
      res.status(406).json("Vehicle Not Found by this Id::::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in vehicleController/getvehicleById::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<<:::::::::::::::::: Vehicle maintanance controllers ::::::::::::::::::::::::>>>>>
// <<<<<:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::>>>>>

// <<<<<:::::updating weekly maintanence::::::>>>>>
export const updateVehichelWeeklyMaintanenceController = async (req, res) => {
  try {
    const { id } = req.params;
    const { weeklyUpdateDate, weeklyCheckedBy } = req.body;

    if (!weeklyUpdateDate || !id || !weeklyCheckedBy) {
      return res.status(400).json({ message: "Incomplete Data" });
    }

    // calculate next due date for weekly maintanence
    const weeklyDueDate = new Date(weeklyUpdateDate);
    weeklyDueDate.setDate(weeklyDueDate.getDate() + 7);
    const nextDueDateIsoString = weeklyDueDate.toISOString();

    const updatedVehicleData = await Vehicles.findByIdAndUpdate(
      id,
      {
        "maintenance_data.lastWeekelyMaintenanceUpdateDate": weeklyUpdateDate,
        "maintenance_data.weekleyMaintenanceUpdateStatus": true,
        "maintenance_data.weeklyMaintenanceDueDate": nextDueDateIsoString,
        "maintenance_data.weeklyCheckedBy": weeklyCheckedBy,
      },
      { new: true }
    );
    res.status(200).json({ message: "Success", updatedVehicleData });
  } catch (error) {
    console.log(`Error in updating vehicle weekly maintanence error: ${error}`);
    res.status(500).json({ message: "server error" });
  }
};

// <<<<<:::::updating daily maintanence::::::>>>>>
export const updateVehichelDailyMaintanenceController = async (req, res) => {
  try {
    const { id } = req.params;
    const { dailyUpdateDate, dailyCheckedBY } = req.body;

    if (!dailyUpdateDate || !id || !dailyCheckedBY) {
      return res.status(400).json({ message: "Incomplete Data" });
    }

    const updatedVehicleData = await Vehicles.findByIdAndUpdate(
      id,
      {
        "maintenance_data.lastdailyMaintenanceUpdateDate": dailyUpdateDate,
        "maintenance_data.dailyMaintenanceUpdateStatus": true,
        "maintenance_data.dailyCheckedBY": dailyCheckedBY,
      },
      { new: true }
    );
    res.status(200).json({ message: "Success", updatedVehicleData });
  } catch (error) {
    console.log(`Error in updating daily vehicle maintanence error: ${error}`);
    res.status(500).json({ message: "server error" });
  }
};

// <<<<<:::::get all vehicle maintanence data::::::>>>>>
export const getAllVehicleMaintanenceDataController = async (req, res) => {
  try {
    // const currentDate = new Date();
    // const allVehichileData = await Vehicles.find();

    // for (let vehicle of allVehichileData) {
    //   // for daily status
    //   if (vehicle.maintenance_data.lastdailyMaintenanceUpdateDate) {
    //     let lastMaintenanceDate = new Date(
    //       vehicle.maintenance_data.lastdailyMaintenanceUpdateDate
    //     );
    //     let timeDifference = currentDate - lastMaintenanceDate;
    //     if (timeDifference >= 1000 * 60 * 60 * 24) {
    //       vehicle.maintenance_data.dailyMaintenanceUpdateStatus = false;
    //       console.log(vehicle.maintenance_data.dailyMaintenanceUpdateStatus);
    //     }
    //   }
    //   // for weekly status
    //   if (vehicle.maintenance_data.lastWeekelyMaintenanceUpdateDate) {
    //     let lastWeeklyMaintenanceDate = new Date(
    //       vehicle.maintenance_data.lastWeekelyMaintenanceUpdateDate
    //     );
    //     let timeDifference = currentDate - lastWeeklyMaintenanceDate;
    //     if (timeDifference >= 1000 * 60 * 60 * 24 * 7) {
    //       vehicle.maintenance_data.weekleyMaintenanceUpdateStatus = false;
    //     }
    //   }
    // }

    // res.status(200).json({
    //   message: "success",
    //   allVehicleMaintanenceData: allVehichileData,
    // });

    //////////////////////////////with aggregation
    const currentDate = new Date();

    const allVehicleData = await Vehicles.aggregate([
      {
        $addFields: {
          "maintenance_data.dailyMaintenanceUpdateStatus": {
            $cond: {
              if: {
                $gte: [
                  {
                    $subtract: [
                      currentDate,
                      "$maintenance_data.lastdailyMaintenanceUpdateDate",
                    ],
                  },
                  1000 * 60 * 60 * 24,
                ],
              },
              then: false,
              else: "$maintenance_data.dailyMaintenanceUpdateStatus",
            },
          },
          "maintenance_data.weekleyMaintenanceUpdateStatus": {
            $cond: {
              if: {
                $gte: [
                  {
                    $subtract: [
                      currentDate,

                      "$maintenance_data.lastWeekelyMaintenanceUpdateDate",
                    ],
                  },
                  1000 * 60 * 60 * 24 * 7,
                ],
              },
              then: false,
              else: "$maintenance_data.weekleyMaintenanceUpdateStatus",
            },
          },
        },
      },
      {
        $merge: {
          into: "vehicles",
          whenMatched: "merge",
          whenNotMatched: "discard",
        },
      },
    ]);

    const updatedVehicleData = await Vehicles.find();

    res.status(200).json({
      message: "success",
      allVehicleMaintanenceData: updatedVehicleData,
    });
  } catch (error) {
    console.log(
      `Error in retriving all vehicle maintanence data error: ${error}`
    );
    res.status(500).json({ message: "server error" });
  }
};

// <<<<<:::::get daily vehicle maintanence data::::::>>>>>
export const getDailyVehicleMaintanenceDataController = async (req, res) => {
  try {
    const currentDate = new Date();

    await Vehicles.aggregate([
      {
        $addFields: {
          "maintenance_data.dailyMaintenanceUpdateStatus": {
            $cond: {
              if: {
                $gte: [
                  {
                    $subtract: [
                      currentDate,
                      "$maintenance_data.lastdailyMaintenanceUpdateDate",
                    ],
                  },
                  1000 * 60 * 60 * 24,
                ],
              },
              then: false,
              else: "$maintenance_data.dailyMaintenanceUpdateStatus",
            },
          },
        },
      },
      {
        $merge: {
          into: "vehicles",
          whenMatched: "merge",
          whenNotMatched: "discard",
        },
      },
    ]);

    const updatedVehicleData = await Vehicles.find().sort({
      "maintenance_data.lastdailyMaintenanceUpdateDate": -1,
    });

    res.status(200).json({
      message: "success",
      allVehicleMaintanenceData: updatedVehicleData,
    });
  } catch (error) {
    console.log(
      `Error in retriving daily vehicle maintanence data error: ${error}`
    );
    res.status(500).json({ message: "server error" });
  }
};

// <<<<<:::::get weekly vehicle maintanence data::::::>>>>>
export const getWeeklyVehicleMaintanenceDataController = async (req, res) => {
  try {
    const currentDate = new Date();

    await Vehicles.aggregate([
      {
        $addFields: {
          "maintenance_data.weekleyMaintenanceUpdateStatus": {
            $cond: {
              if: {
                $gte: [
                  {
                    $subtract: [
                      currentDate,
                      "$maintenance_data.lastWeekelyMaintenanceUpdateDate",
                    ],
                  },
                  1000 * 60 * 60 * 24 * 7,
                ],
              },
              then: false,
              else: "$maintenance_data.weekleyMaintenanceUpdateStatus",
            },
          },
        },
      },
      {
        $merge: {
          into: "vehicles",
          whenMatched: "merge",
          whenNotMatched: "discard",
        },
      },
    ]);

    const updatedVehicleData = await Vehicles.find().sort({
      "maintenance_data.lastWeekelyMaintenanceUpdateDate": -1,
    });

    res.status(200).json({
      message: "success",
      allVehicleMaintanenceData: updatedVehicleData,
    });
  } catch (error) {
    console.log(
      `Error in retriving daily vehicle maintanence data error: ${error}`
    );
    res.status(500).json({ message: "server error" });
  }
};

// Delete Selected Vehicle::::
export const deleteSelectedVehicle = async (req, res) => {
  const vehicleIds = req.body;
  console.log(vehicleIds);

  try {
    const deletedVehicles = await Vehicles.deleteMany({
      _id: { $in: vehicleIds },
    });
    if (deletedVehicles) {
      res.status(200).json(deletedVehicles);
      console.log("Delete Successfully::::");
    } else {
      res.status(406).json("No vehicles found By this Id::::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in vehicleController/deleteSelectedVehicle::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<< GetAll Vehicles from depoName >>>
export const getAllVehiclesByDepoName = async (req, res) => {
  const { depoName } = req.params;
  console.log(depoName);

  try {
    const vehicleDetails = await Vehicles.find({ ALLOTEDDEPOT: depoName });
    console.log("DATA", vehicleDetails);

    if (vehicleDetails) {
      res.status(200).json(vehicleDetails);
    } else {
      res
        .status(404)
        .json({ message: "No vehicle details found for this depot name" });
    }
  } catch (err) {
    console.log(
      "Error at catch in vehicleController/getAllVehiclesByDepoName::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
