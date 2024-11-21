import bcrypt from "bcrypt";
import Admins from "../Models/AdminSchema.js";

export const Register = async (req, res) => {
    const { userName, depoName, password, role } = req.body;
    try {
        const existingUser = await Admins.findOne({ userName });
        if (existingUser) {
            res.status(406).json("User Already Existing::::")
        } else {
            const newUser = new Admins({
                userName, depoName, password, role
            });
            await newUser.save();
            res.status(201).json(newUser)
        }
    } catch (err) {
        console.log("Error at catch in AdminController/Register::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const adminLogin = async (req, res) => {
    const { userName, password } = req.body;
    try {
        const findUser = await Admins.findOne({ userName });
        if (!findUser) {
            res.status(404).json("Not found Any Users::::");
        } else {
            const isMatch = await bcrypt.compare(password, findUser.password);
            if (isMatch) {
                return res.status(200).json({
                    message: "Login successful",
                    user: {
                        userName: findUser.userName,
                        depoName: findUser.depoName,
                        role: findUser.role
                    }
                });
            } else {
                res.status(401).json("Not Match please check the credentials::::")
            }
        }
    } catch (err) {
        console.log("Error at catch in AdminController/adminLogin::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllAdminDetails = async (req, res) => {
    try {
        const allAdmin = await Admins.find();
        if (allAdmin) {
            res.status(200).json(allAdmin);
        } else {
            res.status(406).json("Not Found Any Data:::::")
        }
    } catch (err) {
        console.log("Error at catch in AdminController/getAllAdminDetails::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const editAdmindetailsById = async (req, res) => {
    const { userName, depoName, password, role } = req.body;
    const { admin_id } = req.params;
    try {
        const updateData = { userName, depoName, role };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
            console.log("Password");
            
        }
        const updatedAdmin = await Admins.findByIdAndUpdate(admin_id, updateData, { new: true });
        if (updatedAdmin) {
            res.status(200).json(updatedAdmin);
        } else {
            res.status(406).json("Error in Editing Admin details:::::")
        }
    } catch (err) {
        console.log("Error at catch in AdminController/getAllAdminDetails::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}