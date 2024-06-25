const dotenv = require('dotenv');
const TaxiReport = require('../../TaxiBackend/models/TaxiReport');


dotenv.config();

exports.addReport = async (req, res) => {
    try {
      const { date, day, cash, card, extraBills } = req.body;
      const newReport = new TaxiReport({ date, day, cash, card, extraBills });
      const savedReport = await newReport.save();

     return res.status(201).json(savedReport);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };