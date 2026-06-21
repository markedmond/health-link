/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  UserPlus, 
  Eye, 
  Trash2, 
  X, 
  QrCode, 
  Download, 
  Baby, 
  Heart, 
  TrendingUp, 
  Activity, 
  Plus, 
  AlertTriangle,
  Calendar,
  Check,
  MapPin,
  Clock,
  Printer
} from "lucide-react";
import { 
  Patient, 
  User, 
  ChildGrowthRecord, 
  MaternalHealthRecord, 
  NewbornScreeningRecord,
  VaccinationRecord,
  TreatmentRecord
} from "../types";

interface PatientProfilingProps {
  currentUser: User;
  patients: Patient[];
  growthRecords: ChildGrowthRecord[];
  maternalRecords: MaternalHealthRecord[];
  newbornRecords: NewbornScreeningRecord[];
  vaccinations: VaccinationRecord[];
  treatments: TreatmentRecord[];
  onAddPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
  onAddGrowth: (record: ChildGrowthRecord) => void;
  onAddMaternal: (record: MaternalHealthRecord) => void;
  onUpdateMaternal: (record: MaternalHealthRecord) => void;
  onAddNewborn: (record: NewbornScreeningRecord) => void;
  onUpdateNewborn: (record: NewbornScreeningRecord) => void;
  onAddTreatment: (record: TreatmentRecord) => void;
  onUpdateTreatment: (record: TreatmentRecord) => void;
}

