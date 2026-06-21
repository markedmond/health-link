/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
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
} from "../types";

// Base citizens from the video screenshots
export const initialPatients: Patient[] = [
  {
    patient_id: "001",
    family_serial_number: "FSN-2026-0081",
    last_name: "Santos",
    first_name: "Maria",
    middle_name: "Lopez",
    date_of_birth: "1981-05-14", // Age: ~45 in 2026
    sex: "Female",
    address: "Purok Antipolo, Barangay Junob, Dumaguete City",
    contact_number: "09551234567",
    mother_name: "Elena Lopez",
    blood_type: "O+",
    philhealth_member: "Yes",
    vaccination_status: "Fully Vaccinated",
    zone: "Purok Antipolo",
    qr_code_token: "MEMBER-Santos-Maria-001",
    created_at: "2026-01-10T08:30:00Z"
  },
  {
    patient_id: "002",
    family_serial_number: "FSN-2026-0112",
    last_name: "dela Cruz",
    first_name: "Juan",
    middle_name: "Ramos",
    date_of_birth: "1994-11-20", // Age: ~32 in 2026
    sex: "Male",
    address: "Purok Gumamela, Barangay Junob, Dumaguete City",
    contact_number: "09664532189",
    mother_name: "Clara Ramos",
    blood_type: "A+",
    philhealth_member: "Yes",
    vaccination_status: "Fully Vaccinated",
    zone: "Purok Gumamela",
    qr_code_token: "MEMBER-delaCruz-Juan-002",
    created_at: "2026-01-12T10:15:00Z"
  },
  {
    patient_id: "003",
    family_serial_number: "FSN-2026-0045",
    last_name: "Reyes",
    first_name: "Rosa",
    middle_name: "Santos",
    date_of_birth: "1968-08-05", // Age: ~58 in 2026
    sex: "Female",
    address: "Purok Hayahay, Barangay Junob, Dumaguete City",
    contact_number: "09157896431",
    mother_name: "Felicia Santos",
    blood_type: "B+",
    philhealth_member: "No",
    vaccination_status: "Partially Vaccinated",
    zone: "Purok Hayahay",
    qr_code_token: "MEMBER-Reyes-Rosa-003",
    created_at: "2026-01-20T14:45:00Z"
  },
  {
    patient_id: "004",
    family_serial_number: "FSN-2026-0210",
    last_name: "Garcia",
    first_name: "Pedro",
    middle_name: "Gomez",
    date_of_birth: "1997-03-12", // Age: ~29 in 2026
    sex: "Male",
    address: "Purok Kulo, Barangay Junob, Dumaguete City",
    contact_number: "09072468135",
    mother_name: "Teresa Gomez",
    blood_type: "AB+",
    philhealth_member: "Yes",
    vaccination_status: "Fully Vaccinated",
    zone: "Purok Kulo",
    qr_code_token: "MEMBER-Garcia-Pedro-004",
    created_at: "2026-01-25T09:00:00Z"
  },
  {
    patient_id: "005",
    family_serial_number: "FSN-2026-0335",
    last_name: "Mercado",
    first_name: "Ana",
    middle_name: "Castillo",
    date_of_birth: "1985-07-25", // Age: ~41 in 2026
    sex: "Female",
    address: "Purok Lunoy, Barangay Junob, Dumaguete City",
    contact_number: "09998676234",
    mother_name: "Alicia Castillo",
    blood_type: "O-",
    philhealth_member: "Yes",
    vaccination_status: "Unvaccinated",
    zone: "Purok Lunoy",
    qr_code_token: "MEMBER-Mercado-Ana-005",
    created_at: "2026-02-01T11:20:00Z"
  },
  {
    patient_id: "006",
    family_serial_number: "FSN-2026-0010",
    last_name: "Bautista",
    first_name: "Carlos",
    middle_name: "Pfeiffer",
    date_of_birth: "1959-01-18", // Age: ~67 in 2026
    sex: "Male",
    address: "Purok Makugihon, Barangay Junob, Dumaguete City",
    contact_number: "09267182930",
    mother_name: "Sofia Pfeiffer",
    blood_type: "A-",
    philhealth_member: "Yes",
    vaccination_status: "Fully Vaccinated",
    zone: "Purok Makugihon",
    qr_code_token: "MEMBER-Bautista-Carlos-006",
    created_at: "2026-02-05T08:00:00Z"
  },
  {
    patient_id: "007",
    family_serial_number: "FSN-2026-0158",
    last_name: "Torres",
    first_name: "Linda",
    middle_name: "Aquino",
    date_of_birth: "1991-10-30", // Age: ~35 in 2026
    sex: "Female",
    address: "Purok Matinabangon, Barangay Junob, Dumaguete City",
    contact_number: "09355670012",
    mother_name: "Imelda Aquino",
    blood_type: "O+",
    philhealth_member: "No",
    vaccination_status: "Partially Vaccinated",
    zone: "Purok Matinabangon",
    qr_code_token: "MEMBER-Torres-Linda-007",
    created_at: "2026-02-08T15:30:00Z"
  },
  {
    patient_id: "008",
    family_serial_number: "FSN-2026-0199",
    last_name: "Cruz",
    first_name: "Roberto",
    middle_name: "Villanueva",
    date_of_birth: "1974-06-15", // Age: ~52 in 2026
    sex: "Male",
    address: "Purok Antipolo, Barangay Junob, Dumaguete City",
    contact_number: "09172345678",
    mother_name: "Juana Villanueva",
    blood_type: "B-",
    philhealth_member: "Yes",
    vaccination_status: "Fully Vaccinated",
    zone: "Purok Antipolo",
    qr_code_token: "MEMBER-Cruz-Roberto-008",
    created_at: "2026-02-15T10:00:00Z"
  },
  // Pediatric Patients for Growth & Newborn screens
  {
    patient_id: "009",
    family_serial_number: "FSN-2026-0045",
    last_name: "Reyes",
    first_name: "Baby Boy Liam",
    middle_name: "Santos",
    date_of_birth: "2026-04-01", // Age: 2.5 months in Jun 2026
    sex: "Male",
    address: "Purok Hayahay, Barangay Junob, Dumaguete City",
    contact_number: "09157896431", // Rosa's contact (Mother/Guardian)
    mother_name: "Rosa Reyes",
    blood_type: "B+",
    philhealth_member: "No",
    vaccination_status: "Partially Vaccinated",
    zone: "Purok Hayahay",
    qr_code_token: "MEMBER-Reyes-Liam-009",
    created_at: "2026-04-01T12:00:00Z"
  },
  {
    patient_id: "010",
    family_serial_number: "FSN-2026-0501",
    last_name: "Santos",
    first_name: "Baby Girl Sofia",
    middle_name: "Esconde",
    date_of_birth: "2026-06-18", // Newborn
    sex: "Female",
    address: "Purok Antipolo, Barangay Junob, Dumaguete City",
    contact_number: "09551234567",
    mother_name: "Maria Santos",
    blood_type: "O+",
    philhealth_member: "Yes",
    vaccination_status: "Unvaccinated",
    zone: "Purok Antipolo",
    qr_code_token: "MEMBER-Santos-Sofia-010",
    created_at: "2026-06-18T05:30:00Z"
  }
];

