import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    userBio: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin", "system"],
      default: "user",
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 }, { unique: true });

const User = models?.User || model("User", UserSchema);

export default User;
