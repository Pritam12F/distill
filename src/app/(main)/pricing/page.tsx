"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying Distill",
    features: [
      "1 topic once",
      "Basic AI summaries",
      "Up to 5 sources per topic",
      "Email delivery",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$20",
    period: "/month",
    description: "For people who rely on staying informed",
    features: [
      "Unlimited topics",
      "Multiple digests & schedules",
      "Advanced AI summaries",
      "Unlimited sources",
      "Custom summary instructions",
      "Priority delivery",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] dark:bg-[#14110E] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
            Simple pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-[#f1ece2] dark:bg-[#1C1814] p-8 ${
                plan.highlighted
                  ? "border-primary shadow-md"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#755815] dark:bg-[#D9A441] px-3 py-1 text-xs font-medium text-[#FBF6EE] dark:text-[#14110E]">
                  Most popular
                </span>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {plan.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full cursor-pointer bg-[#755815] hover:bg-[#5F4711] text-[#FBF6EE] dark:bg-[#D9A441] dark:text-[#14110E] dark:hover:bg-[#C4932F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755815] dark:focus-visible:outline-[#D9A441]"
                size="lg"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
}