export const initialVaccinations: VaccinationRecord[] = [
  {
    vaccination_id: "V001",
    patient_id: "001",
    patient_name: "Maria Santos",
    vaccine_name: "Pfizer-BioNTech",
    vaccine_type: "General Population",
    date_administered: "2026-05-15",
    next_schedule_date: "2026-11-15",
    dose_number: "Booster",
    administered_by: "Nurse Grace Lopez",
    batch_number: "PFZ-8812A",
    remarks: "Complied with booster shot."
  },
  {
    vaccination_id: "V002",
    patient_id: "002",
    patient_name: "Juan dela Cruz",
    vaccine_name: "Moderna",
    vaccine_type: "General Population",
    date_administered: "2026-04-20",
    next_schedule_date: "2026-10-20",
    dose_number: "2nd Dose",
    administered_by: "Dr. Ramon Santos",
    batch_number: "MRN-1994B",
    remarks: "Minor arm soreness reported."
  },
  {
    vaccination_id: "V003",
    patient_id: "003",
    patient_name: "Rosa Reyes",
    vaccine_name: "Sinovac",
    vaccine_type: "General Population",
    date_administered: "2026-06-10",
    next_schedule_date: "2026-07-10",
    dose_number: "1st Dose",
    administered_by: "Nurse Grace Lopez",
    batch_number: "SNC-5544",
    remarks: "Next dose scheduled in 1 month."
  },
  {
    vaccination_id: "V004",
    patient_id: "004",
    patient_name: "Pedro Garcia",
    vaccine_name: "Pfizer-BioNTech",
    vaccine_type: "General Population",
    date_administered: "2026-06-01",
    next_schedule_date: "2026-12-01",
    dose_number: "Booster",
    administered_by: "Dr. Ramon Santos",
    batch_number: "PFZ-1002C",
    remarks: "Booster complied."
  },
  {
    vaccination_id: "V005",
    patient_id: "006",
    patient_name: "Carlos Bautista",
    vaccine_name: "Moderna",
    vaccine_type: "General Population",
    date_administered: "2026-05-28",
    next_schedule_date: "2026-11-28",
    dose_number: "Booster",
    administered_by: "Nurse Grace Lopez",
    batch_number: "MRN-2009X",
    remarks: "Routine checking okay."
  },
  {
    vaccination_id: "V006",
    patient_id: "007",
    patient_name: "Linda Torres",
    vaccine_name: "Johnson & Johnson",
    vaccine_type: "General Population",
    date_administered: "2026-06-18",
    next_schedule_date: "2026-12-18",
    dose_number: "1st Dose",
    administered_by: "Nurse Grace Lopez",
    batch_number: "JNJ-5511B",
    remarks: "Adverse events monitoring okay."
  },
  {
    vaccination_id: "V007",
    patient_id: "008",
    patient_name: "Roberto Cruz",
    vaccine_name: "Pfizer-BioNTech",
    vaccine_type: "General Population",
    date_administered: "2026-05-05",
    next_schedule_date: "2026-11-05",
    dose_number: "2nd Dose",
    administered_by: "Dr. Ramon Santos",
    batch_number: "PFZ-0925",
    remarks: "Checkup complete."
  },
  {
    vaccination_id: "V008",
    patient_id: "009",
    patient_name: "Baby Boy Liam Reyes",
    vaccine_name: "BCG",
    vaccine_type: "Routine Infant",
    date_administered: "2026-04-02",
    next_schedule_date: "2026-05-15",
    dose_number: "1st Dose",
    administered_by: "Midwife Luiza Macapanas",
    batch_number: "BCG-2026-01",
    remarks: "Given at birth/infancy."
  }
];

