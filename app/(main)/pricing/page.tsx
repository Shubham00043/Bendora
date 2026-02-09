
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, Sparkles } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Upgrade Your Learning Journey</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of Meetsy with our Pro plan. Get unlimited AI matching, advanced analytics, and more.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Free Plan */}
        <Card className="relative overflow-hidden border-2 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckIcon className="size-4 text-primary" />
                <span>Join up to 2 communities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="size-4 text-primary" />
                <span>Basic Matchmaking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="size-4 text-primary" />
                <span>Limited daily messages</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative overflow-hidden border-primary shadow-lg h-full flex flex-col">
          <div className="absolute top-0 right-0 p-3">
             <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                 <Sparkles className="size-3" /> Popular
             </span>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>For serious learners</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckIcon className="size-4 text-primary" />
                <span>Unlimited communities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="size-4 text-primary" />
                <span>AI-Powered Matching</span>
              </li>
              <li className="flex items-center gap-2">
                 <CheckIcon className="size-4 text-primary" />
                 <span>Advanced Conversation Summaries</span>
              </li>
              <li className="flex items-center gap-2">
                 <CheckIcon className="size-4 text-primary" />
                 <span>Priority Support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg">
              Upgrade to Pro
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
