/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "Admin" | "Doctor" | "Nurse" | "Midwife";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  licenseNumber: string;
}

export interface Patient {
  patient_id: string;
  family_serial_number: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  date_of_birth: string;
  sex: "Male" | "Female";
  address: string;
  contact_number: string;
  mother_name: string;
  blood_type: string;
  philhealth_member: "Yes" | "No";
  vaccination_status: "Fully Vaccinated" | "Partially Vaccinated" | "Unvaccinated";
  zone: string;
  qr_code_token: string;
  created_at: string;
  remarks?: string;
}

export interface VaccinationRecord {
  vaccination_id: string;
  patient_id: string;
  patient_name: string;
  vaccine_name: string; // e.g. "BCG", "Hepatitis B", "Pentavalent", "OPV", "PCV", "IPV", "MR", "MMR", "Pfizer-BioNTech", "Moderna", "Sinovac"
  vaccine_type: "Routine Infant" | "General Population" | "Senior Citizen";
  date_administered: string;
  next_schedule_date: string;
  dose_number: "1st Dose" | "2nd Dose" | "3rd Dose" | "Booster" | "N/A";
  administered_by: string;
  batch_number: string;
  remarks: string;
}

export interface TreatmentRecord {
  treatment_id: string;
  patient_id: string;
  patient_name: string;
  treatment_type: "Tuberculosis (DOTS)" | "Hypertension Care" | "Diabetes Control";
  start_date: string;
  end_date: string;
  medicine_phase_1: string; // 2 months
  medicine_phase_2: string; // 4 months
  last_followup_date: string;
  next_followup_date: string;
  missed_visits: number;
  status: "Active" | "Completed" | "Missed";
}

export interface MaternalHealthRecord {
  maternal_id: string;
  patient_id: string;
  patient_name: string;
  lmp_date: string;
  expected_delivery_date: string;
  actual_delivery_date?: string;
  gravida: number; // pregnancies
  para: number; // viable births
  tetanus_toxoid_doses: number;
  ferrous_sulfate_tablets: number; // target: 180 prenatal, 90 postpartum
  calcium_supplements_tablets: number;
  postpartum_visit_24h?: string; // date completed or empty
  postpartum_visit_1w?: string;
  postpartum_visit_6w?: string;
  blood_pressure: string;
  weight_kg: number;
  status: "Prenatal Tracking" | "Postpartum Monitoring" | "Completed";
  notes?: string;
}

export interface ChildGrowthRecord {
  growth_id: string;
  patient_id: string;
  patient_name: string;
  measurement_date: string;
  age_months: number;
  weight_kg: number;
  height_cm: number;
  nutritional_status: "Normal" | "Underweight" | "Severely Underweight" | "Stunted";
  who_zscore: number;
  intervention_flag: boolean;
  remarks: string;
}

export interface NewbornScreeningRecord {
  screening_id: string;
  patient_id: string;
  patient_name: string;
  birth_date: string;
  screening_date: string;
  hours_after_birth_screened: number; // target 48-72 hours
  screening_status: "Completed" | "Pending" | "Overdue";
  abnormal_findings: string;
  bcg_given: boolean;
  hepb_given: boolean;
  vitamin_k_given: boolean;
  facility: string;
}

export interface SMSLog {
  sms_id: string;
  patient_id: string;
  recipient_name: string;
  recipient_number: string;
  message_content: string;
  message_type: "Reminder" | "Health Announcement" | "Alert";
  date_sent: string;
  status: "Sent" | "Failed";
}

export interface MedicineStock {
  medicine_id: string;
  name: string;
  dosage: string;
  category: "Vaccine" | "Cardiovascular" | "Antidiabetic" | "Vitamins" | "Antibiotic" | "Respiratory";
  current_stock: number;
  minimum_threshold: number;
  unit: string;
}

export interface AuditLog {
  log_id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface Appointment {
  appointment_id: string;
  patient_id: string;
  patient_name: string;
  service_type: "Vaccination" | "Prenatal Check" | "Postpartum Check" | "TB Followup" | "Newborn Screening" | "General Consultation";
  scheduled_date: string;
  status: "Scheduled" | "Completed" | "No Show";
  contact_number: string;
  notes?: string;
}
