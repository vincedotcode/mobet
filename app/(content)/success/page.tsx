"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/context/user-context";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // For extracting query params
import { createSubscription } from "@/lib/actions/subscription.action"; // Directly import the action

export default function PaymentSuccess() {
  const user = useUser();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);

  useEffect(() => {
    const createUserSubscription = async () => {
      if (user?.id && !subscriptionCreated) {
        try {
          const subscriptionId = searchParams.get("subscription_id");
          const baToken = searchParams.get("ba_token");
          const token = searchParams.get("token");

          if (!subscriptionId || !token) {
            console.error("Missing subscription details in query params");
            return;
          }

          setLoading(true);

          const planId = "pro"; // Hardcoded for demonstration; adjust as needed
          const subscription = await createSubscription(
            user.id,
            planId,
            subscriptionId ?? '',
            baToken ?? '',
            token ?? ''
          );

          if (subscription) {
            setSubscriptionCreated(true);
            console.log("Subscription created successfully:", subscription);
          }
        } catch (error: any) {
          console.error("Error creating subscription:", error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    createUserSubscription();
  }, [user, subscriptionCreated, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
           <Card className="w-full max-w-3xl backdrop-blur-sm shadow-2xl transition-all duration-500 ease-in-out hover:scale-105">
        <CardHeader className="text-center space-y-8 pb-10">
          <div className="relative inline-block mx-auto">
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping"></div>
            <CheckCircle className="w-32 h-32 text-green-500 relative z-10 animate-bounce" />
          </div>
          <CardTitle className="text-5xl font-bold text-green-700 tracking-tight">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-3xl ">Your payment has been confirmed.</p>
          <p className="text-3xl ">Your subscription has started.</p>
        </CardContent>
        <CardFooter className="flex justify-center pt-10">
          <Button asChild size="lg"  variant={'default'}>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
