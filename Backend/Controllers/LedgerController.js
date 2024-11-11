import Ledgers from '../Models/LedgerSchema.js';

// <<<<<<::::::::Adding New Ledger Details::::::::>>>
export const newLedgerData = async (req, res) => {
    const { amount, category, description } = req.body;
    try {
        const newLedgerData = new Ledgers({
            amount, category, description
        });
        await newLedgerData.save();
        res.status(201).json(newLedgerData);
    } catch (err) {
        console.log("Error at LedgerController/newLedgerData::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// <<<<<<<:::::::Getting All Ledger Details From DB::::::::>>>>>>>>>
export const getAllLedgerData = async (req, res) => {
    try {
        const allLedgerData = await Ledgers.find();
        if (allLedgerData) {
            res.status(200).json(allLedgerData);
        } else {
            res.status(406).json("Can't get All Ledger Data:::::");
        }
    } catch (err) {
        console.log("Error at LedgerController/getAllLedgerData::::::", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
