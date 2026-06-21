/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, Plus, X, Calendar, Database, ShieldCheck, Download, AlertCircle } from "lucide-react";
import { VaccinationRecord, Patient, User } from "../types";

interface VaccinationLogsProps {
  currentUser: User;
  patients: Patient[];
  vaccinations: VaccinationRecord[];
  onAddVaccination: (record: VaccinationRecord) => void;
}

export default function VaccinationLogs({
  currentUser,
  patients,
  vaccinations,
  onAddVaccination
}: VaccinationLogsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLogFormOpen, setIsLogFormOpen] = useState(false);
  const [patientQuery, setPatientQuery] = useState("");
  const [showComboboxDropdown, setShowComboboxDropdown] = useState(false);

  useEffect(() => {
    if (!isLogFormOpen) {
      setPatientQuery("");
      setShowComboboxDropdown(false);
    }
  }, [isLogFormOpen]);

  // Form states for new vaccination
  const [newLog, setNewLog] = useState({
    patient_id: "",
    vaccine_name: "Pfizer-BioNTech",
    dose_number: "Booster" as "1st Dose" | "2nd Dose" | "3rd Dose" | "Booster" | "N/A",
    date_administered: "2026-06-20",
    batch_number: "",
    remarks: ""
  });

  const [formError, setFormError] = useState("");

  // Filtration
  const filteredLogs = vaccinations.filter((log) => {
    const s_lower = searchTerm.toLowerCase();
    return (
      log.patient_name.toLowerCase().includes(s_lower) ||
      log.vaccination_id.toLowerCase().includes(s_lower) ||
      log.patient_id.includes(s_lower) ||
      log.vaccine_name.toLowerCase().includes(s_lower)
    );
  });

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.patient_id || !newLog.batch_number) {
      setFormError("Please select a registered patient and type the vaccine batch number.");
      return;
    }

    const selectedPatientRec = patients.find(p => p.patient_id === newLog.patient_id);
    if (!selectedPatientRec) {
      setFormError("Selected patient record not found.");
      return;
    }

    // Auto-schedule next dose date based on rules: e.g. Pfizer/Moderna 2nd dose +21 or +28 days.
    // Booster gets next checkup in 6 months (+180 days)
    const adminDateStr = newLog.date_administered || "2026-06-20";
    const adminDate = new Date(adminDateStr);
    let nextDays = 30; // default 30 days
    if (newLog.dose_number === "Booster") {
      nextDays = 180;
    } else if (newLog.dose_number === "1st Dose") {
      nextDays = 28;
    } else if (newLog.dose_number === "2nd Dose") {
      nextDays = 120; // booster spacing
    }

    const nextScheduleDate = new Date(adminDate);
    nextScheduleDate.setDate(nextScheduleDate.getDate() + nextDays);

    const logId = `V${String(vaccinations.length + 1).padStart(3, "0")}`;

    const freshRecord: VaccinationRecord = {
      vaccination_id: logId,
      patient_id: selectedPatientRec.patient_id,
      patient_name: `${selectedPatientRec.first_name} ${selectedPatientRec.last_name}`,
      vaccine_name: newLog.vaccine_name,
      vaccine_type: selectedPatientRec.date_of_birth.startsWith("2026") ? "Routine Infant" : "General Population",
      date_administered: adminDateStr,
      next_schedule_date: nextScheduleDate.toISOString().split("T")[0],
      dose_number: newLog.dose_number,
      administered_by: currentUser.name,
      batch_number: newLog.batch_number,
      remarks: newLog.remarks || "Dose was administered successfully and registered in offline logs."
    };

    onAddVaccination(freshRecord);
    setIsLogFormOpen(false);
    // Reset form
    setNewLog({
      patient_id: "",
      vaccine_name: "Pfizer-BioNTech",
      dose_number: "Booster",
      date_administered: "2026-06-20",
      batch_number: "",
      remarks: ""
    });
    setFormError("");
  };

  return (
    <div className="space-y-4 max-h-full overflow-y-auto pb-8 pr-1" id="vaccination_view">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-[#E2E8F0] rounded-xl shadow-xs" id="vaccination_header">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[#1E293B] tracking-tight font-sans">Vaccination Administrations Logbook</h2>
          <p className="text-xs text-slate-500 font-medium font-sans">Log routine childhood vaccines or general populace booster shots</p>
        </div>

        <button
          onClick={() => setIsLogFormOpen(true)}
          className="bg-[#0B7886] hover:bg-[#09626C] border-none px-4 py-2.5 text-xs font-bold rounded-lg text-white flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
          id="btn_log_vaccination_open"
        >
          <Plus className="h-4 w-4" />
          <span>Record New Vaccination</span>
        </button>
      </div>

      {/* Filter panel */}
      <div className="relative flex items-center">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none z-10 shrink-0">
          <Search className="h-[18px] w-[18px] min-w-[18px] min-h-[18px]" />
        </span>
        <input
          type="text"
          placeholder="Search vaccinations by patient name, Log ID, or vaccine brand (e.g. Pfizer, Moderna, BCG)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white text-slate-800 border border-[#E2E8F0] rounded-xl pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] transition-all font-mono shadow-xs placeholder-slate-400"
          style={{ paddingLeft: "2.75rem" }}
          id="vaccination_search_input"
        />
      </div>

      {/* Table log view */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-x-auto shadow-sm" id="vaccination_table_view">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0B7886] text-white font-bold text-[10px] tracking-wider font-sans border-b border-[#09626C]">
              <th className="py-3.5 px-4 font-bold text-center w-20">Log ID</th>
              <th className="py-3.5 px-4 font-bold">Patient name</th>
              <th className="py-3.5 px-4 font-bold text-center w-20">Patient ID</th>
              <th className="py-3.5 px-4 font-bold">Vaccine brand</th>
              <th className="py-3.5 px-4 font-bold">Dose level</th>
              <th className="py-3.5 px-4 font-bold">Date registered</th>
              <th className="py-3.5 px-4 font-bold">Administered by</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-mono text-[11px] text-slate-700">
            {filteredLogs.length === 0 ? (
              <tr id="empty_logs_row">
                <td colSpan={7} className="py-12 text-center text-slate-400 font-sans">
                  <Database className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-600">No vaccination logs match your search.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click "Record New" to enter a physical dose.</p>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.vaccination_id} className="hover:bg-slate-50 text-slate-700 transition-colors" id={`row_vaccination_${log.vaccination_id}`}>
                  <td className="py-3.5 px-4 text-center font-bold text-[#0B7886]">{log.vaccination_id}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-[#1E293B]">{log.patient_name}</td>
                  <td className="py-3.5 px-4 text-center text-slate-500">{log.patient_id}</td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">{log.vaccine_name}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                      log.dose_number === "Booster"
                        ? "bg-purple-100 text-purple-750"
                        : log.dose_number === "2nd Dose"
                        ? "bg-[#0B7886]/10 text-[#0B7886]"
                        : "bg-blue-100 text-blue-750"
                    }`}>
                      {log.dose_number}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{log.date_administered}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-500 font-medium">{log.administered_by}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL: NEW VACCINATION RECORD ENTRY */}
      {isLogFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-center items-center p-4">
          <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-[#E2E8F0] bg-slate-50 flex justify-between items-center rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[#0B7886]" />
                <h3 className="font-bold text-[#1E293B] text-sm font-sans">Log New Vaccine Administration</h3>
              </div>
              <button onClick={() => setIsLogFormOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleLogSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-[#C53030] text-xs rounded-lg flex gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="font-semibold">{formError}</span>
                </div>
              )}

              {/* Patient Selection Searchable Autocomplete */}
              <div className="space-y-1.5 relative">
                <label className="text-xs text-slate-550 font-bold tracking-wider font-sans">Patient or resident ID</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Type name, ID, or Family Serial Number (FSN)..."
                    value={patientQuery}
                    onFocus={() => setShowComboboxDropdown(true)}
                    onChange={(e) => {
                      setPatientQuery(e.target.value);
                      setShowComboboxDropdown(true);
                      setFormError("");
                      if (newLog.patient_id) {
                        setNewLog({ ...newLog, patient_id: "" });
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowComboboxDropdown(false), 200)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-3 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] shadow-xs"
                    id="search_log_patient"
                  />
                  {newLog.patient_id && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] bg-teal-50 text-[#0B7886] font-bold px-2 py-1 rounded border border-[#0B7886]/20">
                      Selected ID: {newLog.patient_id}
                    </div>
                  )}
                </div>

                {showComboboxDropdown && (
                  <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto bg-white border border-[#E2E8F0] rounded-xl shadow-lg divide-y divide-slate-100">
                    {(() => {
                      const query = patientQuery.toLowerCase().trim();
                      const filtered = patients.filter(
                        (p) =>
                          p.patient_id.toLowerCase().includes(query) ||
                          `${p.first_name} ${p.last_name}`.toLowerCase().includes(query) ||
                          p.family_serial_number.toLowerCase().includes(query)
                      );

                      if (filtered.length === 0) {
                        return (
                          <div className="p-3 text-xs text-slate-400 text-center font-sans">
                            No registered patients found matching "{patientQuery}"
                          </div>
                        );
                      }

                      return filtered.map((p) => (
                        <div
                          key={p.patient_id}
                          onMouseDown={() => {
                            setNewLog({
                              ...newLog,
                              patient_id: p.patient_id
                            });
                            setPatientQuery(`[${p.patient_id}] ${p.last_name}, ${p.first_name} (Zone ${p.zone})`);
                            setShowComboboxDropdown(false);
                            setFormError("");
                          }}
                          className="p-3 text-xs hover:bg-teal-50/50 text-slate-700 cursor-pointer flex flex-col gap-0.5 transition-colors"
                        >
                          <div className="flex justify-between font-semibold text-slate-800 font-sans">
                            <span>{p.last_name}, {p.first_name}</span>
                            <span className="text-[#0B7886] font-mono">ID: {p.patient_id}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>FSN: {p.family_serial_number}</span>
                            <span>Zone: {p.zone}</span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Vaccine Brand Options */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-550 font-bold tracking-wider font-sans">Vaccine brand</label>
                  <select
                    value={newLog.vaccine_name}
                    onChange={(e) => setNewLog({...newLog, vaccine_name: e.target.value})}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-3 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] cursor-pointer shadow-xs"
                    id="select_log_brand"
                  >
                    <option value="Pfizer-BioNTech">Pfizer-BioNTech</option>
                    <option value="Moderna">Moderna</option>
                    <option value="Sinovac">Sinovac</option>
                    <option value="Johnson & Johnson">Johnson & Johnson</option>
                    <option value="AstraZeneca">AstraZeneca</option>
                    <option value="BCG">BCG (Child TB)</option>
                    <option value="Pentavalent">Pentavalent (DPT-HepB-Hib)</option>
                    <option value="OPV">OPV (Oral Polio)</option>
                    <option value="PCV">PCV (Pneumococcal)</option>
                    <option value="IPV">IPV (Polio Inj)</option>
                    <option value="MR">MR (Measles-Rubella)</option>
                    <option value="MMR">MMR (Measles, Mumps, Rubella)</option>
                  </select>
                </div>

                {/* Dose Number */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-550 font-bold tracking-wider font-sans">Dose level</label>
                  <select
                    value={newLog.dose_number}
                    onChange={(e) => setNewLog({...newLog, dose_number: e.target.value as any})}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-3 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] cursor-pointer shadow-xs"
                    id="select_log_dose"
                  >
                    <option value="1st Dose">1st Dose</option>
                    <option value="2nd Dose">2nd Dose</option>
                    <option value="3rd Dose">3rd Dose</option>
                    <option value="Booster">Booster</option>
                    <option value="N/A">N/A Single Dose</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Administered Date */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-550 font-bold tracking-wider font-sans">Date administered</label>
                  <input
                    type="date"
                    required
                    value={newLog.date_administered}
                    onChange={(e) => setNewLog({...newLog, date_administered: e.target.value})}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-805 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] cursor-pointer shadow-xs"
                  />
                </div>

                {/* Batch Number */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-550 font-bold tracking-wider font-sans">Batch number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PFZ-2026B"
                    value={newLog.batch_number}
                    onChange={(e) => { setNewLog({...newLog, batch_number: e.target.value}); setFormError(""); }}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] font-mono shadow-xs"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-550 font-bold tracking-wider font-sans">Clinical remarks</label>
                <textarea
                  placeholder="e.g. Safe administration. Instructed guardian regarding standard post-care schedules."
                  rows={2}
                  value={newLog.remarks}
                  onChange={(e) => setNewLog({...newLog, remarks: e.target.value})}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg p-3 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886]"
                />
              </div>

              <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[11px] leading-relaxed text-slate-500 font-sans">
                ⭐ <span className="font-bold text-[#0B7886]">Smart Splicer:</span> Recording this dose automatically schedules the patient's next target immunization checkup date and creates a reminder in our scheduling system.
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsLogFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B7886] hover:bg-[#09626C] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
