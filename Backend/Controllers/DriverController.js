import Driver from "../Models/DiverSchema.js";

// <<<<<<::::::::Adding New Driver Details::::::::>>>

export const addNewDriver = async (req, res) => {
  const { EmployeeName, PEN, Designation, UNIT, is_Permanent, phone } =
    req.body;
  // const image = req.file ? req.file.filename : null;
  try {
    const existingDriver = await Driver.findOne({ PEN });
    if (existingDriver) {
      res.status(406).json("Driver is Already Existing:::::");
    } else {
      const newDriver = new Driver({
        EmployeeName,
        PEN,
        Designation,
        UNIT,
        is_Permanent,
        phone,
      });
      await newDriver.save();
      res.status(201).json(newDriver);
    }
  } catch (err) {
    console.log("Error at catch in DriverController/addNewDriver::::::", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<<<<:::::::Getting All Driver Details From DB::::::::>>>>>>>>>
export const getAllDriverDetails = async (req, res) => {
  try {
    const allDriverDetails = await Driver.find();
    if (allDriverDetails) {
      res.status(200).json(allDriverDetails);
    } else {
      res.status(406).json("Can't find Any Driver Details::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in DriverController/getAllDriverDetails::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<<:::::::::Editing Driver Details By driver_id:::::::::>>>>>>>>>
export const editDriverDetails = async (req, res) => {
  const {
    EmployeeName,
    PEN,
    Designation,
    UNIT,
    is_Permanent,
    phone,
    on_leave,
  } = req.body;
  const { driver_id } = req.params;
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      driver_id,
      {
        EmployeeName,
        PEN,
        Designation,
        UNIT,
        is_Permanent,
        phone,
        on_leave,
      },
      { new: true }
    );

    if (updatedDriver) {
      res.status(200).json(updatedDriver);
    } else {
      res
        .status(406)
        .json(
          "Updation of Driver is Failed, Error in editDriverDetails (if..) :::::::"
        );
    }
  } catch (err) {
    console.log(
      "Error at catch in DriverController/editDriverDetails::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

//<<<<<::::::: Edit Leave Status ::::::>>>>>
export const editLeaveStatus = async (req, res) => {
  const { on_leave } = req.body;
  const { driver_id } = req.params;

  console.log("driver_id", driver_id); // Log the driver ID
  console.log("body", req.body); // Log the entire body to confirm `on_leave`

  try {
    // Check if the driver exists first
    const driver = await Driver.findById(driver_id);

    if (!driver) {
      console.log("Driver not found!");
      return res.status(404).json({ error: "Driver not found!" });
    }

    // Update the leave status
    const editStatus = await Driver.findByIdAndUpdate(
      driver_id,
      { on_leave: on_leave },
      { new: true } // `new: true` returns the updated document
    );

    // Check if the update was successful
    if (editStatus) {
      console.log("Driver status updated:", editStatus); // Log the updated driver
      res.status(200).json(editStatus);
    } else {
      console.log("Update failed!"); // Log if the update fails
      res.status(406).json("Can't edit Status Now:::::");
    }
  } catch (err) {
    console.log("Error in DriverController/editLeaveStatus:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//<<<<<<......Delete Driver By driver_Id........>>>>
export const deleteDriverById = async (req, res) => {
  const { driver_id } = req.params;
  try {
    const result = await Driver.findByIdAndDelete(driver_id);
    if (result) {
      res.status(200).json(result);
      console.log("Delete Successfully::::");
    } else {
      res.status(404).json("Error at Deleting driver Status(406)::::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in DriverController/deletDriverById::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Selected Drivers::::
export const deleteSelectedDriver = async (req, res) => {
  const DriverIds = req.body;

  try {
    const deletedDriver = await Driver.deleteMany({ _id: { $in: DriverIds } });
    if (deletedDriver) {
      res.status(200).json(deletedDriver);
      console.log("Delete Selected Drivers SuccessFully::::");
    } else {
      res
        .status(406)
        .json("Error in finding Selected Drivers to Delete:::::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in DriverController/deleteSelectedDriver::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<::::::get Driver Details By filtering in Pagination::::>>>>>

export const getDriverByPagination = async (req, res) => {
  const { page, limit, search, leaveStatus, employmentType } = req.query;
  console.log(req.query);
  // console.log(page);

  try {
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10) || 50;

    const filter = {};

    if (search) {
      filter.$or = [
        { EmployeeName: { $regex: search, $options: "i" } },
        { PEN: { $regex: search, $options: "i" } },
      ];
    }

    if (leaveStatus) {
      filter.on_leave = leaveStatus;
    }

    if (employmentType) {
      filter.is_Permanent = employmentType;
    }

    const offset = parsedPage * parsedLimit;
    const drDetails = await Driver.find(filter)
      .skip(offset)
      .limit(parsedLimit)
      .exec();

    const totalDrivers = await Driver.countDocuments(filter);
    const totalPages = Math.ceil(totalDrivers / parsedLimit);

    res.status(200).json({
      success: true,
      data: drDetails,
      meta: {
        totalItems: totalDrivers,
        totalPages: totalPages,
        currentPage: parsedPage,
        limit: parsedLimit,
      },
    });
  } catch (err) {
    console.log(
      "Error at catch in DriverController/getDriverByPagination::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<<:::::::::Get filtered Drivers details to schedule trip :::::::::>>>>>>>>
export const getFilteredDriversForTrip = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        //   { EmployeeName: { $regex: search, $options: "i" } },
        { PEN: { $regex: search, $options: "i" } },
      ];
    }

    const driverList = await Driver.find(filter)
      .select("EmployeeName PEN _id");
    res.status(200).json(driverList);
  } catch (err) {
    console.log(
      "Error at catch in DriverController/getFilteredDriversForTrip::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
