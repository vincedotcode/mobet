import { XCircle } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentFailed() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-3xl backdrop-blur-sm shadow-2xl transition-all duration-500 ease-in-out hover:scale-105">
        <CardHeader className="text-center space-y-8 pb-10">
          <div className="relative inline-block mx-auto">
            <div className="absolute inset-0rounded-full animate-pulse"></div>
            <XCircle className="w-32 h-32 text-red-500 relative z-10 animate-bounce" />
          </div>
          <CardTitle className="text-5xl font-bold text-red-700 tracking-tight">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-3xl text-gray-700 font-light">
            We&#39;re sorry, but your payment couldn&#39;t be processed.
          </p>
          <p className="text-3xl text-gray-700 font-light">
            Please check your payment details and try again.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-6 pt-10">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-xl px-8 py-6 border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Link href="/contact-support">Contact Support</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="text-xl px-10 py-8 bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            <Link href="/retry-payment">Retry Payment</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
