import React, { useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

type Status = "idle" | "loading" | "success" | "error";
type BillingCycle = "monthly" | "yearly";

const fieldClass =
  "w-full appearance-none rounded-2xl border border-white/40 bg-white/60 px-5 py-3.5 text-sm font-medium text-[var(--color-stone)] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/40 focus:bg-white hover:bg-white/80";

const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-[var(--color-forest)]/80 mb-2 ml-1";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const contactRef = useRef<HTMLDivElement>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for getting started",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        "10 AI staging credits per month",
        "Basic room styles",
        "Standard resolution (1080p)",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      description: "For real estate professionals",
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        "50 AI staging credits per month",
        "Premium room styles",
        "High resolution (4K)",
        "Priority email support",
        "Custom style requests",
        "Batch processing",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For teams and agencies",
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        "Unlimited AI staging credits",
        "All premium styles",
        "Ultra-high resolution (8K)",
        "24/7 phone support",
        "Custom integrations",
        "Team collaboration tools",
        "White-label options",
      ],
      popular: false,
    },
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const { data: authData } = await supabase.auth.getSession();
      const token = authData.session?.access_token;

      // Add plan and billing info to form data
      formData.append("plan", selectedPlan);
      formData.append("billingCycle", billingCycle);

      const response = await fetch("/api/contact-subscription", {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  const displayPrice = (plan: (typeof plans)[0]) => {
    const price =
      billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
    return billingCycle === "monthly" ? `$${price}/month` : `$${price}/year`;
  };

  const savingsPercentage = (plan: (typeof plans)[0]) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = ((monthlyTotal - plan.yearlyPrice) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  return (
    <div className="font-marketing flex-1 w-full relative bg-[var(--color-sand)] bg-[radial-gradient(ellipse_at_top,_var(--color-sand)_0%,_#EAE3D9_100%)] text-[var(--color-stone)] flex flex-col min-h-0 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-orange-100/40 blur-[120px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-forest)]/5 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col justify-center py-4 lg:py-8 min-h-0 max-h-full">
        {/* Header */}
        <div className="text-center mb-0 lg:mb-0 animate-slide-up">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest text-[var(--color-forest)] uppercase mb-4 px-3 py-1 rounded-full bg-[var(--color-forest)]/5 border border-[var(--color-forest)]/10 shadow-sm">
            <SparklesIcon className="w-4 h-4" /> Pricing Plans
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight font-medium leading-[1.1] mb-6">
            Choose your perfect
            <span className=" italic">plan.</span>
          </h1>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8 lg:mb-12 animate-slide-up delay-100">
          <div className="inline-flex items-center p-1 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-[var(--color-forest)] text-white shadow-lg"
                  : "text-[var(--color-stone)]/70 hover:text-[var(--color-stone)]"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-[var(--color-forest)] text-white shadow-lg"
                  : "text-[var(--color-stone)]/70 hover:text-[var(--color-stone)]"
              }`}
            >
              Yearly
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16 animate-slide-up delay-200">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? "bg-gradient-to-br from-[var(--color-forest)] to-emerald-700 text-white border-2 border-[var(--color-forest)] shadow-2xl"
                  : "bg-white/60 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-orange-500 text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3
                  className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-[var(--color-stone)]"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${plan.popular ? "text-emerald-100" : "text-[var(--color-muted)]"}`}
                >
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span
                    className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-[var(--color-forest)]"}`}
                  >
                    {displayPrice(plan)}
                  </span>
                  {billingCycle === "yearly" && (
                    <p
                      className={`text-sm mt-2 ${plan.popular ? "text-emerald-100" : "text-[var(--color-muted)]"}`}
                    >
                      Save {savingsPercentage(plan)}% annually
                    </p>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckIcon
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? "text-emerald-200" : "text-[var(--color-forest)]"}`}
                    />
                    <span
                      className={`text-sm ${plan.popular ? "text-emerald-50" : "text-[var(--color-stone)]"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlan(plan.id);
                  contactRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full py-3.5 rounded-2xl font-semibold transition-all ${
                  selectedPlan === plan.id
                    ? plan.popular
                      ? "bg-white text-[var(--color-forest)] shadow-lg"
                      : "bg-[var(--color-forest)] text-white shadow-lg"
                    : plan.popular
                      ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-[var(--color-stone)] hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </button>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div 
          ref={contactRef}
          className="max-w-2xl mx-auto w-full animate-slide-up delay-300"
        >
          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[var(--color-stone)] mb-6 text-center">
              Get Started Today
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className={fieldClass}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className={fieldClass}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className={fieldClass}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className={labelClass}>Company (Optional)</label>
                <input
                  type="text"
                  name="company"
                  className={fieldClass}
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className={fieldClass}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  name="message"
                  rows={4}
                  className={fieldClass}
                  placeholder="Tell us about your needs and how we can help..."
                />
              </div>

              {selectedPlan && (
                <div className="p-4 bg-[var(--color-forest)]/5 border border-[var(--color-forest)]/20 rounded-xl">
                  <p className="text-sm font-medium text-[var(--color-forest)]">
                    Selected Plan:{" "}
                    <span className="font-bold">
                      {plans.find((p) => p.id === selectedPlan)?.name}
                    </span>{" "}
                    - {displayPrice(plans.find((p) => p.id === selectedPlan)!)}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-2xl bg-[var(--color-forest)] text-white text-[15px] font-medium shadow-[0_8px_20px_rgba(27,67,50,0.2)] hover:shadow-[0_12px_25px_rgba(27,67,50,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <LoadingSpinner /> Processing...
                  </>
                ) : (
                  <>
                    Get Started <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50/80 backdrop-blur border border-red-100 rounded-xl text-sm text-red-700 animate-fade-in flex items-start gap-3">
                  <ErrorIcon className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                  <p>{error}</p>
                </div>
              )}

              {status === "success" && (
                <div className="p-4 bg-green-50/80 backdrop-blur border border-green-100 rounded-xl text-sm text-green-700 animate-fade-in flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 shrink-0 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-semibold mb-1">
                      Thank you for your interest!
                    </p>
                    <p>
                      We'll contact you within 24 hours to set up your
                      subscription.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Icons ---

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

function LoadingSpinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={`animate-spin h-5 w-5 ${props.className || ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

function ErrorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}