export const initialTreatments: TreatmentRecord[] = [
  {
    treatment_id: "T001",
    patient_id: "002",
    patient_name: "Juan dela Cruz",
    treatment_type: "Tuberculosis (DOTS)",
    start_date: "2026-04-01",
    end_date: "2026-10-01",
    medicine_phase_1: "In Isoniazid/Rifampicin Phase 1 (2 months)",
    medicine_phase_2: "Pending Phase 2 (4 months)",
    last_followup_date: "2026-06-15",
    next_followup_date: "2026-07-15",
    missed_visits: 0,
    status: "Active"
  },
  {
    treatment_id: "T002",
    patient_id: "004",
    patient_name: "Pedro Garcia",
    treatment_type: "Hypertension Care",
    start_date: "2026-02-10",
    end_date: "2026-08-10",
    medicine_phase_1: "Amlodipine 5mg Daily",
    medicine_phase_2: "Metoprolol 50mg Daily",
    last_followup_date: "2026-06-05",
    next_followup_date: "2026-07-05",
    missed_visits: 1,
    status: "Missed"
  }
];

export const initialMaternalHealth: MaternalHealthRecord[] = [
  {
    maternal_id: "M001",
    patient_id: "005",
    patient_name: "Ana Mercado",
    lmp_date: "2025-10-15",
    expected_delivery_date: "2026-07-22",
    gravida: 2,
    para: 1,
    tetanus_toxoid_doses: 2,
    ferrous_sulfate_tablets: 140, // standard target is 180 tablets total prenatal
    calcium_supplements_tablets: 110,
    blood_pressure: "120/80",
    weight_kg: 68,
    status: "Prenatal Tracking",
    notes: "Requires standard iron supplements monitoring. Schedule regular checks."
  },
  {
    maternal_id: "M002",
    patient_id: "001",
    patient_name: "Maria Santos",
    lmp_date: "2025-09-08",
    expected_delivery_date: "2026-06-15",
    actual_delivery_date: "2026-06-18",
    gravida: 3,
    para: 2,
    tetanus_toxoid_doses: 2,
    ferrous_sulfate_tablets: 180,
    calcium_supplements_tablets: 150,
    postpartum_visit_24h: "2026-06-19",
    postpartum_visit_1w: "2026-06-25", // target date
    blood_pressure: "115/75",
    weight_kg: 62,
    status: "Postpartum Monitoring",
    notes: "Delivered healthy baby girl Sofia. Postpartum checking scheduled."
  }
];

