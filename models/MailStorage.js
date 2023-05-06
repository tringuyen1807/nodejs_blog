const mongoose = require("mongoose");

const mailstorageSchema = new mongoose.Schema({
  from: String,
  to: String,
  subject: String,
  body: String,
  date: Date
});

module.exports = mongoose.model("MailStorage", mailstorageSchema);