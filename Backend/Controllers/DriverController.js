import Driver from '../Models/DiverSchema.js';

// <<<<<<::::::::Adding New Driver Details::::::::>>>

export const addNewDriver = async (req, res) => {
    const { first_name, last_name, dob, gender, role, is_permanent, salary,
        salary_frequency, license_number, contact_info: { phone }, emergency_contact } = req.body;
    // const image = req.file ? req.file.filename : null;
    try {
        const existingDriver = await Driver.findOne({ license_number });
        if (existingDriver) {
            res.status(406).json("Driver is Already Existing:::::");
        } else {
            const newDriver = new Driver({
                first_name, last_name, dob, gender, role, is_permanent,
                salary, salary_frequency, license_number, emergency_contact,
                contact_info: {
                    phone: phone,
                },
                emergency_contact
            });
            await newDriver.save();
            res.status(201).json(newDriver);
        }
    } catch (err) {
        console.log("Error at catch in DriverController/addNewDriver::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

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
        console.log("Error at catch in DriverController/getAllDriverDetails::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// <<<<<:::::::::Editing Driver Details By driver_id:::::::::>>>>>>>>>
export const editDriverDetails = async (req, res) => {
    const { first_name, last_name, dob, gender, role, is_permanent, salary, salary_frequency,
        on_leave, license_number, phone, blood_group, emergency_contact } = req.body;
    const { driver_id } = req.params;
    try {
        const updatedDriver = await Driver.findByIdAndUpdate(driver_id, {
            first_name, last_name, dob, gender, role, is_permanent,
            salary, salary_frequency, on_leave, license_number,
            contact_info: {
                phone: phone
            },
            blood_group, emergency_contact
        }, { new: true });

        if (updatedDriver) {
            res.status(200).json(updatedDriver);
        } else {
            res.status(406).json("Updation of Driver is Failed, Error in editDriverDetails (if..) :::::::");
        }
    } catch (err) {
        console.log("Error at catch in DriverController/editDriverDetails::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}


// Edit Leave Status

export const editLeaveStatus = async (req, res) => {
    const { on_leave } = req.body;
    const { driver_id } = req.params;

    console.log("driver_id", driver_id);  // Log the driver ID
    console.log("body", req.body);  // Log the entire body to confirm `on_leave`

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
            { new: true }  // `new: true` returns the updated document
        );

        // Check if the update was successful
        if (editStatus) {
            console.log("Driver status updated:", editStatus);  // Log the updated driver
            res.status(200).json(editStatus);
        } else {
            console.log("Update failed!");  // Log if the update fails
            res.status(406).json("Can't edit Status Now:::::");
        }
    } catch (err) {
        console.log("Error in DriverController/editLeaveStatus:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
