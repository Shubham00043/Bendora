import Link from "next/link";
import { Button } from "../ui/button";
import SectionHeading from "./section-heading";
import { CheckIcon } from "lucide-react";

export default function PricingSection() {
  return (
    <section className="section-container section-padding" id="pricing">
      <SectionHeading
        title="Simple, Transparent Pricing"
        description="Choose the plan that works best for you. Start free and upgrade as you grow."
      />
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mt-8">
        {/* Free Plan */}
        <div className="border rounded-xl p-8 bg-card shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-2xl font-bold">Free</h3>
            <div className="mt-2 text-3xl font-bold">
              $0<span className="text-base font-normal text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground mt-2">Perfect for trying out the platform.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" /> 1 Community
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" /> 1 Learning Goal
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" /> 3 Active Matches
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" /> Unlimited Chat
            </li>
          </ul>
          <Link href="/sign-up" className="w-full">
            <Button variant="outline" className="w-full" size="lg">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-primary rounded-xl p-8 bg-card shadow-lg relative flex flex-col">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
            POPULAR
          </div>
          <div className="mb-4">
            <h3 className="text-2xl font-bold">Pro</h3>
            <div className="mt-2 text-3xl font-bold">
              $19<span className="text-base font-normal text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground mt-2">For serious learners who want no limits.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" /> Unlimited Communities
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" /> Unlimited Learning Goals
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" /> Unlimited Matches
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" /> Priority AI Matching
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" /> Verified Pro Badge
            </li>
          </ul>
          <Link href="/sign-up?plan=pro" className="w-full">
            <Button className="w-full" size="lg">
              Get Pro Access
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
