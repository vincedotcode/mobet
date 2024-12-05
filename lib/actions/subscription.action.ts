 "use server";

import Subscription from "@/lib/database/models/subscription.model";
import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "@/lib/utils";

export async function createSubscription(userId: string, planId: string) {
  try {
    await connectToDatabase();

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Create a new subscription entry in the database
    const newSubscription = await Subscription.create({
      userId,
      planId,
      status: "PENDING",
    });

    return JSON.parse(JSON.stringify(newSubscription));
  } catch (error) {
    console.error(error);
    handleError(error);
    throw new Error("Failed to create subscription");
  }
}

export async function handleSubscriptionApproval(subscriptionId: string, subscriptionDetails: any) {
  try {
    await connectToDatabase();

    // Update subscription status to ACTIVE
    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { status: "ACTIVE", details: subscriptionDetails },
      { new: true }
    );

    if (!subscription) throw new Error("Subscription not found");

    // Update user's subscription status
    await User.findByIdAndUpdate(subscription.userId, { isSubscribed: true, plan: subscription.planId });

    return JSON.parse(JSON.stringify(subscription));
  } catch (error) {
    console.error(error);
    handleError(error);
    throw new Error("Failed to handle subscription approval");
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    await connectToDatabase();

    // Find the subscription
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) throw new Error("Subscription not found");

    // Mark subscription as cancelled
    subscription.status = "CANCELLED";
    await subscription.save();

    // Update user's subscription status
    await User.findByIdAndUpdate(subscription.userId, { isSubscribed: false, plan: null });

    return JSON.parse(JSON.stringify(subscription));
  } catch (error) {
    console.error(error);
    handleError(error);
    throw new Error("Failed to cancel subscription");
  }
}
