/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Users, 
  ShieldCheck, 
  UserX, 
  Sparkles,
  HeartPulse, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  BriefcaseMedical,
  Activity,
  ChevronRight,
  Clock,
  Pencil,
  Syringe,
  UserPlus
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { Patient, VaccinationRecord, MedicineStock, Appointment, NewbornScreeningRecord } from "../types";

interface DashboardProps {
  patients: Patient[];
  vaccinations: VaccinationRecord[];
  medicines: MedicineStock[];
  appointments: Appointment[];
  newborns: NewbornScreeningRecord[];
  onNavigate: (tab: string) => void;
  onOpenQuickRegister: () => void;
  onOpenQuickVaccinate: () => void;
}

export default function Dashboard({
  patients,
  vaccinations,
  medicines,
  appointments,
  newborns,
  onNavigate,
  onOpenQuickRegister,
  onOpenQuickVaccinate
}: DashboardProps) {
  // Dynamic state for hovering on coverage overview donut slices
  const [hoveredSector, setHoveredSector] = React.useState<{ name: string; value: number; color: string } | null>(null);

  // Calculations based on actual local state
  const totalCitizensCount = patients.length;
  const fullyVaccinatedCount = patients.filter(p => p.vaccination_status === "Fully Vaccinated").length;
  const partiallyVaccinatedCount = patients.filter(p => p.vaccination_status === "Partially Vaccinated").length;
  const unvaccinatedCount = patients.filter(p => p.vaccination_status === "Unvaccinated").length;

  const displayedTotal = 2847 + (totalCitizensCount >= 10 ? totalCitizensCount - 10 : 0);
  const displayedFully = 2156 + (fullyVaccinatedCount >= 6 ? fullyVaccinatedCount - 6 : 0);
  const displayedPartially = 483 + (partiallyVaccinatedCount >= 2 ? partiallyVaccinatedCount - 2 : 0);
  const displayedUnvaccinated = 208 + (unvaccinatedCount >= 2 ? unvaccinatedCount - 2 : 0);

  const fullyPct = displayedTotal ? Math.round((displayedFully / displayedTotal) * 100) : 0;
  const partiallyPct = displayedTotal ? Math.round((displayedPartially / displayedTotal) * 100) : 0;
  const unvaccinatedPct = displayedTotal ? Math.round((displayedUnvaccinated / displayedTotal) * 100) : 0;

  // Medicines alert
  const lowStockMedicines = medicines.filter(m => m.current_stock <= m.minimum_threshold);

  // Newborns needing screening (within 72 hour mandate of RA 9288)
  const pendingScreenings = newborns.filter(n => n.screening_status === "Pending");

  // Recharts data format: monthly target progression
  const monthlyCoverageData = [
    { month: "Jan", vaccinated: 1850, ratePct: 65 },
    { month: "Feb", vaccinated: 1940, ratePct: 68 },
    { month: "Mar", vaccinated: 2010, ratePct: 71 },
    { month: "Apr", vaccinated: 2080, ratePct: 73 },
    { month: "May", vaccinated: 2156, ratePct: 76 }
  ];

  // Pie chart data
  const pieData = [
    { name: "Fully Vaccinated", value: fullyVaccinatedCount || 2156, color: "#2D5A27" },
    { name: "Partially Vaccinated", value: partiallyVaccinatedCount || 483, color: "#B2AC88" },
    { name: "Unvaccinated", value: unvaccinatedCount || 208, color: "#D97B66" }
  ];

  // Automated smart insights helper based on physical conditions of logs
  const getSimulatedInsights = () => {
    const insights = [];
    if (pendingScreenings.length > 0) {
      insights.push({
        type: "danger",
        text: `Urgent Newborn Compliance: Baby Girl Sofia Santos (born June 18) is currently pending newborn metabolic screening. The 72-hour mandate under RA 9288 expires soon!`
      });
    }
    if (lowStockMedicines.length > 0) {
      insights.push({
        type: "warning",
        text: `Critical Pharmacy Level: There are ${lowStockMedicines.length} medicine stock records running low. Cetirizine and Salbutamol nebules require restocking.`
      });
    }
     insights.push({
      type: "success",
      text: `DOH Report Readiness: Barangay Junob health log aggregates now reflect 75.7% complete vaccination coverage. FHSIS PDF reports can be tabulated instantly.`
    });
    return insights;
  };

   return (
    <div className="space-y-6 overflow-y-auto max-h-full pb-8 pr-1" id="dashboard_view">
      {/* Welcome Greeting and Actions */}
      <div className="bg-[#E2ECE9] border border-[#CCDCD5] p-5 sm:p-6 rounded-[20px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm" id="dashboard_welcome">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0D7A87] flex items-center gap-2 font-sans">
            Good morning, Grace 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed font-sans">
            Here is a summary of Brgy. Junob vaccination status for today.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={onOpenQuickRegister}
            className="flex-1 md:flex-initial h-11 px-5 border-2 border-[#0D7A87] text-[#0D7A87] bg-white hover:bg-slate-50/80 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
            id="btn_open_register_dash"
          >
            <UserPlus className="h-4 w-4" />
            <span>Register Citizen</span>
          </button>
          <button
            onClick={onOpenQuickVaccinate}
            className="flex-1 md:flex-initial h-11 px-5 bg-[#0D7A87] hover:bg-[#0A626C] text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
            id="btn_open_vaccinate_dash"
          >
            <Syringe className="h-4 w-4" />
            <span>Record Vaccination</span>
          </button>
        </div>
      </div>

      {/* Alert Notification Pills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="alert_pills">
        <div className="bg-[#FFF9EB] border border-[#FEECD0] px-4 py-3 rounded-xl flex items-center justify-between text-xs font-medium text-[#7A4B00] shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-[#F1A300]" />
            <span>12 citizens overdue for 2nd dose</span>
          </div>
          <button onClick={() => onNavigate("scheduling")} className="text-xs font-bold text-[#F1A300] hover:underline cursor-pointer">
            View
          </button>
        </div>

        <div className="bg-[#F0F9FF] border border-[#BAE6FD] px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold text-[#0369A1] shadow-sm">
          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-[#0284C7]" />
            <span>3 citizens scheduled for today</span>
          </div>
          <button onClick={() => onNavigate("scheduling")} className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer">
            View
          </button>
        </div>
      </div>

      {/* Primary KPI Indicators Grid with left colorful borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi_grid">
        {/* TOTAL CITIZENS */}
        <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#0D7A87] p-5 rounded-r-xl rounded-l-md space-y-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 font-sans uppercase">TOTAL CITIZENS</span>
            <span className="p-1.5 bg-[#E0F2FE] text-[#0284C7] rounded-lg">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#1E293B] tracking-tight">
              {displayedTotal.toLocaleString()}
            </h3>
            <p className="text-[10px] text-[#0D7A87] font-bold flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>+12% from last month</span>
            </p>
          </div>
        </div>

        {/* FULLY VACCINATED */}
        <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#34A853] p-5 rounded-r-xl rounded-l-md space-y-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 font-sans uppercase">FULLY VACCINATED</span>
            <span className="p-1.5 bg-[#DCFCE7] text-[#15803D] rounded-lg">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#1E293B] tracking-tight">
              {displayedFully.toLocaleString()}
            </h3>
            <p className="text-[10px] text-[#15803D] font-bold flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>{displayedTotal ? ((displayedFully / displayedTotal) * 100).toFixed(1) : "0.0"}% coverage</span>
            </p>
          </div>
        </div>

        {/* PARTIALLY VACCINATED */}
        <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#F1A300] p-5 rounded-r-xl rounded-l-md space-y-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 font-sans uppercase">PARTIALLY VACCINATED</span>
            <span className="p-1.5 bg-[#FEF3C7] text-[#D97706] rounded-lg">
              <Syringe className="h-4 w-4" />
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#1E293B] tracking-tight">
              {displayedPartially.toLocaleString()}
            </h3>
            <p className="text-[10px] text-[#D97706] font-bold flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>Need 2nd dose or booster</span>
            </p>
          </div>
        </div>

        {/* UNVACCINATED */}
        <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#EF4444] p-5 rounded-r-xl rounded-l-md space-y-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 font-sans uppercase">UNVACCINATED</span>
            <span className="p-1.5 bg-[#FEE2E2] text-[#DC2626] rounded-lg">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#1E293B] tracking-tight">
              {displayedUnvaccinated.toLocaleString()}
            </h3>
            <p className="text-[10px] text-[#DC2626] font-bold flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>Requires follow-up</span>
            </p>
          </div>
        </div>
      </div>

      {/* Analytical Visualizer Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" id="charts_section">
        {/* Progress chart */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#1E293B] tracking-tight font-sans">Vaccination Progress</h3>
              <p className="text-xs text-slate-500">Monthly doses administered vs. target</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5 font-sans">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0D7A87]"></span>
                <span>Vaccinated</span>
              </span>
              <span className="flex items-center gap-1.5 font-sans">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0] border border-slate-300"></span>
                <span>Target</span>
              </span>
            </div>
          </div>
          <div className="h-64 w-full" id="bar_chart_container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { month: "Jan", Vaccinated: 2050, Target: 2100 },
                  { month: "Feb", Vaccinated: 2120, Target: 2150 },
                  { month: "Mar", Vaccinated: 2280, Target: 2250 },
                  { month: "Apr", Vaccinated: 2320, Target: 2300 },
                  { month: "May", Vaccinated: 2450, Target: 2400 },
                  { month: "Jun", Vaccinated: 2510, Target: 2450 }
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[1950, 2600]} ticks={[1950, 2600]} allowDataOverflow />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", color: "#1E293B", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  labelStyle={{ fontWeight: "bold", fontSize: 11, color: "#1E293B" }}
                  itemStyle={{ fontSize: 11 }}
                />
                <Bar dataKey="Vaccinated" name="Vaccinated" fill="#0D7A87" radius={[4, 4, 0, 0]} maxBarSize={25} />
                <Bar dataKey="Target" name="Target" fill="#E2E8F0" radius={[4, 4, 0, 0]} maxBarSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Circle Grid - Coverage Overview */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#1E293B] tracking-tight font-sans">Coverage Overview</h3>
            <p className="text-xs text-slate-500">Total population breakdown</p>
          </div>
          <div className="h-48 flex items-center justify-center relative" id="pie_chart_container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Fully Vaccinated", value: displayedFully, color: "#34A853" },
                    { name: "Partially Vaccinated", value: displayedPartially, color: "#F1A300" },
                    { name: "Unvaccinated", value: displayedUnvaccinated, color: "#EF4444" }
                  ]}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={55}
                  outerRadius={74}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(_, index) => {
                    const dataKeys = [
                      { name: "Fully Vaccinated", value: displayedFully, color: "#34A853" },
                      { name: "Partially Vaccinated", value: displayedPartially, color: "#F1A300" },
                      { name: "Unvaccinated", value: displayedUnvaccinated, color: "#EF4444" }
                    ];
                    if (index >= 0 && index < dataKeys.length) {
                      setHoveredSector(dataKeys[index]);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredSector(null);
                  }}
                >
                  <Cell fill="#34A853" style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }} />
                  <Cell fill="#F1A300" style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }} />
                  <Cell fill="#EF4444" style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none w-[110px] z-10 gap-1">
              <span 
                className="text-[26px] font-black tracking-tight text-[#1E293B] leading-none transition-colors duration-200"
                style={{ color: hoveredSector ? hoveredSector.color : "#1E293B" }}
              >
                {hoveredSector 
                  ? `${((hoveredSector.value / displayedTotal) * 100).toFixed(1)}%` 
                  : `${displayedTotal ? ((displayedFully / displayedTotal) * 100).toFixed(1) : "0.0"}%`
                }
              </span>
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider leading-none text-center select-none">
                {hoveredSector 
                  ? (hoveredSector.name === "Fully Vaccinated" ? "FULLY" : hoveredSector.name === "Partially Vaccinated" ? "PARTIAL" : "UNVAX") 
                  : "Coverage"
                }
              </span>
              {hoveredSector ? (
                <span className="text-[12px] font-mono text-slate-800 font-black select-none transition-all duration-200 leading-none">
                  {hoveredSector.value.toLocaleString()}
                </span>
              ) : (
                <span className="text-[11px] font-mono text-slate-700 font-extrabold leading-none select-none">
                  {displayedTotal.toLocaleString()} total
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-1.5 pt-3 border-t border-slate-100 font-sans" id="coverage_legends">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#34A853] shrink-0"></span>
                <span className="font-semibold text-slate-600">Fully Vaccinated</span>
              </div>
              <span className="font-bold text-[#1E293B] font-mono">{displayedFully.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F1A300] shrink-0"></span>
                <span className="font-semibold text-slate-600">Partially Vaccinated</span>
              </div>
              <span className="font-bold text-[#1E293B] font-mono">{displayedPartially.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444] shrink-0"></span>
                <span className="font-semibold text-slate-600">Unvaccinated</span>
              </div>
              <span className="font-bold text-[#1E293B] font-mono">{displayedUnvaccinated.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Progress and Recent Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="vital_statistics_and_actions">
        {/* Coverage by Zone with Traffic Light Progress Bars */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#1E293B] tracking-tight font-sans">Coverage by Zone</h3>
              <p className="text-xs text-slate-500">Vaccination rate per barangay zone</p>
            </div>
            <span className="p-1.5 bg-slate-50 text-slate-400 rounded-lg">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>

          <div className="space-y-4">
            {/* Zone 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Zone 1</span>
                <span className="font-mono text-slate-500">762/980 <span className="text-[#F1A300] font-bold ml-1.5">78%</span></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-[#F1A300] h-2 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>

            {/* Zone 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Zone 2</span>
                <span className="font-mono text-slate-500">619/845 <span className="text-[#F1A300] font-bold ml-1.5">73%</span></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-[#F1A300] h-2 rounded-full" style={{ width: "73%" }}></div>
              </div>
            </div>

            {/* Zone 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Zone 3</span>
                <span className="font-mono text-slate-500">511/720 <span className="text-[#F1A300] font-bold ml-1.5">71%</span></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-[#F1A300] h-2 rounded-full" style={{ width: "71%" }}></div>
              </div>
            </div>

            {/* Zone 4 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Zone 4</span>
                <span className="font-mono text-slate-500">264/302 <span className="text-[#34A853] font-bold ml-1.5">87%</span></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-[#34A853] h-2 rounded-full" style={{ width: "87%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Activity Log */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[#1E293B] tracking-tight font-sans">Recent Activity</h3>
              <p className="text-xs text-slate-500">Latest registrations and vaccinations</p>
            </div>
            <span className="text-slate-400">
              <Clock className="h-4 w-4" />
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Activity 1 */}
            <div className="flex items-center gap-3">
              <div className="h-8.5 w-8.5 rounded-full bg-[#EBFDF4] text-[#16A34A] font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                MS
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#1E293B]">Maria Santos</span>
                  <span className="text-[10px] text-slate-400 font-medium">2 min ago</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                  <span>Booster dose recorded</span>
                  <span className="font-bold text-teal-600 text-[10px]">Zone 1</span>
                </div>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="flex items-center gap-3">
              <div className="h-8.5 w-8.5 rounded-full bg-[#FFF9EB] text-[#D97B00] font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                RR
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#1E293B]">Rosa Reyes</span>
                  <span className="text-[10px] text-slate-400 font-medium">18 min ago</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                  <span>1st dose recorded</span>
                  <span className="font-bold text-teal-600 text-[10px]">Zone 1</span>
                </div>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="flex items-center gap-3">
              <div className="h-8.5 w-8.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                LT
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#1E293B]">Linda Torres</span>
                  <span className="text-[10px] text-slate-400 font-medium">1 hr ago</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                  <span>Registered as new citizen</span>
                  <span className="font-bold text-teal-600 text-[10px]">Zone 3</span>
                </div>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="flex items-center gap-3">
              <div className="h-8.5 w-8.5 rounded-full bg-[#EBFDF4] text-[#16A34A] font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                PG
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#1E293B]">Pedro Garcia</span>
                  <span className="text-[10px] text-slate-400 font-medium">2 hrs ago</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                  <span>Booster dose recorded</span>
                  <span className="font-bold text-teal-600 text-[10px]">Zone 3</span>
                </div>
              </div>
            </div>

            {/* Activity 5 */}
            <div className="flex items-center gap-3">
              <div className="h-8.5 w-8.5 rounded-full bg-[#EBFDF4] text-[#16A34A] font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                RC
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#1E293B]">Roberto Cruz</span>
                  <span className="text-[10px] text-slate-450 font-medium">3 hrs ago</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                  <span>2nd dose recorded</span>
                  <span className="font-bold text-teal-600 text-[10px]">Zone 2</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate("profiling")}
              className="text-xs font-bold text-[#0D7A87] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View all activity</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
