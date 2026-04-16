import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Status = "idle" | "loading" | "success" | "error";
type BillingCycle = "monthly" | "quarterly" | "yearly";

export default function Subscription() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const plans = [
    {
      id: "normal",
      name: "Normal",
      description: "Perfect for individual users",
      monthlyPrice: 29,
      quarterlyPrice: 79,
      yearlyPrice: 290,
      mainFeatures: [
        "10 photos furnished or emptied by AI",
        "20 photos automatically enhanced",
        "50 Creative Re-style",
        "100 credits for other edits"
      ],
      includedServices: [
        "High resolution images",
        "Commercial use",
        "No watermark"
      ],
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      description: "For real estate professionals",
      monthlyPrice: 79,
      quarterlyPrice: 199,
      yearlyPrice: 790,
      mainFeatures: [
        "30 photos furnished or emptied by AI",
        "60 photos automatically enhanced",
        "150 Creative Re-style",
        "300 credits for other edits"
      ],
      includedServices: [
        "High resolution images",
        "Commercial use",
        "No watermark",
        "Priority processing",
        "Custom style requests"
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large teams and agencies",
      monthlyPrice: 199,
      quarterlyPrice: 499,
      yearlyPrice: 1990,
      mainFeatures: [
        "Unlimited photos furnished or emptied by AI",
        "Unlimited photos automatically enhanced",
        "Unlimited Creative Re-style",
        "1000 credits for other edits"
      ],
      includedServices: [
        "High resolution images",
        "Commercial use",
        "No watermark",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options",
        "API access",
        "Priority processing"
      ],
      popular: false,
    },
  ];

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!selectedPlan) {
      setError("Please select a plan first");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const { data: authData } = await supabase.auth.getSession();
      const token = authData.session?.access_token;

      // Get selected plan details
      const selectedPlanData = plans.find((p) => p.id === selectedPlan);

      // Prepare data for N8N webhook - matching Prisma user_subscriptions schema
      const subscriptionData = {
        // Required fields for user_subscriptions table
        user_id: authData.session?.user?.id || null,
        plan_type: selectedPlanData?.name?.toLowerCase() || "starter",
        status: "pending",
        approval_status: "pending",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() +
            (billingCycle === "monthly" ? 30 : billingCycle === "quarterly" ? 90 : 365) * 24 * 60 * 60 * 1000,
        ).toISOString(),

        // Additional user info for contact/records
        user_info: {
          fullName: authData.session?.user?.user_metadata?.full_name || "User",
          email: authData.session?.user?.email || "",
          billing_cycle: billingCycle,
          monthly_price: selectedPlanData?.monthlyPrice || null,
          quarterly_price: selectedPlanData?.quarterlyPrice || null,
          yearly_price: selectedPlanData?.yearlyPrice || null,
          plan_id: selectedPlan || null,
        },

        // Metadata
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Send data to N8N webhook with authentication
      const webhookResponse = await fetch("https://psdagicilalalr.app.n8n.cloud/webhook-test/bb8e4aab-2a6a-40c4-9612-e34cb615622e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }), // JWT token for N8N auth
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        throw new Error(`Webhook error: ${errorText}`);
      }

      // Also send to your API endpoint
      if (token) {
        const apiResponse = await fetch("/api/subscription", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        
        console.log("API response:", apiResponse.status);
      }

      setStatus("success");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-stone)] mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select perfect plan for your real estate photo enhancement needs
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-[var(--color-stone)] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("quarterly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "quarterly"
                    ? "bg-white text-[var(--color-stone)] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                3 Months <span className="text-green-600 font-semibold">Save 10%</span>
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "yearly"
                    ? "bg-white text-[var(--color-stone)] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Yearly <span className="text-green-600 font-semibold">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 transition-all hover:shadow-xl ${
                  plan.popular
                    ? "border-[var(--color-forest)] bg-gradient-to-br from-emerald-50 to-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[var(--color-forest)] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      $
                      {billingCycle === "monthly"
                        ? plan.monthlyPrice
                        : billingCycle === "quarterly"
                        ? plan.quarterlyPrice
                        : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-600">
                      /{billingCycle === "monthly" ? "month" : billingCycle === "quarterly" ? "3 months" : "year"}
                    </span>
                  </div>
                </div>

                {/* Main Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Main Features</h4>
                  <ul className="space-y-2">
                    {plan.mainFeatures.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Included Services */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Included Services</h4>
                  <ul className="space-y-2">
                    {plan.includedServices.map((service: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    selectedPlan === plan.id
                      ? "bg-[var(--color-forest)] text-white"
                      : plan.popular
                        ? "bg-[var(--color-forest)] text-white hover:opacity-90"
                        : "border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </button>
              </div>
            ))}
          </div>

          {/* Send Request Button */}
          {selectedPlan && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg text-center">
                {status === "success" ? (
                  <div className="py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        viewBox="0 0 20 20"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Subscription Request Received!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for your interest in{" "}
                      {plans.find((p) => p.id === selectedPlan)?.name} plan.
                      We'll review your request and get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}
                    
                    <button
                      onClick={handleSubmit}
                      disabled={status === "loading"}
                      className="w-full py-4 bg-[var(--color-forest)] text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "loading"
                        ? "Processing..."
                        : "Send Request"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
