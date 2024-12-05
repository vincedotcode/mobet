'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon, CheckIcon } from 'lucide-react'

// Mock data - replace with actual data fetching in a real application
const subscriptionPlans = [
  { id: 'basic', name: 'Basic', price: 9.99 },
  { id: 'pro', name: 'Pro', price: 19.99 },
  { id: 'enterprise', name: 'Enterprise', price: 49.99 },
]

const currentSubscription = {
  plan: 'basic',
  nextBilling: '2023-07-01',
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState(currentSubscription.plan)

  const handleChangePlan = () => {
    // Implement the logic to change the plan
    console.log(`Changed plan to ${selectedPlan}`)
  }

  const handleCancelSubscription = () => {
    // Implement the logic to cancel the subscription
    console.log('Subscription cancelled')
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {subscriptionPlans.find(plan => plan.id === currentSubscription.plan)?.name} Plan
              </span>
              <span className="text-green-600 flex items-center">
                <CheckIcon className="mr-2 h-4 w-4" /> Active
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
            <span className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" /> Next billing date
            </span>
            <span>{currentSubscription.nextBilling}</span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Subscription</CardTitle>
            <CardDescription>Select a new plan to upgrade or downgrade</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} (${plan.price}/month)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full">Change Plan</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to change your plan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to change your subscription to the {subscriptionPlans.find(plan => plan.id === selectedPlan)?.name} plan.
                    This action will take effect immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleChangePlan}>Confirm Change</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancel Subscription</CardTitle>
            <CardDescription>Permanently cancel your current subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Warning: Cancelling your subscription will immediately revoke access to all premium features.
              You can resubscribe at any time to regain access.
            </p>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">Cancel Subscription</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to cancel your subscription?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. You will lose access to all premium features immediately.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>Keep Subscription</Button>
                  <Button variant="destructive" onClick={handleCancelSubscription}>Cancel Subscription</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
