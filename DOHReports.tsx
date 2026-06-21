/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FileText, Printer, FileCheck, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { Patient, VaccinationRecord, MaternalHealthRecord, TreatmentRecord } from "../types";

interface DOHReportsProps {
  patients: Patient[];
  vaccinations: VaccinationRecord[];
  maternalRecords: MaternalHealthRecord[];
  treatments: TreatmentRecord[];
}

export default function DOHReports({
  patients,
  vaccinations,
  maternalRecords,
  treatments
}: DOHReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState("06"); // June 2026 default
  const [selectedZone, setSelectedZone] = useState("All");

  // Dynamic calculations based on state filters
  const getMetrics = () => {
    // filter vaccinations by month and zone
    const targetMonthStr = `2026-${selectedMonth}`;
    
    const filteredVaccines = vaccinations.filter(v => {
      const matchMonth = v.date_administered.startsWith(targetMonthStr);
      const patient = patients.find(p => p.patient_id === v.patient_id);
      const matchZone = selectedZone === "All" || (patient && patient.zone === selectedZone);
      return matchMonth && matchZone;
    });

    const bcgCount = filteredVaccines.filter(v => v.vaccine_name === "BCG").length;
    const hepbCount = filteredVaccines.filter(v => v.vaccine_name === "Hepatitis B" || v.vaccine_name === "Penta").length;
    const pentaCount = filteredVaccines.filter(v => v.vaccine_name === "Pentavalent").length;
    const opvCount = filteredVaccines.filter(v => v.vaccine_name === "OPV").length;
    const mrCount = filteredVaccines.filter(v => v.vaccine_name === "MR").length;
    const mmrCount = filteredVaccines.filter(v => v.vaccine_name === "MMR").length;

    // Maternal counts
    const matFiltered = maternalRecords.filter(m => {
      const patient = patients.find(p => p.patient_id === m.patient_id);
      const matchZone = selectedZone === "All" || (patient && patient.zone === selectedZone);
      return matchZone;
    });

    const prenatalTotal = matFiltered.filter(m => m.status === "Prenatal Tracking").length;
    const postpartumTotal = matFiltered.filter(m => m.status === "Postpartum Monitoring" || m.actual_delivery_date).length;
    
    // Live Births
    const liveBirthsAttended = matFiltered.filter(m => m.actual_delivery_date && m.actual_delivery_date.startsWith(targetMonthStr)).length;

    // TB Cases under DOTS
    const tbActive = treatments.filter(t => {
      const patient = patients.find(p => p.patient_id === t.patient_id);
      const matchZone = selectedZone === "All" || (patient && patient.zone === selectedZone);
      return t.treatment_type === "Tuberculosis (DOTS)" && t.status === "Active" && matchZone;
    }).length;

    return {
      bcgCount,
      hepbCount,
      pentaCount,
      opvCount,
      mrCount,
      mmrCount,
      prenatalTotal,
      postpartumTotal,
      liveBirthsAttended,
      tbActive
    };
  };

  const metrics = getMetrics();

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-h-full overflow-y-auto pb-8 pr-1" id="reports_view">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 border border-slate-850 rounded-xl mt-1">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white tracking-tight">DOH Government FHSIS Report Generator</h2>
          <p className="text-xs text-slate-400">Compile DOH-compliant health statistics reports in under 2 minutes</p>
        </div>

        <button
          onClick={handlePrintReport}
          className="bg-teal-555 hover:bg-teal-600 border-none px-4 py-2 text-xs font-semibold rounded-lg text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-900/10 transition-colors"
          id="btn_print_doh_report"
        >
          <Printer className="h-4.5 w-4.5" />
          <span>Generate Print Copy (PDF)</span>
        </button>
      </div>

      {/* Parameter Filter Selector Card */}
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl space-y-3" id="filters_doh">
        <span className="text-[10px] font-bold text-teal-400 tracking-wider block">Set compilation scope parameters</span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold block">Reporting month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-150 text-xs focus:outline-none cursor-pointer"
            >
              <option value="01">January 2026</option>
              <option value="02">February 2026</option>
              <option value="03">March 2026</option>
              <option value="04">April 2026</option>
              <option value="05">May 2026</option>
              <option value="06">June 2026 (Active)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold block">Purok segmentation</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-150 text-xs focus:outline-none cursor-pointer"
            >
              <option value="All">All Puroks (Barangay Junob)</option>
              <option value="Purok Antipolo">Purok Antipolo</option>
              <option value="Purok Gumamela">Purok Gumamela</option>
              <option value="Purok Hayahay">Purok Hayahay</option>
              <option value="Purok Kulo">Purok Kulo</option>
              <option value="Purok Lunoy">Purok Lunoy</option>
              <option value="Purok Makugihon">Purok Makugihon</option>
              <option value="Purok Matinabangon">Purok Matinabangon</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold block">National submission target</label>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-700 text-xs text-slate-205 flex items-center justify-between font-mono">
              <span className="text-teal-400 font-bold text-xs">FHSIS M-1 form</span>
              <span>Due: Month + 5 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLIANT HIGH-FIDELITY PRINT FORMAT SHEETS */}
      <div className="bg-white text-slate-900 p-8 shadow-2xl rounded-xl border border-slate-300 max-w-3xl mx-auto space-y-6" id="doh_fsis_print_layout">
        {/* Document Header */}
        <div className="text-center space-y-1.5 pb-4 border-b-2 border-slate-950 font-serif">
          <div className="text-[10px] font-sans font-bold tracking-wider text-slate-500">Republic of the Philippines</div>
          <h1 className="text-sm font-bold leading-none text-slate-900">Department of Health</h1>
          <h2 className="text-xs font-bold text-slate-800">Field Health Service Information System</h2>
          <h3 className="text-xs font-bold italic tracking-wide text-slate-600 mt-1">Monthly Health Services Report (FHSIS M-1)</h3>
          <p className="text-[10px] font-sans text-slate-500 font-mono tracking-wide pt-1">
            Reporting Area: <strong className="text-slate-950 text-xs font-sans">Brgy. Junob Health Center</strong> // Dumaguete City
          </p>
        </div>

        {/* Scope parameters info row */}
        <div className="grid grid-cols-2 text-[10px] font-mono text-slate-600 border-b border-slate-200 pb-3">
          <div>Reporting period: <strong className="text-slate-900 font-sans text-xs">June 2026</strong></div>
          <div className="text-right">Purok segment: <strong className="text-slate-900 font-sans text-xs">{selectedZone === "All" ? "All Puroks" : selectedZone}</strong></div>
        </div>

        {/* SECTION A: PPI PREVENTIVE PEDIATRIC IMMUNIZATION */}
        <div className="space-y-3 font-serif">
          <h4 className="text-xs font-bold py-1 px-2.5 bg-slate-100 border-l-4 border-slate-900 text-slate-900">
            Section 1: Preventive Pediatric Immunization (FHSIS-PPI)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-300 rounded overflow-hidden">
              <div className="bg-slate-50 p-2 font-bold border-b border-slate-300 text-[10px] text-slate-700">Routine Infants Antigens</div>
              
              <div className="divide-y divide-slate-200">
                <div className="p-2.5 flex justify-between bg-white text-[11px] font-medium text-slate-750">
                  <span>BCG (Tuberculosis vaccine)</span>
                  <span className="font-mono text-slate-900 font-bold">{metrics.bcgCount || 0} infants</span>
                </div>
                <div className="p-2.5 flex justify-between bg-white text-[11px] font-medium text-slate-750">
                  <span>Hepatitis B (Penta Combo / Monovalent)</span>
                  <span className="font-mono text-slate-900 font-bold">{metrics.hepbCount || 0} infants</span>
                </div>
                <div className="p-2.5 flex justify-between bg-white text-[11px] font-medium text-slate-750">
                  <span>DPT-HepB-Hib Pentavalent (Fully Immunized)</span>
                  <span className="font-mono text-slate-900 font-bold">{metrics.pentaCount || 0} infants</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-300 rounded overflow-hidden">
              <div className="bg-slate-50 p-2 font-bold border-b border-slate-300 text-[10px] text-slate-700">Polio & Measles Antigens</div>

              <div className="divide-y divide-slate-200">
                <div className="p-2.5 flex justify-between bg-white text-[11px] font-medium text-slate-750 font-serif">
                  <span>Oral Polio Vaccine (OPV/IPV)</span>
                  <span className="font-mono text-slate-900 font-bold">{metrics.opvCount || 0} infants</span>
                </div>
                <div className="p-2.5 flex justify-between bg-white text-[11px] font-medium text-slate-750">
                  <span>Measles-Rubella (MR) at 9 Mos</span>
                  <span className="font-mono text-slate-900 font-bold">{metrics.mrCount || 0} infants</span>
                </div>
                <div className="p-2.5 flex justify-between bg-white text-[11px] font-medium text-slate-750">
                  <span>MMR (Measles, Mumps, Rubella) at 12 Mos</span>
                  <span className="font-mono text-slate-900 font-bold">{metrics.mmrCount || 0} infants</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION B: MATERNAL & CHILD TARGETS */}
        <div className="space-y-3 font-serif">
          <h4 className="text-xs font-bold py-1 px-2.5 bg-slate-100 border-l-4 border-slate-900 text-slate-900">
            Section 2: Maternal Care, Long-Term DOTS & Birth Registries
          </h4>

          <div className="border border-slate-300 rounded overflow-hidden text-xs">
            <div className="bg-slate-50 p-2 font-bold border-b border-slate-300 text-[10px] text-slate-700">Maternal & Public Health Indices</div>
            
            <div className="divide-y divide-slate-200">
              <div className="p-2.5 flex justify-between bg-white text-[11px] font-medium text-slate-750">
                <span>Total Pregnant Patients Active under Prenatal Care</span>
                <span className="font-mono text-slate-900 font-bold">{metrics.prenatalTotal || 0} mothers</span>
              </div>
              <div className="p-2.5 flex justify-between bg-white text-[11px] font-medium text-slate-750">
                <span>Mothers Enrolled in Postpartum Monitoring</span>
                <span className="font-mono text-slate-900 font-bold">{metrics.postpartumTotal || 0} monitors</span>
              </div>
              <div className="p-2.5 flex justify-between bg-white text-[11px] font-medium text-slate-750">
                <span>Live Births Attended at Health Facility / Home</span>
                <span className="font-mono text-slate-900 font-bold">{metrics.liveBirthsAttended || 0} live births</span>
              </div>
              <div className="p-2.5 flex justify-between bg-white text-[11px] font-medium text-slate-750">
                <span>Active Tuberculosis Cases monitored under Direct Therapy</span>
                <span className="font-mono text-slate-900 font-bold">{metrics.tbActive || 0} cases</span>
              </div>
            </div>
          </div>
        </div>

        {/* OFFICIAL SIGNATURE BLOCK */}
        <div className="pt-12 text-[10px] font-serif border-t border-slate-300">
          <div className="text-center font-sans tracking-widest text-[#5F6368] text-[8px] mb-10">Validation & submission endorsements</div>
          <div className="grid grid-cols-2 gap-12">
            <div className="text-center space-y-1">
              <div className="border-b border-slate-900 mx-auto w-40 h-5" />
              <div className="font-bold text-slate-950 font-sans text-[10px] tracking-wide">Midwife Luiza Macapanas</div>
              <div className="text-slate-500 font-sans tracking-wide">RHU Midwife Coordinator, PRC-057812</div>
            </div>

            <div className="text-center space-y-1">
              <div className="border-b border-slate-900 mx-auto w-40 h-5" />
              <div className="font-bold text-slate-950 font-sans text-[10px] tracking-wide">Hon. Reynaldo Santos</div>
              <div className="text-slate-500 font-sans tracking-wide">Barangay Captain // Brgy. Junob</div>
            </div>
          </div>
        </div>

        <div className="text-center text-[8px] text-slate-400 font-sans tracking-widest border-t border-slate-100 pt-3">
          System identified verification code: SECURE-FHSIS-2026-JUNOB
        </div>
      </div>
    </div>
  );
}