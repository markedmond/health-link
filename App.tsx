/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import PatientProfiling from "./components/PatientProfiling";
import VaccinationLogs from "./components/VaccinationLogs";
import ServiceScheduling from "./components/ServiceScheduling";
import MedicineInventory from "./components/MedicineInventory";
import DOHReports from "./components/DOHReports";
import ActivityLogs from "./components/ActivityLogs";
import { LogOut, HelpCircle } from "lucide-react";

import { 
  User, 
  Patient, 
  VaccinationRecord, 
  TreatmentRecord, 
  MaternalHealthRecord, 
  ChildGrowthRecord, 
  NewbornScreeningRecord, 
  SMSLog, 
  MedicineStock, 
  AuditLog, 
  Appointment 
} from "./types";

import {
  initialPatients,
  initialVaccinations,
  initialTreatments,
  initialMaternalHealth,
  initialGrowthRecords,
  initialNewbornScreenings,
  initialSMSLogs,
  initialMedicines,
  initialAppointments,
  initialAuditLogs
} from "./data/mockData";

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  // Core Data Registries - syncing to localStorage
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [treatments, setTreatments] = useState<TreatmentRecord[]>([]);
  const [maternalRecords, setMaternalRecords] = useState<MaternalHealthRecord[]>([]);
  const [growthRecords, setGrowthRecords] = useState<ChildGrowthRecord[]>([]);
  const [newbornRecords, setNewbornRecords] = useState<NewbornScreeningRecord[]>([]);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([]);
  const [medicines, setMedicines] = useState<MedicineStock[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Load state on mount if it's there, else from mock baseline
  useEffect(() => {
    try {
      const cachedPatients = localStorage.getItem("junob_patients");
      const cachedVaccinations = localStorage.getItem("junob_vaccinations");
      const cachedTreatments = localStorage.getItem("junob_treatments");
      const cachedMaternal = localStorage.getItem("junob_maternal");
      const cachedGrowth = localStorage.getItem("junob_growth");
      const cachedNewborns = localStorage.getItem("junob_newborns");
      const cachedSMS = localStorage.getItem("junob_sms");
      const cachedMeds = localStorage.getItem("junob_meds");
      const cachedAppts = localStorage.getItem("junob_appts");
      const cachedAudits = localStorage.getItem("junob_audits");

      setPatients(cachedPatients ? JSON.parse(cachedPatients) : initialPatients);
      setVaccinations(cachedVaccinations ? JSON.parse(cachedVaccinations) : initialVaccinations);
      setTreatments(cachedTreatments ? JSON.parse(cachedTreatments) : initialTreatments);
      setMaternalRecords(cachedMaternal ? JSON.parse(cachedMaternal) : initialMaternalHealth);
      setGrowthRecords(cachedGrowth ? JSON.parse(cachedGrowth) : initialGrowthRecords);
      setNewbornRecords(cachedNewborns ? JSON.parse(cachedNewborns) : initialNewbornScreenings);
      setSmsLogs(cachedSMS ? JSON.parse(cachedSMS) : initialSMSLogs);
      setMedicines(cachedMeds ? JSON.parse(cachedMeds) : initialMedicines);
      setAppointments(cachedAppts ? JSON.parse(cachedAppts) : initialAppointments);
      setAuditLogs(cachedAudits ? JSON.parse(cachedAudits) : initialAuditLogs);
    } catch (e) {
      console.error("Local storage load failed, using default values", e);
    }
  }, []);

  // Save changes wrapper
  const saveToLocal = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Save to LocalStorage failed for ${key}`, err);
    }
  };

  // Helper dynamic audit logger
  const createAuditEvent = (action: string, details: string) => {
    if (!currentUser) return;
    const freshLog: AuditLog = {
      log_id: `AL-${Date.now()}`,
      user_name: currentUser.name,
      user_role: currentUser.role,
      action,
      details,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    const updatedAudits = [freshLog, ...auditLogs];
    setAuditLogs(updatedAudits);
    saveToLocal("junob_audits", updatedAudits);
  };

  // Mutations Handlers
  const handleAddPatient = (patient: Patient) => {
    const updatedList = [patient, ...patients];
    setPatients(updatedList);
    saveToLocal("junob_patients", updatedList);
    createAuditEvent("Register Patient", `Registered new patient profile for ${patient.first_name} ${patient.last_name} with FSN ${patient.family_serial_number}.`);
  };

  const handleUpdatePatient = (patient: Patient) => {
    const updatedList = patients.map((p) => p.patient_id === patient.patient_id ? patient : p);
    setPatients(updatedList);
    saveToLocal("junob_patients", updatedList);
    createAuditEvent("Update Patient Record", `Updated personal profile of ${patient.first_name} ${patient.last_name}`);
  };

  const handleAddVaccination = (vRecord: VaccinationRecord) => {
    const updatedList = [vRecord, ...vaccinations];
    setVaccinations(updatedList);
    saveToLocal("junob_vaccinations", updatedList);
    
    // Also auto update patient's overall vaccination coverage status if fully/partially immunised
    const associatedPatient = patients.find(p => p.patient_id === vRecord.patient_id);
    if (associatedPatient) {
      let nextStatus = associatedPatient.vaccination_status;
      if (vRecord.dose_number === "Booster" || vRecord.dose_number === "2nd Dose" || vRecord.vaccine_name === "Johnson & Johnson") {
        nextStatus = "Fully Vaccinated";
      } else if (vRecord.dose_number === "1st Dose") {
        nextStatus = "Partially Vaccinated";
      }
      
      if (nextStatus !== associatedPatient.vaccination_status) {
        setPatients(prev => {
          const updated = prev.map(p => p.patient_id === associatedPatient.patient_id ? { ...p, vaccination_status: nextStatus } : p);
          saveToLocal("junob_patients", updated);
          return updated;
        });
      }
    }

    createAuditEvent("Record Vaccination", `Logged dose of ${vRecord.vaccine_name} for patient ${vRecord.patient_name}`);
  };

  const handleAddGrowth = (gRecord: ChildGrowthRecord) => {
    const updatedList = [gRecord, ...growthRecords];
    setGrowthRecords(updatedList);
    saveToLocal("junob_growth", updatedList);
    createAuditEvent("Add Growth Record", `Logged WHO weight and height for ${gRecord.patient_name}. Classified as ${gRecord.nutritional_status}.`);
  };

  const handleAddMaternal = (mRecord: MaternalHealthRecord) => {
    const updatedList = [mRecord, ...maternalRecords];
    setMaternalRecords(updatedList);
    saveToLocal("junob_maternal", updatedList);
    createAuditEvent("Enroll Pregnancy", `Enrolled mother ${mRecord.patient_name} in prenatal care (Expected Delivery: ${mRecord.expected_delivery_date})`);
  };

  const handleUpdateMaternal = (mRecord: MaternalHealthRecord) => {
    const updatedList = maternalRecords.map(m => m.maternal_id === mRecord.maternal_id ? mRecord : m);
    setMaternalRecords(updatedList);
    saveToLocal("junob_maternal", updatedList);
    createAuditEvent("Update Prenatal Record", `Updated postpartum status or deliver marks for ${mRecord.patient_name}`);
  };

  const handleAddNewborn = (nRecord: NewbornScreeningRecord) => {
    const updatedList = [nRecord, ...newbornRecords];
    setNewbornRecords(updatedList);
    saveToLocal("junob_newborns", updatedList);
    createAuditEvent("Add Newborn Screening", `Logged screening compliance profile for ${nRecord.patient_name}`);
  };

  const handleUpdateNewborn = (nRecord: NewbornScreeningRecord) => {
    const updatedList = newbornRecords.map(n => n.screening_id === nRecord.screening_id ? nRecord : n);
    setNewbornRecords(updatedList);
    saveToLocal("junob_newborns", updatedList);
    createAuditEvent("Update Newborn Screening", `Completed newborn screening compliance confirmation for ${nRecord.patient_name}`);
  };

  const handleAddTreatment = (tRecord: TreatmentRecord) => {
    const updatedList = [tRecord, ...treatments];
    setTreatments(updatedList);
    saveToLocal("junob_treatments", updatedList);
    createAuditEvent("Enroll TB Treatment", `Enrolled ${tRecord.patient_name} in long-term treatment`);
  };

  const handleUpdateTreatment = (tRecord: TreatmentRecord) => {
    const updatedList = treatments.map(t => t.treatment_id === tRecord.treatment_id ? tRecord : t);
    setTreatments(updatedList);
    saveToLocal("junob_treatments", updatedList);
    createAuditEvent("Update TB Treatment", `Updated followup and visit status for ${tRecord.patient_name}`);
  };

  const handleSendSMS = (log: SMSLog) => {
    const updatedList = [log, ...smsLogs];
    setSmsLogs(updatedList);
    saveToLocal("junob_sms", updatedList);
  };

  const handleUpdateStock = (medId: string, newQty: number) => {
    const updatedList = medicines.map(m => m.medicine_id === medId ? { ...m, current_stock: newQty } : m);
    setMedicines(updatedList);
    saveToLocal("junob_meds", updatedList);
  };

  const handleAddStockLog = (desc: string) => {
    createAuditEvent("Pharmacy Stock Adjustment", desc);
  };

  const handleAddAppointment = (appt: Appointment) => {
    const updatedList = [appt, ...appointments];
    setAppointments(updatedList);
    saveToLocal("junob_appts", updatedList);
    createAuditEvent("Schedule Appointment", `Scheduled ${appt.service_type} consult for ${appt.patient_name} on ${appt.scheduled_date}`);
  };

  const handleUpdateAppointmentStatus = (id: string, status: "Scheduled" | "Completed" | "No Show") => {
    const updatedList = appointments.map(a => a.appointment_id === id ? { ...a, status } : a);
    setAppointments(updatedList);
    saveToLocal("junob_appts", updatedList);
    
    const target = appointments.find(a => a.appointment_id === id);
    createAuditEvent("Update Appointment", `Marked ${target?.patient_name} schedule status as ${status}`);
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    saveToLocal("junob_audits", []);
    createAuditEvent("Archive Admin Trail", "Archived history checklist registry.");
  };

  // Login handler
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    // Log successful entrance
    const freshLog: AuditLog = {
      log_id: `AL-${Date.now()}`,
      user_name: user.name,
      user_role: user.role,
      action: "System Access",
      details: "Staff logged into workstation successfully.",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    setAuditLogs(prev => {
      const next = [freshLog, ...prev];
      saveToLocal("junob_audits", next);
      return next;
    });
  };

  const handleLogout = () => {
    if (currentUser) {
      createAuditEvent("System Lock", "Staff closed session on workstation.");
    }
    setCurrentUser(null);
    setActiveTab("dashboard");
    setShowLogoutConfirm(false);
  };

  // Helper trigger to swap forms directly
  const [quickRegisterTrigger, setQuickRegisterTrigger] = useState(0);
  const [quickVaccinationTrigger, setQuickVaccinationTrigger] = useState(0);

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render correct tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            patients={patients}
            vaccinations={vaccinations}
            medicines={medicines}
            appointments={appointments}
            newborns={newbornRecords}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenQuickRegister={() => {
              setActiveTab("profiling");
              // Wait for component to render, then open modal
              setTimeout(() => {
                const btn = document.getElementById("btn_open_register");
                if (btn) btn.click();
              }, 100);
            }}
            onOpenQuickVaccinate={() => {
              setActiveTab("vaccination");
              setTimeout(() => {
                const btn = document.getElementById("btn_log_vaccination_open");
                if (btn) btn.click();
              }, 100);
            }}
          />
        );
      case "profiling":
        return (
          <PatientProfiling
            currentUser={currentUser}
            patients={patients}
            growthRecords={growthRecords}
            maternalRecords={maternalRecords}
            newbornRecords={newbornRecords}
            vaccinations={vaccinations}
            treatments={treatments}
            onAddPatient={handleAddPatient}
            onUpdatePatient={handleUpdatePatient}
            onAddGrowth={handleAddGrowth}
            onAddMaternal={handleAddMaternal}
            onUpdateMaternal={handleUpdateMaternal}
            onAddNewborn={handleAddNewborn}
            onUpdateNewborn={handleUpdateNewborn}
            onAddTreatment={handleAddTreatment}
            onUpdateTreatment={handleUpdateTreatment}
          />
        );
      case "vaccination":
        return (
          <VaccinationLogs
            currentUser={currentUser}
            patients={patients}
            vaccinations={vaccinations}
            onAddVaccination={handleAddVaccination}
          />
        );
      case "scheduling":
        return (
          <ServiceScheduling
            currentUser={currentUser}
            patients={patients}
            appointments={appointments}
            smsLogs={smsLogs}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onSendSMS={handleSendSMS}
          />
        );
      case "inventory":
        return (
          <MedicineInventory
            currentUser={currentUser}
            medicines={medicines}
            onUpdateStock={handleUpdateStock}
            onAddStockLog={handleAddStockLog}
          />
        );
      case "reports":
        return (
          <DOHReports
            patients={patients}
            vaccinations={vaccinations}
            maternalRecords={maternalRecords}
            treatments={treatments}
          />
        );
      case "activity_log":
        return (
          <ActivityLogs
            currentUser={currentUser}
            auditLogs={auditLogs}
            onClearLogs={handleClearAuditLogs}
          />
        );
      default:
        return <div className="text-white text-xs">Tab Under Maintenance</div>;
    }
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case "dashboard":
        return { title: "Dashboard", desc: "Overview & stats" };
      case "profiling":
        return { title: "Patient Records", desc: "Citizen registry" };
      case "vaccination":
        return { title: "Vaccination Logs", desc: "Dose tracking" };
      case "scheduling":
        return { title: "Service Scheduler", desc: "Book health visits" };
      case "inventory":
        return { title: "Medicine Stock", desc: "Barangay pharmacy tracking" };
      case "reports":
        return { title: "Reports", desc: "Analytics & exports" };
      case "activity_log":
        return { title: "Security Audit Logs", desc: "Action trails & logs" };
      default:
        return { title: "Barangay Health", desc: "Citizen Care Portal" };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex h-screen bg-slate-50 font-sans" id="app_frame">
      {/* Sidebar Navigation Panel wrapper */}
      <Navigation
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      {/* Primary Workspace View container */}
      <main className="flex-1 flex flex-col bg-slate-100 overflow-hidden" id="workspace_viewport">
        {/* Workspace Top bar info index */}
        <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white shrink-0 text-slate-800 relative z-20">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <span className="text-[#202124] font-bold">{headerInfo.title}</span>
            <span className="text-slate-400 font-normal">·</span>
            <span className="text-slate-500 font-normal text-xs">{headerInfo.desc}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>June 21, 2026</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#34A853] animate-pulse" />
              <span className="text-[#34A853] font-bold">System Online</span>
            </div>
          </div>
        </header>

        {/* Tab view layout port */}
        <div className="flex-1 p-6 overflow-hidden">
          {renderTabContent()}
        </div>
      </main>

      {/* Aesthetic styled Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="logout_confirm_modal">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 max-w-[380px] w-full shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-[#1E293B] font-sans">
                  Are you sure you want to log out?
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans mt-0.5">
                  This will secure your active workstation session. You will need your passkey to sign in again.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                id="btn_cancel_logout"
              >
                Keep Session
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 h-9 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-rose-600/10 transition-all cursor-pointer"
                id="btn_confirm_logout"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
