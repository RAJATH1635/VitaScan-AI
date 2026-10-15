"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { formatISTDateTime } from "@/lib/dateUtils";
import {
  Bell,
  CheckCheck,
  Check,
  Trash2,
  Calendar,
  Brain,
  FileText,
  Activity,
  ArrowRight,
  Sparkles,
  Inbox,
  Clock,
  Loader2,
  Stethoscope,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type?: "scan" | "appointment" | "doctor" | "report" | "system";
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  link?: string;
  linkText?: string;
}

export default function DoctorNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "scan" | "appointment">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load doctor notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      setActionLoading(id);
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } finally {
      setActionLoading(null);
    }
  };

  const markAllRead = async () => {
    try {
      setActionLoading("all");
      await api.post("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } finally {
      setActionLoading(null);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      setActionLoading(id);
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      setActionLoading("clear");
      await api.delete("/notifications");
      setNotifications([]);
    } catch (err) {
      console.error(err);
      setNotifications([]);
    } finally {
      setActionLoading(null);
    }
  };

  const unreadCount = useMemo(() => notifications.filter((n) => !n.is_read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filterTab === "unread") return !n.is_read;
      if (filterTab === "scan") return n.type === "scan" || n.type === "report";
      if (filterTab === "appointment") return n.type === "appointment";
      return true;
    });
  }, [notifications, filterTab]);

  const getCategoryIcon = (type?: string) => {
    switch (type) {
      case "scan":
      case "report":
        return <Brain size={20} className="text-purple-600" />;
      case "appointment":
        return <Calendar size={20} className="text-blue-600" />;
      case "system":
        return <Stethoscope size={20} className="text-emerald-600" />;
      default:
        return <Bell size={20} className="text-indigo-600" />;
    }
  };

  const getCategoryBg = (type?: string) => {
    switch (type) {
      case "scan":
      case "report":
        return "bg-purple-50 border-purple-100";
      case "appointment":
        return "bg-blue-50 border-blue-100";
      case "system":
        return "bg-emerald-50 border-emerald-100";
      default:
        return "bg-indigo-50 border-indigo-100";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Doctor Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Patient consultations, appointment bookings, and pending AI diagnostic screenings
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={actionLoading === "all"}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 transition-all shadow-sm"
              >
                <CheckCheck size={15} />
                <span>Mark all read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                disabled={actionLoading === "clear"}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 font-semibold text-xs border border-gray-200 hover:border-rose-200 transition-all"
              >
                <Trash2 size={14} />
                <span>Clear all</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-gray-100">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === "all"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilterTab("unread")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === "unread"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilterTab("appointment")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === "appointment"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Patient Appointments
          </button>
          <button
            onClick={() => setFilterTab("scan")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === "scan"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Clinical Validations
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-sm">Loading clinic alerts...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <Inbox size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No alerts found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              You are all caught up with your clinical schedule and pending patient reviews.
            </p>
            <Link
              href="/doctor/appointments"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              <Calendar size={14} />
              <span>View Appointment Schedule</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredNotifications.map((n) => {
              const isUnread = !n.is_read;
              return (
                <div
                  key={n.id}
                  className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md ${
                    isUnread
                      ? "border-blue-200 ring-1 ring-blue-500/10 bg-gradient-to-r from-blue-50/20 to-white"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  {/* Left side: Icon + Content */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${getCategoryBg(
                        n.type
                      )}`}
                    >
                      {getCategoryIcon(n.type)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4
                          className={`font-bold text-sm leading-tight ${
                            isUnread ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {n.title}
                        </h4>
                        {isUnread && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                            New Alert
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-3 mt-2.5 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{formatISTDateTime(n.created_at)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Action Button & Controls */}
                  <div className="flex items-center gap-2.5 shrink-0 sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 justify-end">
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => {
                          if (isUnread) markAsRead(n.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-blue-600 text-xs font-semibold shadow-sm transition-all"
                      >
                        <span>{n.linkText || "View details"}</span>
                        <ArrowRight size={13} />
                      </Link>
                    )}

                    {isUnread && (
                      <button
                        type="button"
                        onClick={() => markAsRead(n.id)}
                        disabled={actionLoading === n.id}
                        title="Mark as read"
                        className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Check size={16} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteNotification(n.id)}
                      disabled={actionLoading === n.id}
                      title="Delete notification"
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