export const initialGrowthRecords: ChildGrowthRecord[] = [
  {
    growth_id: "G001",
    patient_id: "009",
    patient_name: "Baby Boy Liam Reyes",
    measurement_date: "2026-05-15",
    age_months: 1,
    weight_kg: 4.8,
    height_cm: 54,
    nutritional_status: "Normal",
    who_zscore: 0.1,
    intervention_flag: false,
    remarks: "Growth aligned with WHO standards."
  },
  {
    growth_id: "G002",
    patient_id: "009",
    patient_name: "Baby Boy Liam Reyes",
    measurement_date: "2026-06-18",
    age_months: 2,
    weight_kg: 4.2, // normal for 2 months boy is around 4.9-6.3 kg. 4.2 kg is Underweight
    height_cm: 56,
    nutritional_status: "Underweight",
    who_zscore: -2.1,
    intervention_flag: true,
    remarks: "Alerted mother Rosa Reyes. Prescribed Vitamin drops and breastmilk schedule coordination."
  }
];

export const initialNewbornScreenings: NewbornScreeningRecord[] = [
  {
    screening_id: "N001",
    patient_id: "009",
    patient_name: "Baby Boy Liam Reyes",
    birth_date: "2026-04-01",
    screening_date: "2026-04-03", // 48 hours after birth
    hours_after_birth_screened: 48,
    screening_status: "Completed",
    abnormal_findings: "None - cleared of metabolic conditions.",
    bcg_given: true,
    hepb_given: true,
    vitamin_k_given: true,
    facility: "Dumaguete Provincial Hospital"
  },
  {
    screening_id: "N002",
    patient_id: "010",
    patient_name: "Baby Girl Sofia Santos",
    birth_date: "2026-06-18",
    screening_date: "", // Not yet screened
    hours_after_birth_screened: 0,
    screening_status: "Pending", // Target 48 to 72 hours.
    abnormal_findings: "N/A - awaiting screening appointment.",
    bcg_given: false,
    hepb_given: true,
    vitamin_k_given: true,
    facility: "Barangay Junob Health Center"
  }
];

export const initialSMSLogs: SMSLog[] = [
  {
    sms_id: "S001",
    patient_id: "003",
    recipient_name: "Rosa Reyes",
    recipient_number: "09157896431",
    message_content: "Barangay Junob Health: Normal reminder. Rosa, your child Liam has scheduled MMR vaccine on June 25, 2026. Please bring the immunization book.",
    message_type: "Reminder",
    date_sent: "2026-06-19 09:00",
    status: "Sent"
  },
  {
    sms_id: "S002",
    patient_id: "005",
    recipient_name: "Ana Mercado",
    recipient_number: "09998676234",
    message_content: "Barangay Junob Health Notification: Ana, your upcoming prenatal check with Midwife Luiza is scheduled on Monday June 22, 2026 at 9:00 AM.",
    message_type: "Reminder",
    date_sent: "2026-06-20 14:15",
    status: "Sent"
  },
  {
    sms_id: "S003",
    patient_id: "All",
    recipient_name: "Community Broadcast",
    recipient_number: "Multiple Recipients",
    message_content: "HEALTH ALERT: Due to elevated rainfall, let us safeguard our households from Dengue. Check standing water containers, conduct cleanup. Seek prompt checks if fever persists.",
    message_type: "Health Announcement",
    date_sent: "2026-06-15 08:00",
    status: "Sent"
  }
];

