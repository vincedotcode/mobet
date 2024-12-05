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
      enum: ["basic", "pro"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "canceled", "pending"],
      default: "pending",
    },
    startDate: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["paypal", "credit_card", "other"],
      default: "paypal",
    },
    subscriptionId: {
      type: String,
      required: true,
    },
    baToken: {
      type: String,
    },
    token: {
      type: String,
    },

  },
  {
    timestamps: true,
  }
);

const Subscription =
  models?.Subscription || model("Subscription", SubscriptionSchema);

export default Subscription;
