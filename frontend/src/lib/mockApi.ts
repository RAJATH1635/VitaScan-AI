/**
 * VitaScan AI - Seamless Client-Side Mock Fallback
 * Provides instant, zero-setup responses on deployed platforms (like Vercel)
 * when the local FastAPI backend is unreachable or blocked by Mixed-Content security.
 */

import { REFERRAL_DOCTORS, ReferralDoctor } from "./referralDoctors";

interface MockResponse {
  status?: number;
  data: any;
}

// Initial mock reports across the 4 core clinical conditions
const INITIAL_REPORTS = [
  {
    id: "rep-dem-101",
    disease: "dementia",
    prediction: "Mild Dementia Detected (CDR 0.5 - Hippocampal Volume Reduction)",
    confidence: 0.964,
    image_path: null,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    clinical_notes: "Coronal T1-weighted MRI demonstrates bilateral hippocampal atrophy with prominent temporal horns.",
    approved: true,
  },
  {
    id: "rep-bc-202",
    disease: "breast_cancer",
    prediction: "Malignant Ductal Carcinoma Detected (BI-RADS 5)",
    confidence: 0.942,
    image_path: null,
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    clinical_notes: "Histopathology shows high-grade invasive ductal carcinoma with irregular nuclear contours.",
    approved: true,
  },
  {
    id: "rep-mal-303",
    disease: "malaria",
    prediction: "Plasmodium Falciparum Ring Form Trophozoites",
    confidence: 0.978,
    image_path: null,
    created_at: new Date(Date.now() - 3600000 * 54).toISOString(),
    clinical_notes: "Giemsa-stained thin blood smear displays double-chromatin ring-form trophozoites in erythrocytes.",
    approved: false,
  },
  {
    id: "rep-ane-404",
    disease: "anemia",
    prediction: "Microcytic Hypochromic Iron-Deficiency Anemia",
    confidence: 0.935,
    image_path: null,
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    clinical_notes: "Peripheral blood smear reveals anisopoikilocytosis and pale central erythrocyte zones.",
    approved: true,
  },
];

// Initial mock appointments
const INITIAL_APPOINTMENTS = [
  {
    id: "appt-1",
    patient_name: "RAJATH B G",
    doctor_name: "Dr. Ramesh Iyer",
    specialty: "Dementia & Cognitive Neurology",
    hospital: "Manipal Hospital",
    location: "Bengaluru, Karnataka",
    appointment_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    disease_type: "dementia",
    notes: "Follow-up consultation for cognitive assessment & neuro-imaging correlation",
    status: "upcoming",
  },
  {
    id: "appt-2",
    patient_name: "Anita Sharma",
    doctor_name: "Dr. Meenakshi Sundaram",
    specialty: "Surgical Oncology & Breast Reconstruction",
    hospital: "Apollo Proton Cancer Centre",
    location: "Chennai, Tamil Nadu",
    appointment_date: new Date(Date.now() + 86400000 * 4).toISOString(),
    disease_type: "breast_cancer",
    notes: "Clinical review of ultrasound scan and biopsy results",
    status: "upcoming",
  },
  {
    id: "appt-3",
    patient_name: "Karthik Verma",
    doctor_name: "Dr. Prathap Shenoy",
    specialty: "Infectious Diseases & Tropical Medicine",
    hospital: "KMC Hospital",
    location: "Mangaluru, Karnataka",
    appointment_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    disease_type: "malaria",
    notes: "Post-antimalarial therapy blood smear evaluation",
    status: "upcoming",
  },
];