export const initialMedicines: MedicineStock[] = [
  {
    medicine_id: "M101",
    name: "Amlodipine",
    dosage: "5mg",
    category: "Cardiovascular",
    current_stock: 450,
    minimum_threshold: 100,
    unit: "tablets"
  },
  {
    medicine_id: "M102",
    name: "Losartan",
    dosage: "100mg",
    category: "Cardiovascular",
    current_stock: 380,
    minimum_threshold: 80,
    unit: "tablets"
  },
  {
    medicine_id: "M103",
    name: "Gliclazide",
    dosage: "80mg",
    category: "Antidiabetic",
    current_stock: 45, // Under threshold! Alert indicator shown
    minimum_threshold: 100,
    unit: "tablets"
  },
  {
    medicine_id: "M104",
    name: "Metoprolol",
    dosage: "50mg",
    category: "Cardiovascular",
    current_stock: 220,
    minimum_threshold: 70,
    unit: "tablets"
  },
  {
    medicine_id: "M105",
    name: "Vit B Complex",
    dosage: "Standard",
    category: "Vitamins",
    current_stock: 1200,
    minimum_threshold: 200,
    unit: "tablets"
  },
  {
    medicine_id: "M106",
    name: "Metformin (Melfamin)",
    dosage: "500mg",
    category: "Antidiabetic",
    current_stock: 650,
    minimum_threshold: 150,
    unit: "tablets"
  },
  {
    medicine_id: "M107",
    name: "Simvastatin",
    dosage: "20mg",
    category: "Cardiovascular",
    current_stock: 280,
    minimum_threshold: 80,
    unit: "tablets"
  },
  {
    medicine_id: "M108",
    name: "Cefuroxime (Cefurosine) Syrup",
    dosage: "250mg/5ml, 50ml",
    category: "Antibiotic",
    current_stock: 25,
    minimum_threshold: 30, // Low stock alert
    unit: "bottles"
  },
  {
    medicine_id: "M109",
    name: "Vitamin C (Ascorbic Acid) Drops",
    dosage: "100mg/ml, 15ml",
    category: "Vitamins",
    current_stock: 75,
    minimum_threshold: 20,
    unit: "bottles"
  },
  {
    medicine_id: "M110",
    name: "Cetirizine Drops",
    dosage: "10mg/ml, 10ml",
    category: "Respiratory",
    current_stock: 12, // Critical alert
    minimum_threshold: 25,
    unit: "bottles"
  },
  {
    medicine_id: "M111",
    name: "Cefalexin Drops",
    dosage: "100mg/ml, 10ml",
    category: "Antibiotic",
    current_stock: 40,
    minimum_threshold: 15,
    unit: "bottles"
  },
  {
    medicine_id: "M112",
    name: "Co-Amoxiclav",
    dosage: "625mg",
    category: "Antibiotic",
    current_stock: 500,
    minimum_threshold: 100,
    unit: "tablets"
  },
  {
    medicine_id: "M113",
    name: "Salbutamol Nebule",
    dosage: "2.5mg, 2.5ml",
    category: "Respiratory",
    current_stock: 35,
    minimum_threshold: 40, // Low stock alert
    unit: "nebules"
  },
  {
    medicine_id: "M114",
    name: "Lagundi",
    dosage: "300mg",
    category: "Respiratory",
    current_stock: 800,
    minimum_threshold: 150,
    unit: "tablets"
  }
];

export const initialAppointments: Appointment[] = [
  {
    appointment_id: "A001",
    patient_id: "003",
    patient_name: "Rosa Reyes",
    service_type: "Vaccination",
    scheduled_date: "2026-06-25",
    status: "Scheduled",
    contact_number: "09157896431",
    notes: "Liam MMR vaccine (at 1 year old)"
  },
  {
    appointment_id: "A002",
    patient_id: "005",
    patient_name: "Ana Mercado",
    service_type: "Prenatal Check",
    scheduled_date: "2026-06-22",
    status: "Scheduled",
    contact_number: "09998676234",
    notes: "3rd trimester prenatal check with Midwife Luiza"
  },
  {
    appointment_id: "A003",
    patient_id: "010",
    patient_name: "Baby Girl Sofia Santos",
    service_type: "Newborn Screening",
    scheduled_date: "2026-06-21", // today/near birth
    status: "Scheduled",
    contact_number: "09551234567",
    notes: "Urgent newborn screen alignment (within 72h mandate RA 9288)"
  },
  {
    appointment_id: "A004",
    patient_id: "002",
    patient_name: "Juan dela Cruz",
    service_type: "TB Followup",
    scheduled_date: "2026-06-15",
    status: "Completed",
    contact_number: "09664532189",
    notes: "Monthly DOTS follow-up check"
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    log_id: "AL-1001",
    user_name: "Midwife Luiza Macapanas",
    user_role: "Midwife",
    action: "Register Patient",
    details: "Registered newborn Baby Girl Sofia Santos (FSN-2026-0501)",
    timestamp: "2026-06-18 09:12"
  },
  {
    log_id: "AL-1002",
    user_name: "Nurse Grace Lopez",
    user_role: "Nurse",
    action: "Record Vaccination",
    details: "Logged Sinovac dose for patient Rosa Reyes (V-003)",
    timestamp: "2026-06-10T14:30:00Z"
  },
  {
    log_id: "AL-1003",
    user_name: "Dr. Ramon Santos",
    user_role: "Doctor",
    action: "Update Patient Record",
    details: "Updated growth record and flagged underweight for Baby Boy Liam Reyes",
    timestamp: "2026-06-18T11:05:00Z"
  }
];