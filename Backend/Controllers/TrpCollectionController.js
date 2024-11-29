import TripCollections from "../Models/TripCollectionSchema.js";

export const addCollection = async (req, res) => {
  try {
    const { depot, date, Tripcollection, numOfPassengers, fuelCost } = req.body;
    console.log("req", req.body);

    const newCollection = new TripCollections({
      depot,
      date,
      Tripcollection,
      numOfPassengers,
      fuelCost,
    });
    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (err) {
    console.log(
      "Error at catch in Collection Controller/add new collection::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllCollection = async (req, res) => {
  try {
    const { date } = req.query;

    const allCollections = await TripCollections.find({
      ...(date && { date: date }),
    });
    res.status(200).json(allCollections);
  } catch (err) {
    console.log(
      "Error at catch in Collection Controller/get all collection::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCollectionsOfDepot = async (req, res) => {
  try {
    const { depot } = req.params;
    const { date } = req.query;
    console.log(date);

    const depotCollections = await TripCollections.find({
      depot,
      ...(date && { date: date }),
    });
    // console.log("Data",depotCollections);

    if (depotCollections.length > 0) {
      res.status(200).json(depotCollections);
    } else {
      res.status(406).json("Can't Find Any Data::::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in Collection Controller/get all collection::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCollectionsOfDate = async (req, res) => {
  try {
    const { date } = req.params;
    const dateCollections = await TripCollections.find({ date });
    if (dateCollections.length > 0) {
      res.status(200).json(dateCollections);
    } else {
      res.status(406).json("Can't Find Any Data::::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in Collection Controller/get all collection::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCollectionsOfDepotAndDate = async (req, res) => {
  try {
    const { depot } = req.params;
    const { date } = req.params;

    const filteredCollections = await TripCollections.find({ depot, date });
    if (filteredCollections.length > 0) {
      res.status(200).json(filteredCollections);
    } else {
      res.status(406).json("Can't Find Any Data::::::");
    }
  } catch (err) {
    console.log(
      "Error at catch in Collection Controller/get all collection::::::",
      err
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
