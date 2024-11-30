import DCEmployees from "../Models/dcEmployees.js";

// get all employees
export const getDCEmployees = async (req,res) => {
    try{
        const data = await DCEmployees.find()
        res.status(200).json(data)

    }catch(err){
        console.log("Error at catch in dcEmployeesController/getDCEmployees::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// add an employee
export const addDCEmployee = async (req,res) => {
    try{
        const {EmployeeName,PEN,Designation,UNIT,is_Permanent,phone,on_leave} = req.body;
        const existingEmployee = await DCEmployees.findOne({PEN});
        const date = new Date()
        if(existingEmployee){
            res.status(406).json("Employee is Already Existing:::::");
        }else{
            const newEmployee = new DCEmployees({
                EmployeeName,PEN,Designation,UNIT,is_Permanent,phone,on_leave, created_at:date
            });
            await newEmployee.save();
            res.status(201).json(newEmployee);
        }

    }catch(err){
        console.log("Error at catch in dcEmployeesController/addDCEmployee::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// update employee
export const updateDCEmployee = async (req,res) => {
    try{
        const {EmployeeName,PEN,Designation,UNIT,is_Permanent,phone,on_leave} = req.body;
        const {id}=req.params
        const data = await DCEmployees.findByIdAndUpdate(
            id, 
            {EmployeeName,PEN,Designation,UNIT,is_Permanent,phone,on_leave},
            { new: true }
        )
        res.status(200).json(data)
    }catch(err){
        console.log("Error at catch in dcEmployeesController/updateDCEmployee::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}


// <<<<<:::::::::Get filtered dcEmployees details to schedule trip :::::::::>>>>>>>>
export const getFilteredDCEmployeesForTrip = async (req,res) => {
    try{
      const {search} = req.query
      const filter = {}

      if (search) {
        filter.$or = [
        //   { EmployeeName: { $regex: search, $options: "i" } },
          { PEN: { $regex: search, $options: "i" } },
        ];
    }
  
      const EmployeeList = await DCEmployees.find(filter).select("EmployeeName PEN _id")
      res.status(200).json(EmployeeList)
  
    }catch(err){
      console.log(
        "Error at catch in dcEmployeeController/getFilteredDCEmployeesForTrip::::::",
        err
      );
      res.status(500).json({ error: "Internal server error" });
    }
  }