export default function PatientProfiling({
  currentUser,
  patients,
  growthRecords,
  maternalRecords,
  newbornRecords,
  vaccinations,
  treatments,
  onAddPatient,
  onUpdatePatient,
  onAddGrowth,
  onAddMaternal,
  onUpdateMaternal,
  onAddNewborn,
  onUpdateNewborn,
  onAddTreatment,
  onUpdateTreatment
}: PatientProfilingProps) {
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZoneFilter, setSelectedZoneFilter] = useState("All");

  // View States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Growth, Maternal, Screening inputs
  const [isAddingGrowthMetrics, setIsAddingGrowthMetrics] = useState(false);
  const [isAddingMaternalMetrics, setIsAddingMaternalMetrics] = useState(false);
  const [isAddingNewbornScreening, setIsAddingNewbornScreening] = useState(false);

  // Search filter
  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.middle_name} ${patient.last_name}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchLower) ||
      patient.patient_id.includes(searchLower) ||
      patient.family_serial_number.toLowerCase().includes(searchLower) ||
      patient.address.toLowerCase().includes(searchLower);
    
    const matchesZone = selectedZoneFilter === "All" || patient.zone === selectedZoneFilter;
    return matchesSearch && matchesZone;
  });

  // Calculate age helper
  const calculateAge = (dobString: string) => {
    const today = new Date("2026-06-20"); // standard system baseline date
    const dob = new Date(dobString);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age === 0) {
      // return in months
      const months = (today.getFullYear() - dob.getFullYear()) * 12 + today.getMonth() - dob.getMonth();
      return `${months || 0} mos`;
    }
    return `${age} yrs`;
  };

  // Form states for new Patient Registration
  const [newReg, setNewReg] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    date_of_birth: "",
    sex: "Female" as "Male" | "Female",
    address: "",
    contact_number: "",
    mother_name: "",
    blood_type: "O+",
    philhealth_member: "No" as "Yes" | "No",
    vaccination_status: "Unvaccinated" as "Fully Vaccinated" | "Partially Vaccinated" | "Unvaccinated",
    zone: "Purok Antipolo",
    remarks: "",
    dpa_consented: false
  });

  const [regError, setRegError] = useState("");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReg.last_name || !newReg.first_name || !newReg.date_of_birth || !newReg.address || !newReg.contact_number) {
      setRegError("All primary fields are required to register a resident.");
      return;
    }
    if (!newReg.dpa_consented) {
      setRegError("The resident or guardian must grant consent (DPA sign-off) to hold record files locally.");
      return;
    }

    const uniqueId = String(patients.length + 1).padStart(3, "0");
    const generatedFSN = `FSN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const freshPatient: Patient = {
      patient_id: uniqueId,
      family_serial_number: generatedFSN,
      last_name: newReg.last_name,
      first_name: newReg.first_name,
      middle_name: newReg.middle_name,
      date_of_birth: newReg.date_of_birth,
      sex: newReg.sex,
      address: newReg.address,
      contact_number: newReg.contact_number,
      mother_name: newReg.mother_name || "N/A",
      blood_type: newReg.blood_type,
      philhealth_member: newReg.philhealth_member,
      vaccination_status: newReg.vaccination_status,
      zone: newReg.zone,
      qr_code_token: `MEMBER-${newReg.last_name}-${newReg.first_name}-${uniqueId}`,
      created_at: new Date().toISOString()
    };

    onAddPatient(freshPatient);
    setIsRegisterOpen(false);
    // Reset Form
    setNewReg({
      last_name: "",
      first_name: "",
      middle_name: "",
      date_of_birth: "",
      sex: "Female",
      address: "",
      contact_number: "",
      mother_name: "",
      blood_type: "O+",
      philhealth_member: "No",
      vaccination_status: "Unvaccinated",
      zone: "Purok Antipolo",
      remarks: "",
      dpa_consented: false
    });
    setRegError("");
  };

  // 1. Growth Tracker calculator
  const [growthInput, setGrowthInput] = useState({
    weight: "",
    height: "",
    remarks: ""
  });

  const [growthError, setGrowthError] = useState("");

  const handleGrowthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const wt = parseFloat(growthInput.weight);
    const ht = parseFloat(growthInput.height);
    if (isNaN(wt) || wt <= 0 || isNaN(ht) || ht <= 0) {
      setGrowthError("Please provide correct real numbers for Height and Weight.");
      return;
    }

    // Age in months calculation
    const dob = new Date(selectedPatient.date_of_birth);
    const today = new Date("2026-06-20");
    const ageMonths = (today.getFullYear() - dob.getFullYear()) * 12 + today.getMonth() - dob.getMonth();

    // Determine WHO nutritional status simply matching guidelines
    // A simplified algorithm approximating childhood growth percentiles:
    // e.g. for under 5 years: normal weight at 2 months is approx 4.5kg - 6kg.
    let status: "Normal" | "Underweight" | "Severely Underweight" | "Stunted" = "Normal";
    let zscore = 0.0;

    if (ageMonths <= 12) {
      // 0 - 1 year approximation
      if (wt < 3.2 && ageMonths > 0) {
        status = "Severely Underweight";
        zscore = -3.2;
      } else if (wt < 4.5 && ageMonths >= 2) {
        status = "Underweight";
        zscore = -2.1;
      } else if (ht < 52 && ageMonths >= 3) {
        status = "Stunted";
        zscore = -2.3;
      }
    } else {
      // Over 1 year representation
      if (wt / ((ht / 100) * (ht / 100)) < 12.5) {
        status = "Underweight";
        zscore = -2.0;
      }
    }

    const freshGrowth: ChildGrowthRecord = {
      growth_id: `G-${Date.now()}`,
      patient_id: selectedPatient.patient_id,
      patient_name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
      measurement_date: "2026-06-20",
      age_months: Math.max(1, ageMonths),
      weight_kg: wt,
      height_cm: ht,
      nutritional_status: status,
      who_zscore: zscore,
      intervention_flag: status !== "Normal",
      remarks: growthInput.remarks || "Regular check complete."
    };

    onAddGrowth(freshGrowth);
    setIsAddingGrowthMetrics(false);
    setGrowthInput({ weight: "", height: "", remarks: "" });
    setGrowthError("");
  };

  // 2. Pregnancy tracking model
  const [pregnancyInput, setPregnancyInput] = useState({
    lmpDate: "",
    gravida: "1",
    para: "0",
    bloodPressure: "120/80",
    weight: "60",
    tetanusToxoidDoses: "1",
    ferrousSulfateTablets: "90",
    calciumSupplementsTablets: "60",
    notes: ""
  });

  const [isAddingPrenatalFollowup, setIsAddingPrenatalFollowup] = useState<string | null>(null);
  const [prenatalFollowupInput, setPrenatalFollowupInput] = useState({
    bloodPressure: "120/80",
    weight: "60",
    tetanusToxoidDoses: "1",
    ferrousSulfateTablets: "30",
    calciumSupplementsTablets: "30",
    notes: ""
  });

  const handlePregnancySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    const lmp = new Date(pregnancyInput.lmpDate || "2025-10-01");
    // Expected birth calculation using Naegele's Rule: LMP + 9 months + 7 days
    const edd = new Date(lmp);
    edd.setMonth(edd.getMonth() + 9);
    edd.setDate(edd.getDate() + 7);

    const freshMaternal: MaternalHealthRecord = {
      maternal_id: `M-${Date.now()}`,
      patient_id: selectedPatient.patient_id,
      patient_name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
      lmp_date: pregnancyInput.lmpDate || "2025-10-01",
      expected_delivery_date: edd.toISOString().split("T")[0],
      gravida: parseInt(pregnancyInput.gravida) || 1,
      para: parseInt(pregnancyInput.para) || 0,
      tetanus_toxoid_doses: parseInt(pregnancyInput.tetanusToxoidDoses) || 1,
      ferrous_sulfate_tablets: parseInt(pregnancyInput.ferrousSulfateTablets) || 90,
      calcium_supplements_tablets: parseInt(pregnancyInput.calciumSupplementsTablets) || 60,
      blood_pressure: pregnancyInput.bloodPressure,
      weight_kg: parseFloat(pregnancyInput.weight) || 60,
      status: "Prenatal Tracking",
      notes: pregnancyInput.notes || "High risk monitoring initiated."
    };

    onAddMaternal(freshMaternal);
    setIsAddingMaternalMetrics(false);
  };

  const handlePrenatalFollowupSubmit = (e: React.FormEvent, mRecord: MaternalHealthRecord) => {
    e.preventDefault();
    const updated: MaternalHealthRecord = {
      ...mRecord,
      blood_pressure: prenatalFollowupInput.bloodPressure,
      weight_kg: parseFloat(prenatalFollowupInput.weight) || mRecord.weight_kg,
      tetanus_toxoid_doses: Math.max(mRecord.tetanus_toxoid_doses, parseInt(prenatalFollowupInput.tetanusToxoidDoses) || mRecord.tetanus_toxoid_doses),
      ferrous_sulfate_tablets: mRecord.ferrous_sulfate_tablets + (parseInt(prenatalFollowupInput.ferrousSulfateTablets) || 0),
      calcium_supplements_tablets: mRecord.calcium_supplements_tablets + (parseInt(prenatalFollowupInput.calciumSupplementsTablets) || 0),
      notes: prenatalFollowupInput.notes || mRecord.notes
    };
    onUpdateMaternal(updated);
    setIsAddingPrenatalFollowup(null);
  };

  // 3. Newborn Screening form
  const [nbsInput, setNbsInput] = useState({
    birthDate: "",
    screeningDate: "",
    hoursAfterBirth: "48",
    abnormalFindings: "None",
    bcg: true,
    hepb: true,
    vitaminK: true
  });

  const handleNbsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const limitHours = parseInt(nbsInput.hoursAfterBirth) || 48;
    // Overdue check
    const statusVal = limitHours > 72 ? "Overdue" : "Completed";

    const freshNewborn: NewbornScreeningRecord = {
      screening_id: `N-${Date.now()}`,
      patient_id: selectedPatient.patient_id,
      patient_name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
      birth_date: nbsInput.birthDate || selectedPatient.date_of_birth,
      screening_date: nbsInput.screeningDate || "2026-06-20",
      hours_after_birth_screened: limitHours,
      screening_status: statusVal,
      abnormal_findings: nbsInput.abnormalFindings,
      bcg_given: nbsInput.bcg,
      hepb_given: nbsInput.hepb,
      vitamin_k_given: nbsInput.vitaminK,
      facility: "Brgy. Junob Health Station"
    };

    onAddNewborn(freshNewborn);
    setIsAddingNewbornScreening(false);
  };

  // Postpartum update checkpoint triggers
  const markPostpartumCheckpoint = (mHealth: MaternalHealthRecord, checkpoint: "24h" | "1w" | "6w") => {
    const updated = { ...mHealth };
    if (checkpoint === "24h") updated.postpartum_visit_24h = new Date().toISOString().split("T")[0];
    if (checkpoint === "1w") updated.postpartum_visit_1w = new Date().toISOString().split("T")[0];
    if (checkpoint === "6w") updated.postpartum_visit_6w = new Date().toISOString().split("T")[0];
    
    if (updated.postpartum_visit_24h && updated.postpartum_visit_1w && updated.postpartum_visit_6w) {
      updated.status = "Completed";
    } else {
      updated.status = "Postpartum Monitoring";
    }

    onUpdateMaternal(updated);
  };

  // Delivery logger helper
  const recordRecordedDelivery = (mHealth: MaternalHealthRecord) => {
    const updated = {
      ...mHealth,
      status: "Postpartum Monitoring" as const,
      actual_delivery_date: new Date().toISOString().split("T")[0]
    };
    onUpdateMaternal(updated);
  };

  // 4. Long-Term TB Treatment State & Helpers
  const [isAddingTreatment, setIsAddingTreatment] = useState(false);
  const [treatmentError, setTreatmentError] = useState("");
  const [treatmentInput, setTreatmentInput] = useState({
    medicinePhase1: "Rifampicin + Isoniazid + Pyrazinamide + Ethambutol (HRZE) - Phase 1",
    medicinePhase2: "Rifampicin + Isoniazid (HR) - Phase 2",
    startDate: "2026-06-21",
    nextFollowupDate: "2026-07-21",
    missedVisits: "0",
    status: "Active" as "Active" | "Completed" | "Missed"
  });

  const handleTreatmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const missed = parseInt(treatmentInput.missedVisits) || 0;
    
    // Auto end date is 6 months after start date (2 months Phase 1, 4 months Phase 2)
    const start = new Date(treatmentInput.startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 6);

    const freshTreatment: TreatmentRecord = {
      treatment_id: `T-${Date.now()}`,
      patient_id: selectedPatient.patient_id,
      patient_name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
      treatment_type: "Tuberculosis (DOTS)",
      start_date: treatmentInput.startDate,
      end_date: end.toISOString().split("T")[0],
      medicine_phase_1: treatmentInput.medicinePhase1,
      medicine_phase_2: treatmentInput.medicinePhase2,
      last_followup_date: treatmentInput.startDate,
      next_followup_date: treatmentInput.nextFollowupDate,
      missed_visits: missed,
      status: missed > 0 ? "Missed" : treatmentInput.status
    };

    onAddTreatment(freshTreatment);
    setIsAddingTreatment(false);
    setTreatmentError("");
  };

  const handleUpdateFollowup = (treatment: TreatmentRecord, missedIncrement = false) => {
    const nextDateObj = new Date(treatment.next_followup_date);
    nextDateObj.setMonth(nextDateObj.getMonth() + 1); // Increment monthly visit
    
    const updated: TreatmentRecord = {
      ...treatment,
      last_followup_date: treatment.next_followup_date,
      next_followup_date: nextDateObj.toISOString().split("T")[0],
      missed_visits: missedIncrement ? treatment.missed_visits + 1 : treatment.missed_visits,
      status: missedIncrement ? "Missed" : "Active"
    };

    onUpdateTreatment(updated);
  };

  const handleResetMissedVisits = (treatment: TreatmentRecord) => {
    const updated: TreatmentRecord = {
      ...treatment,
      missed_visits: 0,
      status: "Active"
    };
    onUpdateTreatment(updated);
  };

  const handleCompleteTreatment = (treatment: TreatmentRecord) => {
    const updated: TreatmentRecord = {
      ...treatment,
      status: "Completed"
    };
    onUpdateTreatment(updated);
  };

  // Close newborn screening status
  const updateNbsScreenStatus = (screenRec: NewbornScreeningRecord) => {
    const updated = {
      ...screenRec,
      screening_status: "Completed" as const,
      screening_date: "2026-06-20",
      hours_after_birth_screened: 52
    };
    onUpdateNewborn(updated);
  };

  return (
    <div className="space-y-5 max-h-full overflow-y-auto pb-8 pr-1" id="profiling_view">
      {/* Header and Filter elements */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-[#E2E8F0] rounded-2xl shadow-sm" id="profiling_header">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[#1E293B] tracking-tight font-sans">Citizen Health Registry</h2>
          <p className="text-xs text-slate-500 font-medium">Search profiles, add maternal care files, register new kids, and track vaccination statuses</p>
        </div>
        
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-[#0D7A87] hover:bg-[#0A626C] border-none px-4.5 py-2.5 text-xs font-bold rounded-lg text-white flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
          id="btn_open_register"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Searching filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="filters_control">
        <div className="md:col-span-3 relative flex items-center">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none z-10 shrink-0">
            <Search className="h-[18px] w-[18px] min-w-[18px] min-h-[18px]" />
          </span>
          <input
            type="text"
            placeholder="Search by name, Family Serial Number (FSN), Purok address or patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-slate-800 border border-[#E2E8F0] rounded-xl pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D7A87] focus:border-[#0D7A87] transition-all shadow-sm font-medium"
            style={{ paddingLeft: "2.75rem" }}
            id="patient_search_input"
          />
        </div>

        <div>
          <select
            value={selectedZoneFilter}
            onChange={(e) => setSelectedZoneFilter(e.target.value)}
            className="w-full bg-white text-slate-800 border border-[#E2E8F0] rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D7A87] cursor-pointer shadow-sm font-semibold"
            id="zone_filter_dropdown"
          >
            <option value="All">All Puroks</option>
            <option value="Purok Antipolo">Purok Antipolo</option>
            <option value="Purok Gumamela">Purok Gumamela</option>
            <option value="Purok Hayahay">Purok Hayahay</option>
            <option value="Purok Kulo">Purok Kulo</option>
            <option value="Purok Lunoy">Purok Lunoy</option>
            <option value="Purok Makugihon">Purok Makugihon</option>
            <option value="Purok Matinabangon">Purok Matinabangon</option>
          </select>
        </div>
      </div>

      {/* Main Registry Database Rows */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-x-auto shadow-sm" id="registry_table_view">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/75 text-slate-500 border-b border-[#E2E8F0] uppercase font-sans font-bold text-[10px] tracking-wider">
              <th className="py-4 px-4 font-bold text-center w-16">ID</th>
              <th className="py-4 px-4 font-bold">Name</th>
              <th className="py-4 px-4 font-bold">Age/Sex</th>
              <th className="py-4 px-4 font-bold">Family Serial No.</th>
              <th className="py-4 px-4 font-bold">Purok</th>
              <th className="py-4 px-4 font-bold text-center">Vaccine Status</th>
              <th className="py-4 px-4 font-bold text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.length === 0 ? (
              <tr id="empty_search_row">
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="text-slate-300 mb-2 font-mono text-3xl">📭</div>
                  <p className="font-semibold text-slate-600">No citizens match your search parameters.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Double check the spelling or add a new patient profile.</p>
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient, index) => {
                const age = calculateAge(patient.date_of_birth);
                const isEvenRow = index % 2 === 0;
                return (
                  <tr key={patient.patient_id} className={`hover:bg-slate-50/40 text-slate-700 transition-colors ${isEvenRow ? 'bg-white' : 'bg-slate-50/20'}`} id={`row_patient_${patient.patient_id}`}>
                    <td className="py-4 px-4 font-mono text-center font-bold text-slate-400">{patient.patient_id}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-[#1E293B] block">
                        {patient.last_name}, {patient.first_name}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-medium mt-0.5">{patient.address}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-700 block">{age}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{patient.sex}</span>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500 font-medium">{patient.family_serial_number}</td>
                    <td className="py-4 px-4 font-semibold text-[#0D7A87]">{patient.zone}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase border ${
                        patient.vaccination_status === "Fully Vaccinated"
                          ? "bg-[#EAFDF2] text-[#15803D] border-[#DCFCE7]"
                          : patient.vaccination_status === "Partially Vaccinated"
                          ? "bg-[#FFF9EB] text-[#7A4B00] border-[#FEECD0]"
                          : "bg-[#FFF5F5] text-[#C53030] border-[#FEB2B2]"
                      }`}>
                        {patient.vaccination_status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsAddingGrowthMetrics(false);
                          setIsAddingMaternalMetrics(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#0D7A87]/10 text-[#0D7A87] border border-[#E2E8F0] hover:border-[#0D7A87]/30 rounded-lg transition-all cursor-pointer font-bold text-[11px]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Manage File</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: REGISTER NEW PATIENT */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-center items-center p-4">
          <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#0B7886]" />
                <h3 className="font-bold text-[#1E293B] text-sm font-sans">Register New Barangay Resident Profile</h3>
              </div>
              <button onClick={() => setIsRegisterOpen(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 flex-1">
              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 text-[#C53030] text-xs rounded-lg flex gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="font-semibold">{regError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Santos"
                    value={newReg.last_name}
                    onChange={(e) => { setNewReg({...newReg, last_name: e.target.value}); setRegError(""); }}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] shadow-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria"
                    value={newReg.first_name}
                    onChange={(e) => { setNewReg({...newReg, first_name: e.target.value}); setRegError(""); }}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] shadow-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">Middle Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Lopez"
                    value={newReg.middle_name}
                    onChange={(e) => setNewReg({...newReg, middle_name: e.target.value})}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={newReg.date_of_birth}
                    onChange={(e) => { setNewReg({...newReg, date_of_birth: e.target.value}); setRegError(""); }}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] cursor-pointer shadow-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">Sex</label>
                  <select
                    value={newReg.sex}
                    onChange={(e) => setNewReg({...newReg, sex: e.target.value as "Male" | "Female"})}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] cursor-pointer shadow-xs font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">Blood Type</label>
                  <select
                    value={newReg.blood_type}
                    onChange={(e) => setNewReg({...newReg, blood_type: e.target.value})}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] cursor-pointer shadow-xs font-semibold"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">House/Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House No. 12, Barangay Junob, Dumaguete City"
                    value={newReg.address}
                    onChange={(e) => { setNewReg({...newReg, address: e.target.value}); setRegError(""); }}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] shadow-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">Purok</label>
                  <select
                    value={newReg.zone}
                    onChange={(e) => setNewReg({...newReg, zone: e.target.value})}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] cursor-pointer shadow-xs font-semibold"
                  >
                    <option value="Purok Antipolo">Purok Antipolo</option>
                    <option value="Purok Gumamela">Purok Gumamela</option>
                    <option value="Purok Hayahay">Purok Hayahay</option>
                    <option value="Purok Kulo">Purok Kulo</option>
                    <option value="Purok Lunoy">Purok Lunoy</option>
                    <option value="Purok Makugihon">Purok Makugihon</option>
                    <option value="Purok Matinabangon">Purok Matinabangon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">Contact Phone Number</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    placeholder="e.g. 09551234567"
                    value={newReg.contact_number}
                    onChange={(e) => { setNewReg({...newReg, contact_number: e.target.value}); setRegError(""); }}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] shadow-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">Mother's Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jessica Flores"
                    value={newReg.mother_name}
                    onChange={(e) => setNewReg({...newReg, mother_name: e.target.value})}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] shadow-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wide font-sans">PhilHealth Member</label>
                  <select
                    value={newReg.philhealth_member}
                    onChange={(e) => setNewReg({...newReg, philhealth_member: e.target.value as "Yes" | "No"})}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B7886] focus:border-[#0B7886] cursor-pointer shadow-xs font-semibold"
                  >
                    <option value="Yes">Yes Member</option>
                    <option value="No">No Not Member</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-[#0B7886] uppercase tracking-wider block font-sans">Local Health Consent (DPA RA 10173)</span>
                <p className="text-[10px] text-slate-550 leading-relaxed font-sans font-semibold">
                  By ticking below, you verify that this patient's (or their minor child's) health metrics are recorded fully offline on the Brgy. Junob desktop computer for clinical scheduling, and reports submitted to the City Health Office.
                </p>
                <label className="flex items-center gap-2 cursor-pointer pt-1" id="agree_reg_checkbox">
                  <input
                    type="checkbox"
                    checked={newReg.dpa_consented}
                    onChange={(e) => { setNewReg({...newReg, dpa_consented: e.target.checked}); setRegError(""); }}
                    className="rounded text-[#0B7886] border-[#E2E8F0] bg-white h-4.5 w-4.5 accent-[#0B7886] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-600 hover:text-[#1E293B] font-sans">Grant Data Privacy & Local Backup Consent</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-705 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B7886] hover:bg-[#09626C] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE PATIENT CLINICAL FILE MANAGER (THE PRIMARY CORE HUB) */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-center items-center p-4">
          <div className="w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-2xl max-h-[92vh] overflow-y-auto shadow-xl flex flex-col text-xs text-slate-700">
            {/* Header banner */}
            <div className="p-5 border-b border-[#E2E8F0] bg-slate-50 flex justify-between items-start rounded-t-2xl">
              <div>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 font-mono text-[10px] font-bold rounded">PATIENT FILE: {selectedPatient.patient_id}</span>
                <h3 className="text-base font-bold text-[#1E293B] mt-1.5 font-sans">
                  {selectedPatient.last_name}, {selectedPatient.first_name} {selectedPatient.middle_name}
                </h3>
                <span className="text-xs text-[#0B7886] font-bold font-mono">{selectedPatient.family_serial_number}</span>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                Close File
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Card Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-[#E2E8F0]">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Age & Sex</span>
                  <span className="text-slate-800 font-bold text-xs font-sans">{calculateAge(selectedPatient.date_of_birth)} / {selectedPatient.sex}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Mother's Name</span>
                  <span className="text-slate-800 font-bold text-xs font-sans">{selectedPatient.mother_name}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">PhilHealth Status</span>
                  <span className="text-slate-800 font-bold text-xs font-sans">{selectedPatient.philhealth_member === "Yes" ? "✅ Registered Member" : "❌ No Record"}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Local Purok Node</span>
                  <span className="text-[#0B7886] font-bold font-mono text-xs">{selectedPatient.zone}</span>
                </div>
              </div>

              {/* Sub-Program Grid splits - Modern 2x2 bento style */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* COLUMN 1: PEDIATRIC GROWTH & DEVELOPMENT TRACKER */}
                <div className="bg-[#0B7886]/5 border border-[#E2E8F0] p-4.5 rounded-xl space-y-4">
                  <div className="flex justify-between items-center pb-2.5 border-b border-[#E2E8F0]">
                    <span className="font-bold text-[#1E293B] tracking-tight flex items-center gap-1.5 font-sans text-xs">
                      <Baby className="h-4.5 w-4.5 text-[#0B7886]" />
                      <span>WHO Growth Tracker</span>
                    </span>
                    <button
                      onClick={() => setIsAddingGrowthMetrics(!isAddingGrowthMetrics)}
                      className="px-2.5 py-1 bg-[#0B7886]/10 hover:bg-[#0B7886] text-[#0B7886] hover:text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-all border border-[#0B7886]/20"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Log Growth</span>
                    </button>
                  </div>

                  {isAddingGrowthMetrics && (
                    <form onSubmit={handleGrowthSubmit} className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] space-y-3 shadow-xs">
                      {growthError && <p className="text-[#C53030] text-[10px] font-bold">{growthError}</p>}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block font-sans">Weight (kg)</label>
                          <input
                            type="text"
                            placeholder="e.g. 5.2"
                            value={growthInput.weight}
                            onChange={(e) => { setGrowthInput({...growthInput, weight: e.target.value}); setGrowthError(""); }}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#0B7886]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block font-sans">Height (cm)</label>
                          <input
                            type="text"
                            placeholder="e.g. 55"
                            value={growthInput.height}
                            onChange={(e) => { setGrowthInput({...growthInput, height: e.target.value}); setGrowthError(""); }}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#0B7886]"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-500 font-bold block font-sans">Remarks</label>
                        <input
                          type="text"
                          placeholder="e.g. Fed well, healthy"
                          value={growthInput.remarks}
                          onChange={(e) => setGrowthInput({...growthInput, remarks: e.target.value})}
                          className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#0B7886]"
                        />
                      </div>
                      <div className="flex justify-end gap-1.5 text-[10px]">
                        <button type="button" onClick={() => setIsAddingGrowthMetrics(false)} className="px-2 py-1 bg-slate-100 rounded text-slate-700 cursor-pointer font-bold">Cancel</button>
                        <button type="submit" className="px-2.5 py-1 bg-[#0B7886] text-white font-bold rounded cursor-pointer transition-colors shadow-xs">Confirm Log</button>
                      </div>
                    </form>
                  )}

                  {/* Growth record list with WHO classifications */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block font-sans">Growth Chronology logs</span>
                    {growthRecords.filter(g => g.patient_id === selectedPatient.patient_id).length === 0 ? (
                      <p className="p-3 text-center bg-white/50 border border-[#E2E8F0] text-slate-500 rounded-lg text-[11px] italic font-medium font-sans">
                        No pediatric development records stored. Click Log Growth to add details.
                      </p>
                    ) : (
                      growthRecords
                        .filter(g => g.patient_id === selectedPatient?.patient_id)
                        .map((g_rec) => (
                          <div key={g_rec.growth_id} className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-[11px] space-y-1 shadow-xs">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-slate-450 font-mono font-bold tracking-wide">{g_rec.measurement_date}</span>
                              <span className="text-[#0B7886] font-bold font-sans">Age: {g_rec.age_months} mos</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px] py-1 font-sans border-b border-[#F1F5F9] pb-1">
                              <div className="text-slate-500 font-medium">Height: <span className="font-bold text-slate-850 font-mono">{g_rec.height_cm} cm</span></div>
                              <div className="text-slate-500 font-medium">Weight: <span className="font-bold text-slate-850 font-mono">{g_rec.weight_kg} kg</span></div>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-slate-400 font-semibold font-sans">Nutritional:</span>
                              <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border ${
                                g_rec.nutritional_status === "Normal"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-red-50 text-[#C53030] border-red-200"
                              }`}>
                                {g_rec.nutritional_status} (Z: {g_rec.who_zscore})
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal pt-1 font-sans mt-1 italic font-medium">
                              "{g_rec.remarks}"
                            </p>

                            {/* Generates alert when measurements fall below safe threshold */}
                            {g_rec.intervention_flag && (
                              <div className="p-2.5 bg-red-50 text-[#C53030] font-bold text-[10px] rounded-lg border border-red-200 mt-2 flex items-start gap-1.5 animate-pulse font-sans">
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#C53030]" />
                                <div>
                                  <span className="block uppercase tracking-wider font-extrabold text-[9px]">🚨 Alert: Under Safe Threshold</span>
                                  <span className="font-semibold text-red-600 block">Pediatric metrics indicate {g_rec.nutritional_status}. Urgent medical intervention requested.</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                              {/* COLUMN 2: PREGNANCY JOURNEY & POSTPARTUM TRACKER */}
                <div className="bg-rose-50/20 border border-[#E2E8F0] p-4.5 rounded-xl space-y-4">
                  <div className="flex justify-between items-center pb-2.5 border-b border-[#E2E8F0]">
                    <span className="font-bold text-[#1E293B] tracking-tight flex items-center gap-1.5 font-sans text-xs">
                      <Heart className="h-4.5 w-4.5 text-rose-500" />
                      <span>Pregnancy Timeline</span>
                    </span>
                    <button
                      onClick={() => setIsAddingMaternalMetrics(!isAddingMaternalMetrics)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-all border border-rose-200/50"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Enroll Pregnancy</span>
                    </button>
                  </div>

                  {isAddingMaternalMetrics && (
                    <form onSubmit={handlePregnancySubmit} className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] space-y-3 shadow-xs font-sans">
                      <div className="space-y-1 font-sans">
                        <label className="text-[10px] uppercase text-slate-500 font-bold block">Last Menstrual Period (LMP)</label>
                        <input
                          type="date"
                          value={pregnancyInput.lmpDate}
                          onChange={(e) => setPregnancyInput({...pregnancyInput, lmpDate: e.target.value})}
                          className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block">Gravida</label>
                          <input
                            type="number"
                            value={pregnancyInput.gravida}
                            onChange={(e) => setPregnancyInput({...pregnancyInput, gravida: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block">Para</label>
                          <input
                            type="number"
                            value={pregnancyInput.para}
                            onChange={(e) => setPregnancyInput({...pregnancyInput, para: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-400 font-bold block font-mono">Blood Pressure</label>
                          <input
                            type="text"
                            value={pregnancyInput.bloodPressure}
                            onChange={(e) => setPregnancyInput({...pregnancyInput, bloodPressure: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block">Weight (kg)</label>
                          <input
                            type="text"
                            value={pregnancyInput.weight}
                            onChange={(e) => setPregnancyInput({...pregnancyInput, weight: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-sans">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block">Tetanus Toxoid</label>
                          <select
                            value={pregnancyInput.tetanusToxoidDoses}
                            onChange={(e) => setPregnancyInput({...pregnancyInput, tetanusToxoidDoses: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] h-8"
                          >
                            <option value="1">TT1 Dose Received</option>
                            <option value="2">TT2 Doses Received</option>
                            <option value="3">TT3 Doses Received</option>
                            <option value="4">TT4 Doses Received</option>
                            <option value="5">TT5 Doses Received</option>
                          </select>
                        </div>
                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block">Ferrous Sulfate</label>
                          <input
                            type="number"
                            placeholder="e.g. 90 tablets"
                            value={pregnancyInput.ferrousSulfateTablets}
                            onChange={(e) => setPregnancyInput({...pregnancyInput, ferrousSulfateTablets: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-500 font-bold block">Enrollment Notes</label>
                        <input
                          type="text"
                          placeholder="e.g. Prescribed multi-vitamins"
                          value={pregnancyInput.notes}
                          onChange={(e) => setPregnancyInput({...pregnancyInput, notes: e.target.value})}
                          className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-1.5 text-[10px]">
                        <button type="button" onClick={() => setIsAddingMaternalMetrics(false)} className="px-2 py-1 bg-slate-100 rounded text-slate-700 cursor-pointer font-bold">Cancel</button>
                        <button type="submit" className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded cursor-pointer transition-colors shadow-xs">Confirm Enroll</button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3 font-sans">
                    {maternalRecords.filter(m => m.patient_id === selectedPatient.patient_id).length === 0 ? (
                      <p className="p-3 text-center bg-white/50 border border-[#E2E8F0] text-slate-500 rounded-lg text-[11px] italic font-sans font-semibold">
                        Not enrolled in any maternal health program logs. Select Enroll to initialize.
                      </p>
                    ) : (
                      maternalRecords
                        .filter(m => m.patient_id === selectedPatient?.patient_id)
                        .map((m_rec) => (
                          <div key={m_rec.maternal_id} className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl space-y-3 shadow-xs">
                            <div className="flex justify-between items-center bg-rose-50 p-2 rounded-lg text-[11px] border border-rose-100">
                              <span className="font-bold text-rose-700 uppercase tracking-tight text-[10px]">Status: {m_rec.status}</span>
                              <span className="text-[10px] text-rose-600 font-mono font-bold">Gravida {m_rec.gravida} / Para {m_rec.para}</span>
                            </div>
                            
                            <div className="space-y-1.5 text-slate-700">
                              <div className="flex justify-between text-[11px] border-b border-[#F1F5F9] pb-1">
                                <span className="text-slate-450 font-medium">LMP Date:</span>
                                <span className="font-bold text-slate-850 font-mono">{m_rec.lmp_date}</span>
                              </div>
                              <div className="flex justify-between text-[11px] border-b border-[#F1F5F9] pb-1">
                                <span className="text-slate-450 font-medium">Target Birth (EDD):</span>
                                <span className="font-bold text-[#0B7886] font-mono">{m_rec.expected_delivery_date}</span>
                              </div>
                              <div className="flex justify-between text-[11px] border-b border-[#F1F5F9] pb-1">
                                <span className="text-slate-450 font-medium">BP & Current Weight:</span>
                                <span className="font-bold text-slate-800 font-mono">{m_rec.blood_pressure || "120/80"} | {m_rec.weight_kg || 60} kg</span>
                              </div>
                              <div className="flex justify-between text-[11px] border-b border-[#F1F5F9] pb-1">
                                <span className="text-slate-450 font-medium font-sans">Tetanus Toxoid Dose:</span>
                                <span className="font-bold text-rose-600">TT{m_rec.tetanus_toxoid_doses || 1} Received</span>
                              </div>
                              <div className="flex justify-between text-[11px] border-b border-[#F1F5F9] pb-1">
                                <span className="text-slate-450 font-medium font-sans">Ferrous Sulfate Intake:</span>
                                <span className="font-bold text-slate-800 font-mono">{m_rec.ferrous_sulfate_tablets || 90} Tablets Logged</span>
                              </div>
                              <div className="flex justify-between text-[11px] border-b border-[#F1F5F9] pb-1">
                                <span className="text-slate-450 font-medium font-sans">Calcium Supplements:</span>
                                <span className="font-bold text-slate-800 font-mono">{m_rec.calcium_supplements_tablets || 60} Tablets Logged</span>
                              </div>
                              {m_rec.actual_delivery_date && (
                                <div className="flex justify-between text-[11px] border-b border-[#F1F5F9] pb-1">
                                  <span className="text-emerald-700 font-bold">Delivery Date:</span>
                                  <span className="font-bold text-emerald-700 font-mono">{m_rec.actual_delivery_date}</span>
                                </div>
                              )}
                            </div>

                            <blockquote className="p-2 border-l-2 border-rose-200 bg-rose-50/50 text-[10px] italic text-rose-850 rounded">
                              Notes: "{m_rec.notes}"
                            </blockquote>

                            {/* Advanced prenatal follow up consultations logging sub-form */}
                            {m_rec.status === "Prenatal Tracking" && (
                              <div className="space-y-2 pt-1 border-t border-slate-100">
                                {isAddingPrenatalFollowup === m_rec.maternal_id ? (
                                  <form onSubmit={(e) => handlePrenatalFollowupSubmit(e, m_rec)} className="bg-slate-50 p-3 rounded-lg border border-[#E2E8F0] space-y-2.5">
                                    <span className="text-[10px] uppercase font-bold text-rose-700 block tracking-wide font-sans">New Prenatal Consultation</span>
                                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                      <div className="space-y-0.5 font-sans">
                                        <label className="text-[9px] uppercase font-semibold text-slate-500 block">Blood Pressure</label>
                                        <input
                                          type="text"
                                          value={prenatalFollowupInput.bloodPressure}
                                          onChange={(e) => setPrenatalFollowupInput({...prenatalFollowupInput, bloodPressure: e.target.value})}
                                          className="w-full bg-white border border-[#E2E8F0] rounded p-1 text-[11px]"
                                        />
                                      </div>
                                      <div className="space-y-0.5">
                                        <label className="text-[9px] uppercase font-semibold text-slate-500 block">Weight (kg)</label>
                                        <input
                                          type="text"
                                          value={prenatalFollowupInput.weight}
                                          onChange={(e) => setPrenatalFollowupInput({...prenatalFollowupInput, weight: e.target.value})}
                                          className="w-full bg-white border border-[#E2E8F0] rounded p-1 text-[11px]"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-sans">
                                      <div className="space-y-0.5">
                                        <label className="text-[9px] uppercase font-semibold text-slate-500 block">TT Dose</label>
                                        <select
                                          value={prenatalFollowupInput.tetanusToxoidDoses}
                                          onChange={(e) => setPrenatalFollowupInput({...prenatalFollowupInput, tetanusToxoidDoses: e.target.value})}
                                          className="w-full bg-white border border-[#E2E8F0] rounded p-1 text-[11px]"
                                        >
                                          <option value={`${m_rec.tetanus_toxoid_doses}`}>No Change ({m_rec.tetanus_toxoid_doses})</option>
                                          <option value={`${m_rec.tetanus_toxoid_doses + 1}`}>Add Dose (+1)</option>
                                        </select>
                                      </div>
                                      <div className="space-y-0.5">
                                        <label className="text-[9px] uppercase font-semibold text-slate-500 block">Add Ferrous Sulfate</label>
                                        <input
                                          type="number"
                                          value={prenatalFollowupInput.ferrousSulfateTablets}
                                          onChange={(e) => setPrenatalFollowupInput({...prenatalFollowupInput, ferrousSulfateTablets: e.target.value})}
                                          className="w-full bg-white border border-[#E2E8F0] rounded p-1 text-[11px]"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-0.5">
                                      <label className="text-[9px] uppercase font-semibold text-slate-500 block">Consultation Notes</label>
                                      <input
                                        type="text"
                                        placeholder="e.g. Healthy fetal heartbeats"
                                        value={prenatalFollowupInput.notes}
                                        onChange={(e) => setPrenatalFollowupInput({...prenatalFollowupInput, notes: e.target.value})}
                                        className="w-full bg-white border border-[#E2E8F0] rounded p-1 text-[11px]"
                                      />
                                    </div>
                                    <div className="flex justify-end gap-1 pt-1 text-[10px]">
                                      <button type="button" onClick={() => setIsAddingPrenatalFollowup(null)} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">Cancel</button>
                                      <button type="submit" className="px-2.5 py-0.5 bg-rose-600 text-white font-bold rounded shadow-xs">Save Visit</button>
                                    </div>
                                  </form>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsAddingPrenatalFollowup(m_rec.maternal_id);
                                      setPrenatalFollowupInput({
                                        bloodPressure: m_rec.blood_pressure || "120/80",
                                        weight: `${m_rec.weight_kg || 60}`,
                                        tetanusToxoidDoses: `${m_rec.tetanus_toxoid_doses || 1}`,
                                        ferrousSulfateTablets: "30",
                                        calciumSupplementsTablets: "30",
                                        notes: ""
                                      });
                                    }}
                                    className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold cursor-pointer transition-colors"
                                  >
                                    🩺 Log Prenatal Consultation / Refill meds
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Postpartum Timeline steps */}
                            {(m_rec.status === "Postpartum Monitoring" || m_rec.actual_delivery_date) ? (
                              <div className="bg-slate-50 p-3 rounded-lg border border-[#E2E8F0] space-y-2">
                                <span className="text-[9px] uppercase font-bold text-[#0B7886] block tracking-wider font-sans">Postpartum Checks Timeline (24h, 1w, 6w)</span>
                                <div className="space-y-2 font-sans text-slate-700">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-medium">24-Hour Check:</span>
                                    {m_rec.postpartum_visit_24h ? (
                                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">Done {m_rec.postpartum_visit_24h}</span>
                                    ) : (
                                      <button onClick={() => markPostpartumCheckpoint(m_rec, "24h")} className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 rounded text-[10px] font-bold cursor-pointer transition-colors">Mark Done</button>
                                    )}
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-medium">1-Week Check:</span>
                                    {m_rec.postpartum_visit_1w ? (
                                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">Done {m_rec.postpartum_visit_1w}</span>
                                    ) : (
                                      <button onClick={() => markPostpartumCheckpoint(m_rec, "1w")} className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 rounded text-[10px] font-bold cursor-pointer transition-colors">Mark Done</button>
                                    )}
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-medium">6-Week Check:</span>
                                    {m_rec.postpartum_visit_6w ? (
                                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">Done {m_rec.postpartum_visit_6w}</span>
                                    ) : (
                                      <button onClick={() => markPostpartumCheckpoint(m_rec, "6w")} className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 rounded text-[10px] font-bold cursor-pointer transition-colors">Mark Done</button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="pt-2">
                                <button
                                  type="button"
                                  onClick={() => recordRecordedDelivery(m_rec)}
                                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] uppercase cursor-pointer transition-colors shadow-xs"
                                >
                                  🍼 Record Delivery Success
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* COLUMN 3: NEWBORN METABOLIC SCREENING (RA 9288 COMPLIANCE) */}
                <div className="bg-yellow-50/10 border border-[#E2E8F0] p-4.5 rounded-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-4 font-sans text-xs">
                    <div className="flex justify-between items-center pb-2.5 border-b border-[#E2E8F0]">
                      <span className="font-bold text-[#1E293B] tracking-tight flex items-center gap-1.5 font-sans text-xs">
                        <Plus className="h-4.5 w-4.5 text-yellow-600 shrink-0" />
                        <span>RA 9288 Newborn Screening</span>
                      </span>
                      <button
                        onClick={() => setIsAddingNewbornScreening(!isAddingNewbornScreening)}
                        className="px-2.5 py-1 bg-yellow-50 hover:bg-yellow-500 text-yellow-600 hover:text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-all border border-yellow-200/50 font-sans"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Log Screen</span>
                      </button>
                    </div>

                    {isAddingNewbornScreening && (
                      <form onSubmit={handleNbsSubmit} className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] space-y-3 shadow-xs font-sans">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1 font-sans">
                            <label className="text-[10px] uppercase text-slate-500 font-bold block">Birth Date</label>
                            <input
                              type="date"
                              value={nbsInput.birthDate || selectedPatient.date_of_birth}
                              onChange={(e) => setNbsInput({...nbsInput, birthDate: e.target.value})}
                              className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1 font-sans">
                            <label className="text-[10px] uppercase text-slate-500 font-bold block">Hours post birth</label>
                            <input
                              type="number"
                              value={nbsInput.hoursAfterBirth}
                              onChange={(e) => setNbsInput({...nbsInput, hoursAfterBirth: e.target.value})}
                              className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block">Screen Date</label>
                          <input
                            type="date"
                            value={nbsInput.screeningDate}
                            onChange={(e) => setNbsInput({...nbsInput, screeningDate: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1 font-sans font-semibold font-sans">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block">Abnormal findings</label>
                          <input
                            type="text"
                            value={nbsInput.abnormalFindings}
                            onChange={(e) => setNbsInput({...nbsInput, abnormalFindings: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none"
                          />
                        </div>
                        
                        {/* BCG, Hepatitis B, Vitamin K status inside log */}
                        <div className="space-y-1.5 p-2 bg-slate-50 rounded border border-slate-100 font-sans">
                          <span className="text-[9px] uppercase font-bold text-slate-450 block font-sans">Administered Newborn Vaccines</span>
                          <div className="grid grid-cols-3 gap-2">
                            <label className="flex items-center gap-1 cursor-pointer text-[10px] font-sans text-slate-705">
                              <input type="checkbox" checked={nbsInput.bcg} onChange={(e) => setNbsInput({...nbsInput, bcg: e.target.checked})} className="rounded text-[#0B7886] cursor-pointer" />
                              <span>BCG</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer text-[10px] font-sans text-slate-705">
                              <input type="checkbox" checked={nbsInput.hepb} onChange={(e) => setNbsInput({...nbsInput, hepb: e.target.checked})} className="rounded text-[#0B7886] cursor-pointer" />
                              <span>HepB</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer text-[10px] font-sans text-slate-705">
                              <input type="checkbox" checked={nbsInput.vitaminK} onChange={(e) => setNbsInput({...nbsInput, vitaminK: e.target.checked})} className="rounded text-[#0B7886] cursor-pointer" />
                              <span>Vit K</span>
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end gap-1.5 text-[10px]">
                          <button type="button" onClick={() => setIsAddingNewbornScreening(false)} className="px-2 py-1 bg-slate-100 rounded text-slate-700 cursor-pointer font-bold font-sans">Cancel</button>
                          <button type="submit" className="px-2.5 py-1 bg-[#0B7886] text-white font-bold rounded cursor-pointer transition-colors shadow-xs font-sans">Confirm Log</button>
                        </div>
                      </form>
                    )}

                    {/* Automatic compliance status checker based on birth date */}
                    {(() => {
                      const dob = new Date(selectedPatient.date_of_birth);
                      const today = new Date("2026-06-20");
                      const hoursSinceBirth = Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60));
                      const hasNbs = newbornRecords.some(n => n.patient_id === selectedPatient.patient_id);
                      
                      // Filter checks to keep flags targeting newborn period (under 45 days)
                      const diffTime = Math.abs(today.getTime() - dob.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      if (diffDays > 45) return null;

                      const isOverdue = hoursSinceBirth > 72 && !hasNbs;
                      const isNearLimit = hoursSinceBirth >= 48 && hoursSinceBirth <= 72 && !hasNbs;
                      
                      if (isOverdue) {
                        return (
                          <div className="p-3 bg-red-50 text-red-750 gap-1.5 rounded-xl border border-red-200 text-[10.5px] space-y-1 animate-pulse font-sans">
                            <div className="flex items-center gap-1.5 font-extrabold uppercase tracking-wide">
                              <AlertTriangle className="h-4 w-4 shrink-0 text-red-650" />
                              <span>🚨 RA 9288 COMPLIANCE ALARM</span>
                            </div>
                            <p className="font-semibold text-red-650 leading-normal">
                              Newborn has exceeded the mandated 72-hour screening window since birth ({hoursSinceBirth} hours elapsed) without any logged screening record. Complete screening IMMEDIATELY!
                            </p>
                          </div>
                        );
                      } else if (isNearLimit) {
                        return (
                          <div className="p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-[10px] space-y-0.5 font-sans">
                            <div className="flex items-center gap-1.5 font-extrabold uppercase tracking-wide font-sans">
                              <Clock className="h-4 w-4 shrink-0 text-amber-600" />
                              <span>⚠️ SCREENING WINDOW ACTIVE</span>
                            </div>
                            <p className="font-semibold text-amber-650">
                              Infant is currently in the mandated 48 to 72 hour screening window ({hoursSinceBirth} hours elapsed). Screen as soon as possible.
                            </p>
                          </div>
                        );
                      } else if (!hasNbs) {
                        return (
                          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 text-[10px] space-y-0.5 font-sans font-sans">
                            <div className="flex items-center gap-1.5 font-extrabold uppercase tracking-wide">
                              <Clock className="h-4 w-4 shrink-0 text-blue-600" />
                              <span>👶 NEONATAL COMPLIANCE SAFE MONITOR</span>
                            </div>
                            <p className="font-semibold text-blue-600">
                              Scheduled for 48h to 72h window from birth. Time elapsed: {hoursSinceBirth} hours.
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <div className="space-y-2">
                      <span className="text-[10px] font-semibold uppercase text-slate-450 block font-sans">Screening Compliance logs</span>
                      {newbornRecords.filter(n => n.patient_id === selectedPatient.patient_id).length === 0 ? (
                        <p className="p-3 text-center bg-white/50 border border-[#E2E8F0] text-slate-500 rounded-lg text-[11px] italic font-sans font-semibold">
                          Not logged under newborn screening databases.
                        </p>
                      ) : (
                        newbornRecords
                          .filter(n => n.patient_id === selectedPatient?.patient_id)
                          .map((n_rec) => (
                            <div key={n_rec.screening_id} className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl space-y-3 shadow-xs">
                              <div className="flex justify-between items-center text-[10px] border-b border-[#F1F5F9] pb-2 font-sans">
                                <span className="font-bold text-yellow-700 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                                  <span>RA 9288 Screen Record</span>
                                </span>
                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase ${
                                  n_rec.screening_status === "Completed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-red-50 text-[#C53030] border-red-205"
                                }`}>
                                  {n_rec.hours_after_birth_screened > 72 && n_rec.screening_status === "Completed" ? "Non-Compliant (Over 72h)" : n_rec.screening_status}
                                </span>
                              </div>

                              <div className="space-y-1.5 font-sans text-slate-750">
                                <div className="flex justify-between text-[11px] border-b border-[#F1F5F9] pb-1 font-sans">
                                  <span className="text-slate-400 font-medium">Hours after birth screened:</span>
                                  <span className={`font-mono font-bold text-xs ${n_rec.hours_after_birth_screened > 72 ? "text-rose-600" : "text-[#0B7886]"}`}>
                                    {n_rec.hours_after_birth_screened || "Pending"} hrs
                                  </span>
                                </div>
                                <div className="flex justify-between text-[11px] border-b border-[#F1F5F9] pb-1 font-sans">
                                  <span className="text-slate-400 font-medium">Compliance Rating:</span>
                                  <span className={`font-bold font-sans text-[10px] ${n_rec.hours_after_birth_screened >= 48 && n_rec.hours_after_birth_screened <= 72 ? "text-emerald-700" : "text-amber-600"}`}>
                                    {n_rec.hours_after_birth_screened >= 48 && n_rec.hours_after_birth_screened <= 72 ? "✅ Mandated Window Compliance" : "⚠️ Out-of-window Screening (Outside 48-72h Range)"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-[11px] border-b border-[#F1F5F9] pb-1 font-sans">
                                  <span className="text-slate-400 font-medium">Analysis Findings:</span>
                                  <span className="text-slate-800 font-semibold font-mono">{n_rec.abnormal_findings}</span>
                                </div>
                              </div>

                              {/* Vaccine checks - permanently stored */}
                              <div className="bg-slate-50 p-2.5 rounded-lg border border-[#E2E8F0] space-y-1.5 text-[10px] font-sans">
                                <span className="text-[9px] text-slate-400 font-bold block uppercase font-sans">Permanently Saved Immunizations</span>
                                <div className="grid grid-cols-3 gap-1 text-center font-sans font-bold">
                                  <div className={`p-1 rounded-md text-[9px] border ${n_rec.bcg_given ? "bg-emerald-50 text-emerald-700 border-emerald-250 font-extrabold" : "bg-slate-105 text-slate-400 border-slate-20"}`}>BCG Vaccine</div>
                                  <div className={`p-1 rounded-md text-[9px] border ${n_rec.hepb_given ? "bg-emerald-50 text-emerald-700 border-emerald-250 font-extrabold" : "bg-slate-105 text-slate-400 border-slate-20"}`}>HepB Shot</div>
                                  <div className={`p-1 rounded-md text-[9px] border ${n_rec.vitamin_k_given ? "bg-emerald-50 text-emerald-700 border-emerald-250 font-extrabold" : "bg-slate-105 text-slate-400 border-slate-20"}`}>Vit K Drops</div>
                                </div>
                              </div>

                              {n_rec.screening_status === "Pending" && (
                                <button
                                  type="button"
                                  onClick={() => updateNbsScreenStatus(n_rec)}
                                  className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg text-[10px] uppercase cursor-pointer transition-colors shadow-xs"
                                >
                                  Mark NBS Completed
                                </button>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>

                {/* COLUMN 4: LONG-TERM TB TREATMENT MONITORING (DOTS CARE) */}
                <div className="bg-[#0B7886]/5 border border-[#E2E8F0] p-4.5 rounded-xl space-y-4 flex flex-col justify-between font-sans">
                  <div className="space-y-4 font-sans text-xs">
                    <div className="flex justify-between items-center pb-2.5 border-b border-[#E2E8F0]">
                      <span className="font-bold text-[#1E293B] tracking-tight flex items-center gap-1.5 font-sans text-xs">
                        <Activity className="h-4.5 w-4.5 text-[#0B7886] shrink-0" />
                        <span>Long-Term TB Treatment</span>
                      </span>
                      {treatments.filter(t => t.patient_id === selectedPatient.patient_id && t.status !== "Completed").length === 0 && (
                        <button
                          onClick={() => setIsAddingTreatment(!isAddingTreatment)}
                          className="px-2.5 py-1 bg-[#0B7886]/10 hover:bg-[#0B7886] text-[#0B7886] hover:text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-all border border-[#0B7886]/20 font-sans"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Enroll TB</span>
                        </button>
                      )}
                    </div>

                    {isAddingTreatment && (
                      <form onSubmit={handleTreatmentSubmit} className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] space-y-3 shadow-xs">
                        {treatmentError && <p className="text-[#C53030] text-[10px] font-bold font-sans">{treatmentError}</p>}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block font-sans">Start Date</label>
                          <input
                            type="date"
                            value={treatmentInput.startDate}
                            onChange={(e) => setTreatmentInput({...treatmentInput, startDate: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block">Phase 1 Medicine (Months 1 & 2)</label>
                          <input
                            type="text"
                            value={treatmentInput.medicinePhase1}
                            onChange={(e) => setTreatmentInput({...treatmentInput, medicinePhase1: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] uppercase text-slate-500 font-bold block">Phase 2 Medicine (Months 3 - 6)</label>
                          <input
                            type="text"
                            value={treatmentInput.medicinePhase2}
                            onChange={(e) => setTreatmentInput({...treatmentInput, medicinePhase2: e.target.value})}
                            className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1 font-sans">
                            <label className="text-[10px] uppercase text-slate-500 font-bold block">Next Follow-Up</label>
                            <input
                              type="date"
                              value={treatmentInput.nextFollowupDate}
                              onChange={(e) => setTreatmentInput({...treatmentInput, nextFollowupDate: e.target.value})}
                              className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-850 text-[11px] focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1 font-sans">
                            <label className="text-[10px] uppercase text-slate-500 font-bold block font-sans">Missed Visits</label>
                            <input
                              type="number"
                              value={treatmentInput.missedVisits}
                              onChange={(e) => setTreatmentInput({...treatmentInput, missedVisits: e.target.value})}
                              className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-slate-800 text-[11px] focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-1.5 text-[10px]">
                          <button type="button" onClick={() => setIsAddingTreatment(false)} className="px-2 py-1 bg-slate-100 rounded text-slate-700 cursor-pointer font-bold font-sans">Cancel</button>
                          <button type="submit" className="px-2.5 py-1 bg-[#0B7886] text-white font-bold rounded cursor-pointer transition-colors shadow-xs font-sans">Start Treatment</button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-2">
                      <span className="text-[10px] font-semibold uppercase text-slate-450 block font-sans">TB Therapy logs</span>
                      {treatments.filter(t => t.patient_id === selectedPatient.patient_id).length === 0 ? (
                        <p className="p-3 text-center bg-white/50 border border-[#E2E8F0] text-slate-500 rounded-lg text-[11px] italic font-sans font-semibold">
                          This patient is not enrolled in long-term TB treatment.
                        </p>
                      ) : (
                        treatments
                          .filter(t => t.patient_id === selectedPatient?.patient_id)
                          .map((t_rec) => {
                            const todayStr = "2026-06-20";
                            const isFollowupMissed = t_rec.status !== "Completed" && (new Date(t_rec.next_followup_date) < new Date(todayStr));
                            return (
                              <div key={t_rec.treatment_id} className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl space-y-3 shadow-xs">
                                {/* Status Badge header */}
                                <div className="flex justify-between items-center text-[10px] border-b border-[#F1F5F9] pb-2 font-sans">
                                  <span className={`px-2 py-0.5 font-bold rounded-full border uppercase ${
                                    t_rec.status === "Completed"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                                      : isFollowupMissed
                                        ? "bg-red-50 text-[#C53030] border-red-200 animate-pulse font-extrabold"
                                        : "bg-blue-50 text-[#0B7886] border-[#0B7886]/20"
                                  }`}>
                                    Status: {t_rec.status} {t_rec.status !== "Completed" && isFollowupMissed && " - OVERDUE VISIT"}
                                  </span>
                                  <span className="font-mono text-slate-400 font-bold text-[9px]">Started {t_rec.start_date}</span>
                                </div>

                                {/* Long-Term TB Treatment Flag missed visits alert banner */}
                                {t_rec.status !== "Completed" && (isFollowupMissed || t_rec.missed_visits > 0) && (
                                  <div className="p-2.5 bg-red-50 text-[#C53030] font-extrabold text-[10px] rounded-lg border border-red-200 flex items-start gap-1.5 animate-pulse font-sans font-semibold">
                                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#C53030]" />
                                    <div>
                                      <span className="block uppercase tracking-wider font-extrabold text-[9px]">🚨 Alert: Missed Follow-Up visit</span>
                                      <span className="font-semibold text-red-655 block leading-tight font-sans">
                                        {t_rec.missed_visits > 0 
                                          ? `Patient has missed ${t_rec.missed_visits} scheduled treatment consultations!`
                                          : `Overdue: Patient missed their expected TB monitoring follow-up on ${t_rec.next_followup_date}`}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Medication Schedule Details */}
                                <div className="space-y-1.5 text-slate-700 font-sans text-[11px]">
                                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
                                    <span className="text-[9px] uppercase font-semibold text-slate-450 font-mono tracking-wider font-semibold">Antituberculosis Regime Phases</span>
                                    <div className="space-y-0.5 text-[10.5px]">
                                      <p className="font-semibold text-slate-650 font-sans"><strong className="text-slate-800 font-bold">Phase 1 (Months 1 & 2):</strong> {t_rec.medicine_phase_1}</p>
                                      <p className="font-semibold text-slate-650 font-sans"><strong className="text-slate-800 font-bold">Phase 2 (Months 3 - 6):</strong> {t_rec.medicine_phase_2}</p>
                                    </div>
                                  </div>

                                  <div className="flex justify-between border-b border-[#F1F5F9] pb-1 font-sans">
                                    <span className="text-slate-400 font-medium">Last visit:</span>
                                    <span className="font-bold text-slate-800 font-mono">{t_rec.last_followup_date}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-[#F1F5F9] pb-1 font-sans">
                                    <span className="text-slate-400 font-medium">Next scheduled follow-up:</span>
                                    <span className={`font-bold font-mono ${isFollowupMissed ? "text-[#C53030]" : "text-slate-800"}`}>
                                      {t_rec.next_followup_date}
                                    </span>
                                  </div>
                                  <div className="flex justify-between border-b border-[#F1F5F9] pb-1 font-sans font-sans">
                                    <span className="text-slate-400 font-medium">Missed checks count:</span>
                                    <span className={`font-bold font-mono ${t_rec.missed_visits > 0 ? "text-[#C53030]" : "text-slate-800"}`}>
                                      {t_rec.missed_visits}
                                    </span>
                                  </div>
                                </div>

                                {/* Interactive TB follow up operations */}
                                {t_rec.status !== "Completed" && (
                                  <div className="space-y-1.5 pt-1 font-sans">
                                    <div className="grid grid-cols-2 gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateFollowup(t_rec, false)}
                                        className="py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[9px] uppercase cursor-pointer text-center font-mono shadow-xs transition-colors"
                                      >
                                        ✓ Log Follow-up
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateFollowup(t_rec, true)}
                                        className="py-1 px-2 bg-[#D32F2F] hover:bg-[#C62828] text-white font-bold rounded-lg text-[9px] uppercase cursor-pointer text-center font-mono shadow-xs transition-colors"
                                      >
                                        ⚠️ Tag Missed
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleCompleteTreatment(t_rec)}
                                      className="w-full py-1.5 bg-[#0B7886] hover:bg-[#0B7886]/90 text-white font-bold rounded-lg text-[9px] uppercase cursor-pointer text-center tracking-wider block font-sans transition-colors"
                                    >
                                      🏅 Conclude TB Therapy Successful
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient vaccinations index list */}
              <div className="bg-slate-50 p-4.5 rounded-xl border border-[#E2E8F0] space-y-2">
                <span className="text-xs font-bold text-[#1E293B] block uppercase font-sans">Stored Patient Immunization History</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="patient_imm_history_grid">
                  {vaccinations.filter(v => v.patient_id === selectedPatient.patient_id).length === 0 ? (
                    <p className="text-slate-400 py-3 text-center w-full italic md:col-span-2 font-sans font-medium">No vaccination entries logged.</p>
                  ) : (
                    vaccinations
                      .filter(v => v.patient_id === selectedPatient.patient_id)
                      .map((v_item) => (
                        <div key={v_item.vaccination_id} className="p-3 bg-white border border-[#E2E8F0] rounded-xl flex justify-between items-center text-xs shadow-xs transition-shadow hover:shadow-sm">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 font-sans">{v_item.vaccine_name} ({v_item.dose_number})</span>
                            <span className="text-[10px] text-slate-500 block font-sans font-medium">Administered {v_item.date_administered} // Batch: {v_item.batch_number}</span>
                          </div>
                          <span className="px-2.5 py-1 bg-[#0B7886]/10 text-[#0B7886] font-sans rounded-lg text-[10px] font-bold border border-[#0B7886]/20">Admin: {v_item.administered_by.replace("Nurse ", "")}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* ENHANCED QR MEDICAL ID SUMMARY CARD (STYLISH BRGY-LINK DISPLAY) */}
              <div className="bg-slate-50 p-5 rounded-xl border border-[#E2E8F0] space-y-4" id="qrcode_health_section">
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-2 font-sans">
                  <QrCode className="h-4.5 w-4.5 text-[#0B7886]" />
                  <span>EMERGENCY SECURE QR HEALTH CARD (RA 10173 READY)</span>
                </h4>
                
                <div className="flex flex-col md:flex-row gap-5 items-center justify-between" id="qr_card_box">
                  <div className="bg-white p-5 shadow-xs rounded-xl border border-[#E2E8F0] max-w-sm w-full space-y-4" id="printed_medical_id_card">
                    {/* ID Header */}
                    <div className="flex justify-between items-start pb-2 border-b border-[#E2E8F0]">
                      <div>
                        <span className="text-[8px] font-mono text-[#0B7886] uppercase tracking-widest font-bold">Republic of the Philippines</span>
                        <h5 className="text-[10px] font-bold text-slate-800 uppercase font-sans mt-0.5">Brgy. Junob Health Station</h5>
                      </div>
                      <span className="text-[8px] font-mono bg-red-50 text-[#C53030] p-1 rounded-md border border-red-100 font-bold">EMERGENCY ACCESS</span>
                    </div>

                    {/* Resident Card Details */}
                    <div className="flex gap-4 items-center">
                      {/* Fake QR code visualization container */}
                      <div className="p-2 bg-white rounded-lg justify-center items-center flex shrink-0 border border-[#E2E8F0] shadow-2xs">
                        <div className="p-0.5">
                          <svg className="h-16 w-16" viewBox="0 0 100 100">
                            {/* Reusable geometric grid resembling QR matrix */}
                            <path d="M0,0 h30 v30 h-30 z M70,0 h30 v30 h-30 z M0,70 h30 v30 h-30 z" fill="#0B7886" />
                            <path d="M10,10 h10 v10 h-10 z M80,10 h10 v10 h-10 z M10,80 h10 v10 h-10 z" fill="#ffffff" />
                            <path d="M35,5 h10 v20 h-10 z M50,15 h10 v30 h-10 z M15,35 h20 v10 h-20 z" fill="#1e293b" />
                            <path d="M65,35 h30 v5 h-30 z M65,45 h5 v5 h-5 z M75,45 h20 v15 h-20 z" fill="#0f172a" />
                            <path d="M35,55 h10 v20 h-10 z M55,55 h30 v10 h-30 z M45,80 h20 v10 h-20 z" fill="#1e293b" />
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-1 overflow-hidden font-sans">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Patient Member</span>
                        <span className="text-slate-800 text-xs font-bold leading-none block truncate">{selectedPatient.first_name} {selectedPatient.last_name}</span>
                        <span className="text-[9px] text-slate-500 block">DOB: {selectedPatient.date_of_birth} ({calculateAge(selectedPatient.date_of_birth)})</span>
                        <span className="text-[9px] text-[#0B7886] font-bold block font-mono">FSN: {selectedPatient.family_serial_number}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0] text-[9px] text-slate-500 space-y-1 font-sans">
                      <div>Blood: <span className="font-bold text-slate-700">{selectedPatient.blood_type}</span> // Zone: <span className="font-bold text-slate-700">{selectedPatient.zone}</span></div>
                      <div>Contact: <span className="font-bold text-[#0B7886]">{selectedPatient.contact_number}</span></div>
                    </div>
                  </div>

                  {/* Actions description info */}
                  <div className="space-y-3 max-w-md font-sans">
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      This QR summarizes essential health statistics securely for emergency medical retrieval. When scanned by responders, it safely displays blood types, immunizations history, and mothers details without granting entry to the primary system storage.
                    </p>
                    <div className="flex gap-2 text-[11px]" id="card_action_box">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800 rounded-lg border border-[#E2E8F0] cursor-pointer transition-colors font-bold shadow-2xs"
                      >
                        <Printer className="h-4.5 w-4.5 text-[#0B7886]" />
                        <span>Print Health Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Offline download simulated! Token file written: ${selectedPatient.qr_code_token}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B7886] hover:bg-[#09626C] text-white rounded-lg cursor-pointer transition-colors font-bold shadow-2xs"
                      >
                        <Download className="h-4.5 w-4.5" />
                        <span>Download QR Code Image</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

// Simple fallback icon
function UserXIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="17" x2="22" y1="8" y2="13" />
      <line x1="22" x2="17" y1="8" y2="13" />
    </svg>
  );
}