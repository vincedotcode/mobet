import { Schema, model, models, Types } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["basic", "pro", "enterprise"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "canceled"],
      default: "inactive",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["paypal", "credit_card", "other"],
      default: "paypal",
    },
  },
  {
    timestamps: true,
  }
);

const Subscription =
  models?.Subscription || model("Subscription", SubscriptionSchema);

export default Subscription;
