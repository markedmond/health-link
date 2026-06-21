/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Users, 
  LayoutGrid, 
  Calendar, 
  HeartPulse, 
  Syringe, 
  BarChart3, 
  LogOut, 
  Shield, 
  CheckCircle2,
  ChevronRight,
  Wifi
} from "lucide-react";
import { User } from "../types";

interface NavigationProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Navigation({ currentUser, activeTab, setActiveTab, onLogout }: NavigationProps) {
  const menuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      description: "Overview & stats", 
      icon: LayoutGrid, 
      roles: ["Admin", "Doctor", "Nurse", "Midwife"] 
    },
    { 
      id: "profiling", 
      label: "Patient Records", 
      description: "Citizen registry", 
      icon: Users, 
      roles: ["Admin", "Doctor", "Nurse", "Midwife"] 
    },
    { 
      id: "vaccination", 
      label: "Vaccination Logs", 
      description: "Dose tracking", 
      icon: Syringe, 
      roles: ["Admin", "Doctor", "Nurse", "Midwife"] 
    },
    { 
      id: "reports", 
      label: "Reports", 
      description: "Analytics & exports", 
      icon: BarChart3, 
      roles: ["Admin", "Doctor", "Midwife", "Nurse"] 
    },
    { 
      id: "inventory", 
      label: "Medicine Stock", 
      description: "Pharmacy inventory", 
      icon: HeartPulse, 
      roles: ["Admin", "Doctor", "Nurse", "Midwife"] 
    },
    { 
      id: "activity_log", 
      label: "Security Logs", 
      description: "Audit trail & logs", 
      icon: Shield, 
      roles: ["Admin", "Doctor"] 
    },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-[#0B7886] border-r border-[#09626C] flex flex-col shrink-0 text-white select-none" id="sidebar_container">
      {/* Station Branding banner */}
      <div className="p-5 border-b border-[#09626C] bg-black/10 flex items-center gap-3">
        <div className="h-10 w-10 bg-white/10 text-white rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
          <Syringe className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight text-white leading-tight font-sans">HealthLink</h2>
          <span className="text-[10px] text-teal-100/70 font-sans tracking-wider block font-medium">Barangay Health System</span>
        </div>
      </div>

      {/* Location block */}
      <div className="p-4 border-b border-[#09626C]/60 space-y-1 bg-black/5">
        <span className="text-[10px] font-bold text-teal-100/50 tracking-widest block font-sans">Location</span>
        <h3 className="text-sm font-bold text-white leading-tight">Brgy. Junob</h3>
        <p className="text-[11px] text-teal-100/60 leading-tight">Dumaguete City, Negros Oriental</p>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-bold text-teal-100/50 px-3 tracking-widest mt-1 mb-2 font-sans">
          Navigation
        </div>
        {visibleItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left flex items-start gap-3 py-2.5 px-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white text-[#0B7886] shadow-md border border-slate-100"
                  : "text-teal-100/85 hover:bg-white/10 hover:text-white"
              }`}
              id={`nav_btn_${item.id}`}
            >
              <IconComponent className={`h-5 w-5 shrink-0 mt-0.5 ${isActive ? "text-[#0B7886]" : "text-teal-200/75"}`} />
              <div className="min-w-0 flex-1">
                <span className={`text-xs font-bold block leading-tight ${isActive ? "text-[#1E293B]" : "text-white"}`}>
                  {item.label}
                </span>
                <span className={`text-[10px] block font-medium leading-snug mt-0.5 truncate ${isActive ? "text-slate-500" : "text-teal-150"}`}>
                  {item.description}
                </span>
              </div>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 self-center" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Sync and Logout */}
      <div className="p-4 border-t border-[#09626C] space-y-3 bg-black/10">
        {/* Sync Status Pill at bottom */}
        <div className="bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-1.5 font-sans">
          <div className="flex items-center gap-1.5 text-xs text-white font-medium">
            <Wifi className="h-3.5 w-3.5 text-teal-200" />
            <span className="text-[11px] font-medium">Connected · Synced just now</span>
          </div>
        </div>

        {/* Profile/Doctor Section */}
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="h-8 w-8 rounded-full bg-white/20 border border-white/20 font-bold text-xs text-yellow-300 flex items-center justify-center shadow-sm uppercase shrink-0">
            GL
          </div>
          <div className="min-w-0 flex-grow">
            <span className="text-xs font-bold text-white block leading-tight">Grace Lopez, RN</span>
            <span className="text-[10px] text-teal-100/70 block leading-tight mt-0.5">Barangay Nurse</span>
          </div>
          <button
            onClick={onLogout}
            title="Lock Workstation"
            className="p-1.5 hover:bg-rose-500/10 hover:text-rose-200 text-teal-100 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 mt-0.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
