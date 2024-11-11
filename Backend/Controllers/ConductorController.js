import Conductor from '../Models/ConductorSchema.js';

// <<<<<<::::::::Adding New Conductor Details::::::::>>>

export const addNewConductor = async (req, res) => {
    const { first_name, last_name, dob, gender, role, is_permanent, salary_frequency,
        contact_info: { phone }, } = req.body;

    try {
        const existingConducter = await Conductor.findOne({ contact_info: phone });
        if (existingConducter) {
            // console.log("existingUser",existingConducter);
            res.status(406).json("Conductor is Already Existing:::::");
        } else {
            const newConductor = new Conductor({
                first_name, last_name, dob, gender, role, is_permanent, salary_frequency,
                contact_info: {
                    phone,
                }
            });
            await newConductor.save();
            res.status(201).json(newConductor);
        }
    } catch (err) {
        console.log("Error at catch in ConductorController/addNewConductor::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}


// <<<<<<<:::::::Getting All Conductor Details From DB::::::::>>>>>>>>>

export const getAllConductorDetails = async (req, res) => {
    try {
        const allConductorDetails = await Conductor.find();
        if (allConductorDetails) {
            res.status(200).json(allConductorDetails);
        } else {
            res.status(406).json("Can't find Any Conductor Details::::")
        }
    } catch (err) {
        console.log("Error at catch in DriverController/getAllConductorDetails::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// <<<<<:::::::::Editing Conductor Details By conductor_id:::::::::>>>>>>>>>
export const editConductorDetails = async (req, res) => {
    const { first_name, last_name, dob, gender, role, is_permanent, salary, salary_frequency, on_leave,
        contact_info: { phone }, blood_group } = req.body;
    const { conductor_id } = req.params;
    try {
        const updatedConductor = await Conductor.findByIdAndUpdate(conductor_id, {
            first_name, last_name, dob, gender, role, is_permanent, salary_frequency, salary,
            on_leave,
            contact_info: {
                phone: phone,
            },
            blood_group
        }, { new: true });
        if (updatedConductor) {
            res.status(200).json(updatedConductor);
            console.log(updatedConductor);

        } else {
            res.status(406).json("Updation of Conductor is Failed, Error in editConductorDetails (if..) :::::::");
        }
    } catch (err) {
        console.log("Error at catch in ConductorController/editConductorDetails::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}


// Edit Leave Status

export const editLeaveStatusConductor = async (req, res) => {
    const { on_leave } = req.body;
    const { conductor_id } = req.params;

    console.log("Conductor_id", conductor_id);
    console.log("body", req.body);

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