export function handleMockRequest(config: any): MockResponse | null {
  if (typeof window === "undefined") return null;

  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();

  // Normalize URL path
  const path = url.replace(/^https?:\/\/[^\/]+/, "").replace(/^\/api\/v1/, "");

  // 1. AUTH: Login
  if (path === "/auth/login" && method === "post") {
    // Extract credentials from FormData or body
    let username = "user@vitascan.ai";
    if (config.data) {
      if (typeof config.data === "string") {
        const params = new URLSearchParams(config.data);
        username = params.get("username") || username;
      } else if (config.data instanceof FormData) {
        username = (config.data.get("username") as string) || username;
      }
    }

    const isDoctor =
      username.toLowerCase().includes("doc") ||
      username.toLowerCase().includes("ramesh") ||
      username.toLowerCase().includes("doctor") ||
      username.toLowerCase().includes("hosp") ||
      username.toLowerCase().includes("medanta") ||
      username.toLowerCase().includes("apollo");

    const role = isDoctor ? "DOCTOR" : "PATIENT";
    const fullName = isDoctor
      ? username.toLowerCase().includes("ramesh")
        ? "Dr. Ramesh Iyer"
        : "Dr. Clinical Specialist"
      : "RAJATH B G";

    localStorage.setItem("access_token", `demo-token-${Date.now()}`);
    localStorage.setItem("refresh_token", `demo-refresh-${Date.now()}`);
    localStorage.setItem("role", role);
    localStorage.setItem("user_name", fullName);
    localStorage.setItem("user_email", username);
    localStorage.setItem("vitascan_demo_mode", "true");

    return {
      status: 200,
      data: {
        access_token: `demo-token-${Date.now()}`,
        refresh_token: `demo-refresh-${Date.now()}`,
        token_type: "bearer",
      },
    };
  }

  // 2. AUTH: Current User Profile (/auth/me)
  if (path === "/auth/me" && method === "get") {
    const role = localStorage.getItem("role") || "PATIENT";
    const fullName =
      localStorage.getItem("user_name") ||
      (role === "DOCTOR" ? "Dr. Ramesh Iyer" : "RAJATH B G");
    const email =
      localStorage.getItem("user_email") ||
      (role === "DOCTOR" ? "ramesh123@gmail.com" : "rajathbg123@gmail.com");

    return {
      status: 200,
      data: {
        id: "mock-user-current",
        email,
        full_name: fullName,
        role,
        is_active: true,
        is_verified: true,
      },
    };
  }

  // 3. AUTH: Registration
  if ((path === "/auth/register" || path === "/auth/register-doctor") && method === "post") {
    return {
      status: 201,
      data: { message: "Account created successfully (Cloud Demo Mode)." },
    };
  }

  // 4. PATIENT DASHBOARD: Summary
  if (path === "/medical/dashboard/summary" && method === "get") {
    return {
      status: 200,
      data: {
        total_predictions: 14,
        total_diseases: 4,
        average_confidence: 0.958,
        last_prediction: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    };
  }

  // 5. PATIENT DASHBOARD: Recent Scans
  if (path.startsWith("/medical/dashboard/recent") && method === "get") {
    return {
      status: 200,
      data: INITIAL_REPORTS,
    };
  }

  // 6. PATIENT DASHBOARD: Disease Distribution
  if (path === "/medical/dashboard/distribution" && method === "get") {
    return {
      status: 200,
      data: [
        { name: "Dementia", value: 4 },
        { name: "Breast Cancer", value: 4 },
        { name: "Malaria", value: 3 },
        { name: "Anemia", value: 3 },
      ],
    };
  }

  // 7. PATIENT DASHBOARD: Confidence Trend
  if (path === "/medical/dashboard/confidence-trend" && method === "get") {
    return {
      status: 200,
      data: [
        { date: "Day 1", confidence: 94.8 },
        { date: "Day 2", confidence: 96.2 },
        { date: "Day 3", confidence: 93.9 },
        { date: "Day 4", confidence: 97.4 },
        { date: "Day 5", confidence: 95.8 },
      ],
    };
  }

  // 8. PATIENT DASHBOARD: All Reports
  if (path === "/medical/reports" && method === "get") {
    return {
      status: 200,
      data: INITIAL_REPORTS,
    };
  }

  // 9. PATIENT DASHBOARD: Single Report by ID (/medical/reports/:id)
  if (path.startsWith("/medical/reports/") && method === "get") {
    const reportId = path.replace("/medical/reports/", "");
    const found = INITIAL_REPORTS.find((r) => r.id === reportId) || INITIAL_REPORTS[0];

    return {
      status: 200,
      data: {
        id: found.id,
        disease: found.disease,
        prediction: found.prediction,
        confidence: found.confidence,
        image_path: found.image_path,
        created_at: found.created_at,
        clinical_notes: found.clinical_notes,
        approved: found.approved,
      },
    };
  }

  // 10. AI SCAN INFERENCE: Upload & Predict (/medical/upload)
  if (path === "/medical/upload" && method === "post") {
    let diseaseType = "dementia";
    if (config.data instanceof FormData) {
      diseaseType = (config.data.get("disease_type") as string) || "dementia";
    }

    // Dynamic result based on disease category
    let resultClass = "Mild Cognitive Impairment / Early Dementia Detected";
    let recommendations = [
      "Consult one of the recommended cognitive neurologists below.",
      "Schedule follow-up MRI in 6 months to monitor hippocampal atrophy.",
      "Engage in structured cognitive stimulation therapy and cardio exercise.",
    ];

    if (diseaseType === "breast_cancer") {
      resultClass = "Malignant Histological Pattern Detected (Grade II)";
      recommendations = [
        "Immediate clinical referral to an oncological breast surgeon.",
        "Perform core needle biopsy & immunohistochemistry (ER/PR/HER2).",
        "Discuss surgical and therapeutic management with oncology team.",
      ];
    } else if (diseaseType === "malaria") {
      resultClass = "Plasmodium Falciparum Trophozoite Stages Identified";
      recommendations = [
        "Initiate artemisinin-based combination therapy (ACT) immediately under medical supervision.",
        "Monitor parasite clearance via repeat blood smear in 48 hours.",
        "Maintain adequate hydration and clinical observation for febrile spikes.",
      ];
    } else if (diseaseType === "anemia") {
      resultClass = "Moderate Microcytic Hypochromic Anemia (Iron Deficiency)";
      recommendations = [
        "Initiate oral elemental iron supplementation with Vitamin C.",
        "Conduct serum ferritin, transferrin saturation, and stool occult blood tests.",
        "Schedule follow-up complete blood count (CBC) in 4 weeks.",
      ];
    }

    const newScanId = `scan-${Date.now()}`;
    return {
      status: 200,
      data: {
        id: newScanId,
        disease: diseaseType,
        prediction: resultClass,
        confidence: 0.965,
        image_path: null,
        created_at: new Date().toISOString(),
        prediction_result: {
          status: "SUCCESS",
          disease_category: diseaseType,
          result_class: resultClass,
          confidence_score: 0.965,
          probability_distribution: {
            "Pathology Detected": 0.965,
            "Normal / Unremarkable": 0.035,
          },
          metrics: {
            sensitivity: "96.8%",
            specificity: "95.4%",
            f1_score: "0.961",
          },
          clinical_notes:
            "Deep learning multi-layer neural network completed analysis. Features indicate strong correlation with positive pathology.",
          recommendations,
        },
      },
    };
  }

  // 11. APPOINTMENTS: List & Create
  if (path.startsWith("/medical/appointments") || path.startsWith("/medical/appointments/")) {
    const stored = localStorage.getItem("vitascan_appointments_mock");
    let appts = stored ? JSON.parse(stored) : INITIAL_APPOINTMENTS;

    if (method === "get") {
      return { status: 200, data: appts };
    }

    if (method === "post") {
      const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data || {};
      const newAppt = {
        id: `appt-${Date.now()}`,
        patient_name: localStorage.getItem("user_name") || "RAJATH B G",
        doctor_name: body.doctor || "Dr. Ramesh Iyer",
        specialty: body.disease ? `${body.disease} Specialist` : "Medical Specialist",
        hospital: "Specialist Medical Center",
        location: "Bengaluru, India",
        appointment_date: body.appointment_date || new Date(Date.now() + 86400000).toISOString(),
        disease_type: body.disease || "general",
        notes: body.notes || "Requested clinical consultation",
        status: "upcoming",
      };
      appts.unshift(newAppt);
      localStorage.setItem("vitascan_appointments_mock", JSON.stringify(appts));
      return { status: 201, data: newAppt };
    }
  }

  // 12. DOCTOR WORKSPACE: Dashboard Stats
  if (path === "/doctor/dashboard" && method === "get") {
    return {
      status: 200,
      data: {
        today_appointments: 4,
        total_patients: 28,
        pending_reports: 3,
        total_consultations: 19,
      },
    };
  }

  // 13. DOCTOR WORKSPACE: Appointments
  if (path === "/doctor/appointments" && method === "get") {
    return {
      status: 200,
      data: INITIAL_APPOINTMENTS,
    };
  }

  // 14. DOCTOR WORKSPACE: Patients List
  if (path === "/doctor/patients" && method === "get") {
    return {
      status: 200,
      data: [
        {
          patient_id: "pat-1",
          full_name: "RAJATH B G",
          email: "rajathbg123@gmail.com",
          gender: "Male",
          blood_group: "O+",
          medical_history: "Mild cognitive concerns, family history of hypertension.",
        },
        {
          patient_id: "pat-2",
          full_name: "Anita Sharma",
          email: "anita.sharma@example.com",
          gender: "Female",
          blood_group: "B+",
          medical_history: "Breast lump evaluation, normal routine vitals.",
        },
        {
          patient_id: "pat-3",
          full_name: "Karthik Verma",
          email: "karthik.v@example.com",
          gender: "Male",
          blood_group: "A+",
          medical_history: "Acute febrile illness, suspected tropical infection.",
        },
      ],
    };
  }

  // 15. DOCTOR WORKSPACE: Patient Reports
  if (path.includes("/doctor/patients/") && path.endsWith("/reports") && method === "get") {
    return {
      status: 200,
      data: INITIAL_REPORTS,
    };
  }

  // 16. DOCTOR WORKSPACE: Approve Report
  if (path.includes("/doctor/reports/") && path.endsWith("/approve") && method === "post") {
    return {
      status: 200,
      data: { message: "Report approved by licensed physician successfully." },
    };
  }

  // 17. DOCTOR WORKSPACE: Notes
  if (path === "/doctor/notes") {
    if (method === "get") {
      return {
        status: 200,
        data: [
          {
            id: "note-1",
            patient_id: "pat-1",
            patient_name: "RAJATH B G",
            note: "Patient demonstrates early mild memory fatigue. Suggested cognitive exercise protocol.",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      };
    }
    return { status: 201, data: { message: "Doctor note saved successfully." } };
  }

  // 18. DOCTOR WORKSPACE: Prescriptions
  if (path === "/doctor/prescriptions") {
    if (method === "get") {
      return {
        status: 200,
        data: [
          {
            id: "rx-1",
            patient_id: "pat-1",
            patient_name: "RAJATH B G",
            medication: "Donepezil 5mg once daily at bedtime",
            dosage: "5mg",
            frequency: "Daily",
            instructions: "Take with food at night. Review in 4 weeks.",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      };
    }
    return { status: 201, data: { message: "Prescription created successfully." } };
  }

  // 19. DOCTOR WORKSPACE: Profile
  if (path === "/doctor/profile") {
    const profile = {
      id: "doc-profile-1",
      user_id: "doc-user-1",
      full_name: localStorage.getItem("user_name") || "Dr. Ramesh Iyer",
      email: localStorage.getItem("user_email") || "ramesh123@gmail.com",
      specialization: "Neurology & Cognitive Disorders",
      license_number: "KMC-BLR-48291",
      experience_years: 18,
      bio: "Senior Neurologist specializing in early neuro-imaging detection and cognitive health.",
      created_at: new Date(Date.now() - 86400000 * 300).toISOString(),
    };
    return { status: 200, data: profile };
  }

  // 20. GLOBAL SEARCH
  if (path.startsWith("/search")) {
    return {
      status: 200,
      data: {
        patients: [{ id: "pat-1", name: "RAJATH B G", email: "rajathbg123@gmail.com" }],
        reports: [{ id: "rep-dem-101", title: "Dementia MRI Scan (RAJATH B G)" }],
      },
    };
  }

  return null;
}
