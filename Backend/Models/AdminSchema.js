import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique:true
    },
    depoName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Supervisor", "Maintenance","Staff"],
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Admins = mongoose.model("Admins", adminSchema);
export default Admins;
