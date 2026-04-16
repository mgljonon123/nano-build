import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

type Subscription = {
  id: number;
  user_id: string;
  plan_type: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  canceled_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  approval_status: string;
  billing_cycle: string;
};

type LoadingStatus = "idle" | "loading" | "success" | "error";

export default function Admin() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    setLoadingStatus("loading");
    setError(null);
    setIsRefreshing(true);

    try {
      const response = await fetch(
        "https://psdagicilalalr.app.n8n.cloud/webhook-test/8a980150-fd6a-4a60-aec8-7e179c9153c3",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSubscriptions(Array.isArray(data) ? data : []);
      setLoadingStatus("success");
    } catch (err: any) {
      console.error("Error fetching subscriptions:", err);
      setError(err.message || "Failed to fetch subscriptions");
      setLoadingStatus("error");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function updateSubscriptionStatus(
    subscriptionId: number,
    newStatus: string,
  ) {
    try {
      const response = await fetch(
        "https://psdagicilalalr.app.n8n.cloud/webhook-test/8a980150-fd6a-4a60-aec8-7e179c9153c3",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update_status",
            subscription_id: subscriptionId,
            status: newStatus,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchSubscriptions();
    } catch (err: any) {
      console.error("Error updating subscription:", err);
      setError(err.message || "Failed to update subscription");
    }
  }

  const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-amber-500/10";
      case "canceled":
        return "bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/10";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30 shadow-gray-500/10";
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-amber-500/10";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/10";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30 shadow-gray-500/10";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-950/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-950/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-950/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl border border-purple-800/50 shadow-lg shadow-purple-900/20">
                  <svg
                    className="w-6 h-6 text-purple-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Manage user subscriptions and approvals
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={fetchSubscriptions}
              disabled={isRefreshing}
              className="px-6 py-3 bg-gradient-to-r from-purple-800 to-blue-800 text-white font-medium rounded-xl hover:from-purple-900 hover:to-blue-900 transition-all duration-300 shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-purple-700/50"
            >
              <svg
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Subscriptions",
              value: subscriptions.length,
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0"
                  />
                </svg>
              ),
              gradient: "from-blue-600/20 to-cyan-600/20",
              borderColor: "border-blue-500/30",
              textColor: "text-blue-400",
            },
            {
              label: "Active",
              value: subscriptions.filter((s) => s.status === "active").length,
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              gradient: "from-emerald-600/20 to-green-600/20",
              borderColor: "border-emerald-500/30",
              textColor: "text-emerald-400",
            },
            {
              label: "Pending",
              value: subscriptions.filter((s) => s.status === "pending").length,
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              gradient: "from-amber-600/20 to-orange-600/20",
              borderColor: "border-amber-500/30",
              textColor: "text-amber-400",
            },
            {
              label: "Approval Pending",
              value: subscriptions.filter(
                (s) => s.approval_status === "pending",
              ).length,
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              ),
              gradient: "from-purple-600/20 to-pink-600/20",
              borderColor: "border-purple-500/30",
              textColor: "text-purple-400",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="relative group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
              <div
                className={`relative bg-gray-900/80 backdrop-blur-sm border ${stat.borderColor} rounded-2xl p-6 hover:border-opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl border-gray-800/50`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-2 bg-black/50 rounded-lg ${stat.textColor} border border-gray-800/50`}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`text-xs font-medium uppercase tracking-wider ${stat.textColor} opacity-70`}
                  >
                    {stat.label}
                  </div>
                </div>
                <div className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscriptions Table */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg border border-purple-800/50">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-100">
                  User Subscriptions
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">
                  {loadingStatus === "loading"
                    ? "Loading..."
                    : `${subscriptions.length} records`}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-6 border-b border-gray-800/50">
              <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-sm text-red-400 animate-fade-in">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-400 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold mb-1">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            {loadingStatus === "loading" ? (
              <div className="flex justify-center py-20">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-gray-800 border-t-purple-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-blue-600 rounded-full animate-spin animation-delay-150"></div>
                </div>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-900/80 rounded-full flex items-center justify-center border border-gray-800/50">
                  <svg
                    className="w-10 h-10 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">No subscriptions found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800/50">
                    <th className="text-left py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-400">
                      ID
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-400">
                      User ID
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Plan
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Approval
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Billing
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Period
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30">
                  {subscriptions.map((subscription, index) => (
                    <tr
                      key={subscription.id}
                      className="hover:bg-gray-900/50 transition-colors duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-4 px-6 font-mono text-xs text-gray-500">
                        {subscription.id}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-500">
                        {subscription.user_id
                          ? String(subscription.user_id).substring(0, 8)
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-purple-300 border border-purple-800/50">
                          {subscription.plan_type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              subscription.status === "active"
                                ? "bg-emerald-400"
                                : subscription.status === "pending"
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                            }`}
                          ></div>
                          {subscription.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getApprovalStatusColor(subscription.approval_status)}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              subscription.approval_status === "approved"
                                ? "bg-emerald-400"
                                : subscription.approval_status === "pending"
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                            }`}
                          ></div>
                          {subscription.approval_status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-400 capitalize">
                        {subscription.billing_cycle}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500">
                        {formatDate(subscription.current_period_start)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          {subscription.status !== "active" && (
                            <button
                              onClick={async () => {
                                try {
                                  // Send user data to new webhook
                                  const webhookResponse = await fetch(
                                    "https://psdagicilalalr.app.n8n.cloud/webhook-test/db1ac92d-1b14-4279-91ff-b36f6f97c534",
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        user_id: subscription.user_id,
                                        subscription_id: subscription.id,
                                        plan_type: subscription.plan_type,
                                        status: subscription.status,
                                        billing_cycle:
                                          subscription.billing_cycle,
                                        current_period_start:
                                          subscription.current_period_start,
                                        current_period_end:
                                          subscription.current_period_end,
                                      }),
                                    },
                                  );

                                  if (webhookResponse.ok) {
                                    // Also update subscription status locally
                                    updateSubscriptionStatus(
                                      subscription.id,
                                      "active",
                                    );
                                    // Refresh page if status is active and response is success
                                    setTimeout(() => {
                                      window.location.reload();
                                    }, 1000);
                                  } else {
                                    throw new Error("Failed to activate user");
                                  }
                                } catch (err: any) {
                                  console.error("Error activating user:", err);
                                  setError(
                                    err.message || "Failed to activate user",
                                  );
                                }
                              }}
                              className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-emerald-700 to-green-700 text-white rounded-lg hover:from-emerald-800 hover:to-green-800 transition-all duration-200 shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 border border-emerald-600/50"
                            >
                              Activate
                            </button>
                          )}
                          {subscription.status !== "pending" && (
                            <button
                              onClick={() =>
                                updateSubscriptionStatus(
                                  subscription.id,
                                  "pending",
                                )
                              }
                              className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-700 to-orange-700 text-white rounded-lg hover:from-amber-800 hover:to-orange-800 transition-all duration-200 shadow-lg shadow-amber-900/40 hover:shadow-amber-900/60 border border-amber-600/50"
                            >
                              Set Pending
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-150 {
          animation-delay: 150ms;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
