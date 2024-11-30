import Conductor from "../Models/ConductorSchema.js";

// <<<<<<::::::::Adding New Conductor Details::::::::>>>
export const addNewConductor = async (req, res) => {
  const { EmployeeName, PEN, Designation, UNIT, is_Permanent, phone } =
    req.body;

  try {
    const existingConducter = await Conductor.findOne({ PEN });
    if (existingConducter) {
      // console.log("existingUser",existingConducter);
      res.status(406).json("Conductor is Already Existing:::::");
    } else {
      const newConductor = new Conductor({
        EmployeeName,
        PEN,
        Designation,
        UNIT,
        is_Permanent,
        phone,
      });
      await newConductor.save();
      res.status(201).json(newConductor);
    }
  } catch (err) {
    console.log(
      "Error at catch in ConductorController/addNewConductor::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<<<<:::::::Getting All Conductor Details From DB::::::::>>>>>>>>>
export const getAllConductorDetails = async (req, res) => {
  try {
    const allConductorDetails = await Conductor.find();
    if (allConductorDetails) {
      res.status(200).json(allConductorDetails);
    } else {
      res.status(406).json("Can't find Any Conductor Details::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in DriverController/getAllConductorDetails::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<<:::::::::Editing Conductor Details By conductor_id:::::::::>>>>>>>>>
export const editConductorDetails = async (req, res) => {
  const {
    EmployeeName,
    PEN,
    Designation,
    UNIT,
    is_Permanent,
    phone,
    on_leave,
  } = req.body;
  const { conductor_id } = req.params;
  try {
    const updatedConductor = await Conductor.findByIdAndUpdate(
      conductor_id,
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
    if (updatedConductor) {
      res.status(200).json(updatedConductor);
      console.log(updatedConductor);
    } else {
      res
        .status(406)
        .json(
          "Updation of Conductor is Failed, Error in editConductorDetails (if..) :::::::"
        );
    }
  } catch (err) {
    console.log(
      "Error at catch in ConductorController/editConductorDetails::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

//<<<<<<<::::::::Edit Leave Status::::::>>>>>>>
export const editLeaveStatusConductor = async (req, res) => {
  const { on_leave } = req.body;
  const { conductor_id } = req.params;
  // console.log("Conductor_id", conductor_id);
  // console.log("body", req.body);
  try {
    const driver = await Conductor.findById(conductor_id);
    if (!driver) {
      console.log("Conductor not found!");
      return res.status(404).json({ error: "Driver not found!" });
    }
    // Update the leave status
    const editStatus = await Conductor.findByIdAndUpdate(
      conductor_id,
      { on_leave: on_leave },
      { new: true }
    );
    // Check if the update was successful
    if (editStatus) {
      console.log("Conductor status updated:", editStatus);
      res.status(200).json(editStatus);
    } else {
      console.log("Update failed!");
      res.status(406).json("Can't edit Status Now:::::");
    }
  } catch (err) {
    console.log("Error in DriverController/editLeaveStatus:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//<<<<<<......Delete Conductor By conductor_id........>>>>
export const deleteConductorById = async (req, res) => {
  const { conductor_id } = req.params;
  try {
    const result = await Conductor.findByIdAndDelete(conductor_id);
    if (result) {
      res.status(200).json(result);
      console.log("Delete Successfully::::");
    } else {
      res.status(404).json("Error at Deleting Conductor Status(404)::::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in DriverController/deleteConductorById::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Selected Conductors::::
export const deleteSelectedConductor = async (req, res) => {
  const conductorIds = req.body;

  try {
    const deletedConductor = await Conductor.deleteMany({
      _id: { $in: conductorIds },
    });
    if (deletedConductor) {
      res.status(200).json(deletedConductor);
      console.log("Delete Selected Conductors SuccessFully::::");
    } else {
      res
        .status(406)
        .json("Error in finding Selected Conductors to Delete:::::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in DriverController/deleteSelectedConductor::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// getting paginated conductors list

export const getFilteredConductorsList = async (req, res) => {
  try {
    const { pageNum, itemsPerPage } = req.params;
    const { search, leaveStatus, employmentType } = req.query;

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

    const totalConductors = await Conductor.countDocuments(filter);

    const conductors = await Conductor.find(filter)
      .skip(pageNum * itemsPerPage)
      .limit(itemsPerPage);

    res.status(200).json({ conductors, length: totalConductors });
  } catch (err) {
    console.log(
      "Error at catch in ConductorController/getFilteredConductorsList::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<<:::::::::Get filtered conductors details to schedule trip :::::::::>>>>>>>>
export const getFilteredConductorsForTrip = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        //   { EmployeeName: { $regex: search, $options: "i" } },
        { PEN: { $regex: search, $options: "i" } },
      ];
    }

    const ConductorList = await Conductor.find(filter)
      .select("EmployeeName PEN _id")

      res.status(200).json(ConductorList);
  } catch (err) {
    console.log(
      "Error at catch in ConductorController/getFilteredConductorsForTrip::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
