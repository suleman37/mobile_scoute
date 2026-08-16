import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema({}, {
  strict: false,
  collection: "phones",
});

const Phone = mongoose.models.Phone || mongoose.model("Phone", phoneSchema);

export default Phone;
