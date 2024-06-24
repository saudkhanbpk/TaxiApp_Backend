const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  date: { type: String, required: true },
  day: { type: String, required: true },
  cash: { type: Number, required: true },
  card: { type: Number, required: true },
  extraBills: { type: Number, required: true }
});

module.exports = mongoose.model('TaxiReport', reportSchema);
