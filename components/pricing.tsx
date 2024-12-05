import React, { useState } from "react";
import Wrapper from "./global/wrapper";
import Container from "./global/container";
import SectionBadge from "./ui/section-badge";
import { pricingCards } from "@/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import axios from "axios";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    if (!selectedPlan) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/paypal/create-subscription", {
        planId: selectedPlan.planId,
      });

      const { subscription } = response.data;
      window.location.href = subscription.links.find(
        (link: any) => link.rel === "approve"
      )?.href;
    } catch (error: any) {
      console.error("Subscription creation failed:", error.message);
      alert("Failed to create subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper className="flex flex-col items-center justify-center py-12 relative">
      <div className="hidden md:block absolute top-0 -right-1/3 w-72 h-72 bg-blue-500 rounded-full blur-[10rem] -z-10" />

      <Container>
        <div className="max-w-md mx-auto text-start md:text-center">
          <SectionBadge title="Pricing" />
          <h2 className="text-3xl lg:text-4xl 2xl:text-4xl mt-6 font-semibold">
            Find the right pricing plan for your business
          </h2>
          <p className="text-muted-foreground mt-6">
            Choose the best plan for your business and start engaging with your
            customers today!
          </p>
        </div>
      </Container>

      <Container className="flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full md:gap-8 py-10 md:py-20 flex-wrap max-w-4xl">
          {pricingCards.map((card) => (
            <Card
              key={card.title}
              className={cn(
                "flex flex-col w-full border-neutral-700",
                card.title === "Pro" && "border-2 border-primary"
              )}
            >
              <CardHeader className="border-b border-border">
                <span className="">{card.title}</span>

                <CardTitle
                  className={cn(
                    card.title !== "Pro" && "text-muted-foreground"
                  )}
                >
                  {card.price}
                </CardTitle>

                <CardDescription className="">
                  {card.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 space-y-3">
                {card.features.map((feature) => (
                  <div className="flex items-center gap-2" key={feature}>
                    <Zap name="h-4 w-4 fill-primary text-primary" />
                    <p className="">{feature}</p>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="mt-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Link
                      href={"#"}
                      className={cn(
                        "w-full text-center text-primary-foreground bg-primary p-2 rounded-md text-sm font-medium",
                        card.title !== "Pro" &&
                          "!bg-foreground !text-background"
                      )}
                      onClick={() => setSelectedPlan(card)}
                    >
                      {card.buttonText}
                    </Link>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Your Subscription</DialogTitle>
                      <DialogDescription>
                        You are about to subscribe to the <b>{card.title}</b>{" "}
                        plan. Are you sure you want to proceed?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <button
                        className="w-full bg-primary text-white p-2 rounded-md"
                        onClick={handleSubscription}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Proceed to PayPal"}
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </Wrapper>
  );
};

export default Pricing;
