import mongoose from "mongoose";
const userschema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  refreshtoken: {
    type: String,
  },
});
const user = mongoose.model("user", userschema);
export default user;
