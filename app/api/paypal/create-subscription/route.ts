import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal";
import axios from "axios";

export async function POST(request: Request) {
    try {
      const { planId } = await request.json();
  
      if (!planId) {
        return NextResponse.json(
          { error: "Plan ID is required" },
          { status: 400 }
        );
      }
  
      const accessToken = await getPayPalAccessToken();
      const PAYPAL_API = process.env.PAYPAL_API || "https://api-m.sandbox.paypal.com";
  
      // Ensure URLs are correctly constructed
      const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/success`;
      const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`;
  
      const response = await axios.post(
        `${PAYPAL_API}/v1/billing/subscriptions`,
        {
          plan_id: planId, // Pass valid Plan ID
          application_context: {
            brand_name: "Mobet",
            locale: "en-US",
            user_action: "SUBSCRIBE_NOW",
            return_url: returnUrl,
            cancel_url: cancelUrl,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      return NextResponse.json({ subscription: response.data }, { status: 201 });
    } catch (error: any) {
      console.error("Error creating subscription:", error.response?.data || error.message);
      return NextResponse.json(
        { error: "Failed to create subscription", details: error.response?.data || error.message },
        { status: 500 }
      );
    }
  }
  