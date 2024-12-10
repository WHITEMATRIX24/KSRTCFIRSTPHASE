import PambaChain from "../Models/PambaChainSchema.js";

// <<<<<<::::::::Adding New ::::::::>>>
export const addPambaChainService = async (req, res) => {
  const { numberOfBuses, numberOfTrips, numberOfStaffs, date } = req.body;
  try {
    const newService = new PambaChain({
      numberOfBuses,
      numberOfTrips,
      numberOfStaffs,
      date,
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    console.log(
      "Error at PambaChainController/addPambaChainService::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// <<<<<<<:::::::Getting All Ledger Details From DB::::::::>>>>>>>>>
export const getAllPambaChainServices = async (req, res) => {
  try {
    const { date } = req.query;

    const allServices = await PambaChain.find({
      ...(date && { date: date }),
    });
    if (allServices) {
      res.status(200).json(allServices);
    } else {
      res.status(406).json("Can't get All Pamba Chain Services Data:::::");
    }
  } catch (err) {
    console.log(
      "Error at PambaChainController/getAllPambaChainServices::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
