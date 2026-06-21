/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Send, 
  MessageSquare, 
  Bell, 
  Plus, 
  X, 
  Check, 
  AlertTriangle, 
  FileText,
  MousePointerClick,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Appointment, Patient, SMSLog, User } from "../types";

interface ServiceSchedulingProps {
  currentUser: User;
  patients: Patient[];
  appointments: Appointment[];
  smsLogs: SMSLog[];
  onAddAppointment: (appt: Appointment) => void;
  onUpdateAppointmentStatus: (id: string, status: "Scheduled" | "Completed" | "No Show") => void;
  onSendSMS: (log: SMSLog) => void;
}

export default function ServiceScheduling({
  currentUser,
  patients,
  appointments,
  smsLogs,
  onAddAppointment,
  onUpdateAppointmentStatus,
  onSendSMS
}: ServiceSchedulingProps) {
  const [isApptFormOpen, setIsApptFormOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  // New appointment form state
  const [newAppt, setNewAppt] = useState({
    patient_id: "",
    service_type: "Vaccination" as any,
    scheduled_date: "2026-06-25",
    notes: ""
  });

  const [apptError, setApptError] = useState("");

  // Broadcast campaign form state
  const [campaign, setCampaign] = useState({
    title: "Dengue Larvae Prevention",
    content: "HEALTH ALERT: Due to elevated rainfall, let us safeguard our households from Dengue. Check standing water containers, conduct cleanup. Seek prompt checks if fever persists."
  });

  const handleApptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.patient_id) {
      setApptError("Please select a registered patient.");
      return;
    }

    const selectedPatient = patients.find(p => p.patient_id === newAppt.patient_id);
    if (!selectedPatient) return;

    const freshAppt: Appointment = {
      appointment_id: `A-${Date.now()}`,
      patient_id: selectedPatient.patient_id,
      patient_name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
      service_type: newAppt.service_type,
      scheduled_date: newAppt.scheduled_date,
      status: "Scheduled",
      contact_number: selectedPatient.contact_number,
      notes: newAppt.notes
    };

    onAddAppointment(freshAppt);
    setIsApptFormOpen(false);
    // Reset
    setNewAppt({
      patient_id: "",
      service_type: "Vaccination",
      scheduled_date: "2026-06-25",
      notes: ""
    });
    setApptError("");

    // Simulate sending automatic SMS notification
    const freshSMS: SMSLog = {
      sms_id: `SMS-${Date.now()}`,
      patient_id: selectedPatient.patient_id,
      recipient_name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
      recipient_number: selectedPatient.contact_number,
      message_content: `REMINDER: ${selectedPatient.first_name}, you have a ${newAppt.service_type} appointment scheduled at Brgy. Junob Health Station on ${newAppt.scheduled_date}. Thank you.`,
      message_type: "Reminder",
      date_sent: "2026-06-20 18:00",
      status: "Sent"
    };
    onSendSMS(freshSMS);
  };

  // Broadcast trigger to multiple members
  const triggerCampaignBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    patients.forEach((p, idx) => {
      if (idx < 5) { // simulate targeting a segment of citizens
        const freshSMS: SMSLog = {
          sms_id: `SMS-BCAST-${Date.now()}-${idx}`,
          patient_id: p.patient_id,
          recipient_name: `${p.first_name} ${p.last_name}`,
          recipient_number: p.contact_number,
          message_content: `BROADCAST [${campaign.title}]: ${campaign.content}`,
          message_type: "Health Announcement",
          date_sent: "2026-06-20 21:10",
          status: "Sent"
        };
        onSendSMS(freshSMS);
      }
    });
    setIsBroadcastOpen(false);
    alert(`SMS Broadcast dispatched successfully! Total recipients in Purok zones: 5.`);
  };

  return (
    <div className="space-y-6 max-h-full overflow-y-auto pb-8 pr-1" id="scheduling_view">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 border border-slate-850 rounded-xl mt-1" id="scheduling_header">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white tracking-tight">Integrated Service Scheduler & SMS reminders</h2>
          <p className="text-xs text-slate-400 font-sans">Automate checkups, schedule vaccination dates and monitor alert delivery</p>
        </div>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="px-3.5 py-2 bg-slate-800 border-slate-705 border text-slate-205 hover:bg-slate-750 font-semibold rounded-lg text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            id="btn_campaign_broadcast_open"
          >
            <Bell className="h-4 w-4 text-teal-400" />
            <span>Broadcast Alerts</span>
          </button>
          <button
            onClick={() => setIsApptFormOpen(true)}
            className="px-4 py-2 bg-teal-555 hover:bg-teal-600 border-none rounded-lg text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-900/10 transition-colors"
            id="btn_schedule_appointment_open"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1 & 2: RECENT AND UPCOMING SCHEDULING TARGETS */}
        <div className="lg:col-span-2 space-y-4" id="appointments_container">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-400" />
              <span>Upcoming Barangay Services Lists</span>
            </h3>

            <div className="space-y-3">
              {appointments.length === 0 ? (
                <p className="text-slate-500 text-center py-8 italic">No upcoming schedules created in database.</p>
              ) : (
                appointments.map((appt) => (
                  <div 
                    key={appt.appointment_id} 
                    className="p-4 bg-slate-900 border border-slate-755 hover:border-slate-700 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors"
                    id={`appt_card_${appt.appointment_id}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm leading-tight">{appt.patient_name}</span>
                        <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold font-sans ${
                          appt.service_type === "Vaccination"
                            ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            : appt.service_type === "Newborn Screening"
                            ? "bg-yellow-400/10 text-yellow-400 border border-yellow-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}>
                          {appt.service_type}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-450 font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span>Schedule: <strong className="text-slate-250 font-sans">{appt.scheduled_date}</strong></span>
                        </div>
                        <div>Contact: <strong className="text-slate-250 font-sans">{appt.contact_number}</strong></div>
                      </div>

                      {appt.notes && (
                        <p className="text-[10px] text-slate-500 font-mono pt-1 leading-normal">
                          * "{appt.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 justify-end md:justify-start">
                      {appt.status === "Scheduled" ? (
                        <>
                          <button
                            onClick={() => onUpdateAppointmentStatus(appt.appointment_id, "Completed")}
                            className="px-2.5 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded font-semibold text-[10px] cursor-pointer transition-all"
                          >
                            Mark done
                          </button>
                          <button
                            onClick={() => onUpdateAppointmentStatus(appt.appointment_id, "No Show")}
                            className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-500/20 rounded font-semibold text-[10px] cursor-pointer transition-all"
                          >
                            No show
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 text-[10px] font-bold rounded ${
                          appt.status === "Completed"
                            ? "bg-green-500/10 text-green-400 border border-green-500/10"
                            : "bg-rose-500/10 text-rose-450 border border-rose-500/10"
                        }`}>
                          {appt.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 3: SMS ALERTS SYSTEM LOG AND DISPATCH COORDS */}
        <div className="space-y-4" id="sms_notif_log_section">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-teal-400 animate-pulse" />
                <span>Simulated SMS gateway Logs</span>
              </h3>
              <p className="text-[11px] text-slate-450">Automatic verification audit log for SMS notices dispatched</p>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
              {smsLogs.map((log) => (
                <div key={log.sms_id} className="p-3 bg-slate-900 border border-slate-755 rounded-lg space-y-2 text-[11px]">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-205 font-bold truncate max-w-[120px]">{log.recipient_name}</span>
                    <span className="text-slate-500">{log.date_sent}</span>
                  </div>
                  <p className="text-[11px] text-slate-350 bg-slate-950 p-2 rounded leading-relaxed font-mono">
                    "{log.message_content}"
                  </p>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold">{log.recipient_number}</span>
                    <span className="px-1.5 py-0.5 bg-green-550/10 text-green-440 border border-green-500/20 rounded font-mono font-bold text-[8px]">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD MANUAL APPOINTMENT */}
      {isApptFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-700 bg-slate-900 flex justify-between items-center rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-400" />
                <h3 className="font-bold text-white text-sm">Create Automated Care Appointment</h3>
              </div>
              <button onClick={() => setIsApptFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleApptSubmit} className="p-6 space-y-4">
              {apptError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs rounded-lg flex gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{apptError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Select citizen patient</label>
                <select
                  required
                  value={newAppt.patient_id}
                  onChange={(e) => { setNewAppt({...newAppt, patient_id: e.target.value}); setApptError(""); }}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-150 text-xs focus:outline-none cursor-pointer"
                  id="select_appt_patient"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.patient_id} value={p.patient_id}>
                      [{p.patient_id}] {p.last_name}, {p.first_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Service type</label>
                  <select
                    value={newAppt.service_type}
                    onChange={(e) => setNewAppt({...newAppt, service_type: e.target.value as any})}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-150 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Vaccination">Vaccination</option>
                    <option value="Prenatal Check">Prenatal Check</option>
                    <option value="Postpartum Check">Postpartum Check</option>
                    <option value="TB Followup">TB Follow-up</option>
                    <option value="Newborn Screening">Newborn Screening (RA 9288)</option>
                    <option value="General Consultation">General Consultation</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Scheduled target date</label>
                  <input
                    type="date"
                    required
                    value={newAppt.scheduled_date}
                    onChange={(e) => setNewAppt({...newAppt, scheduled_date: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-115 text-xs focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Schedule coordinates or notes</label>
                <input
                  type="text"
                  placeholder="e.g. Liam Measles-Rubella vaccine check."
                  value={newAppt.notes}
                  onChange={(e) => setNewAppt({...newAppt, notes: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-350 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApptFormOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-650 text-slate-200 text-xs rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-555 hover:bg-teal-650 text-white text-xs rounded font-bold cursor-pointer"
                >
                  Schedule appt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: HEALTH CAMPAIGN BROADCAST CHANNELS */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-700 bg-slate-900 flex justify-between items-center rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-teal-400" />
                <h3 className="font-bold text-white text-sm">Broadcast Public Health Bulletins</h3>
              </div>
              <button onClick={() => setIsBroadcastOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={triggerCampaignBroadcast} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Select campaign preset</label>
                <select
                  value={campaign.title}
                  onChange={(e) => {
                    let text = "";
                    if (e.target.value === "Dengue Larvae Prevention") {
                      text = "HEALTH ALERT: Due to elevated rainfall, let us safeguard our households from Dengue. Check standing water containers, conduct cleanup. Seek prompt checks if fever persists.";
                    } else if (e.target.value === "Diarrhea Hydration Advisory") {
                      text = "BARANGAY BULLETINS: Children get pediatric diarrhea during rainy season change. Ensure pure water boiling, keep hand sanitation safe, administer oral rehydration solutions.";
                    } else {
                      text = "MATERNAL NOTICE: To all expectant mothers, prenatal medical examinations are scheduled this Monday morning. Bring your health booklet cards safely.";
                    }
                    setCampaign({ title: e.target.value, content: text });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-150 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Dengue Larvae Prevention">Dengue Larvae Prevention (Pito-Pito Survey)</option>
                  <option value="Diarrhea Hydration Advisory">Children Diarrhea Hygiene & Hydration Alert</option>
                  <option value="Maternal Care Schedule reminders">Maternal Check Reminder Monday Midwife sessions</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold font-mono">SMS broadcast message text</label>
                <textarea
                  rows={4}
                  value={campaign.content}
                  onChange={(e) => setCampaign({...campaign, content: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-slate-150 text-xs focus:outline-none font-mono leading-relaxed"
                />
              </div>

              <div className="p-3 bg-slate-900 border border-slate-755 rounded-lg text-[10px] text-slate-450 leading-relaxed font-mono">
                ⚠️ <span className="font-bold text-yellow-300">Channel segments coordinates:</span> Dispatches the broadcast instantly to the phone numbers of 5 registered Purok segment leaders and parents databases.
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-650 text-slate-200 text-xs rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-555 hover:bg-teal-650 text-white text-xs rounded font-bold cursor-pointer flex items-center gap-1"
                >
                  <Send className="h-3 w-3" />
                  <span>Transmit Broadcast SMS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
