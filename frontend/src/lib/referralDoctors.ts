export interface ReferralDoctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  diseaseCategory: "dementia" | "breast_cancer" | "malaria" | "anemia";
  diseaseLabel: string;
  hospital: string;
  city: string;
  state: string;
  location: string;
  experience: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  availability: string;
  consultationType: string;
  phone: string;
  email: string;
  badge: string;
  avatarColor: string;
  bio: string;
}

export const REFERRAL_DOCTORS: Record<string, ReferralDoctor[]> = {
  // ── DEMENTIA SPECIALISTS (3 Locations) ──────────────────────────────
  dementia: [
    {
      id: "doc-dem-1",
      name: "Dr. Ramesh Iyer",
      qualification: "MBBS, MD, DM (Neurology), AIIMS",
      specialization: "Senior Neurologist & Cognitive Disorder Specialist",
      diseaseCategory: "dementia",
      diseaseLabel: "Dementia & Cognitive Neurology",
      hospital: "Manipal Hospital",
      city: "Bengaluru",
      state: "Karnataka",
      location: "Bengaluru, Karnataka",
      experience: "18 Years Exp.",
      experienceYears: 18,
      rating: 4.9,
      reviewsCount: 142,
      availability: "Mon - Fri • 10:00 AM - 04:00 PM",
      consultationType: "In-Person & Teleconsultation",
      phone: "+91 98450 12345",
      email: "ramesh123@gmail.com",
      badge: "Chief Neurologist",
      avatarColor: "from-purple-600 to-indigo-600",
      bio: "Specializes in early-stage Alzheimer's detection, cognitive decline interventions, and advanced neuro-imaging interpretation.",
    },
    {
      id: "doc-dem-2",
      name: "Dr. Sunita Deshmukh",
      qualification: "MBBS, DNB (Neurology), Fellow Dementia Care (UK)",
      specialization: "Neuro-Geriatrician & Memory Disorder Specialist",
      diseaseCategory: "dementia",
      diseaseLabel: "Dementia & Cognitive Neurology",
      hospital: "Kokilaben Dhirubhai Ambani Hospital",
      city: "Mumbai",
      state: "Maharashtra",
      location: "Mumbai, Maharashtra",
      experience: "15 Years Exp.",
      experienceYears: 15,
      rating: 4.85,
      reviewsCount: 118,
      availability: "Mon - Sat • 11:00 AM - 05:00 PM",
      consultationType: "In-Clinic & Video Consultation",
      phone: "+91 98201 54321",
      email: "sunita.deshmukh@kokilabenhosp.com",
      badge: "Memory Care Specialist",
      avatarColor: "from-indigo-600 to-blue-600",
      bio: "Expert in neurodegenerative biomarkers, vascular dementia management, and geriatric neurological therapies.",
    },
    {
      id: "doc-dem-3",
      name: "Dr. Vikram Malhotra",
      qualification: "MBBS, MD (Medicine), DM (Neurology)",
      specialization: "Consultant Neurologist & Neuro-Imaging Specialist",
      diseaseCategory: "dementia",
      diseaseLabel: "Dementia & Cognitive Neurology",
      hospital: "Medanta - The Medicity",
      city: "Gurugram / New Delhi NCR",
      state: "Delhi NCR",
      location: "Gurugram / New Delhi NCR",
      experience: "14 Years Exp.",
      experienceYears: 14,
      rating: 4.9,
      reviewsCount: 96,
      availability: "Tue - Sun • 09:00 AM - 03:00 PM",
      consultationType: "Hospital OPD & Video Consult",
      phone: "+91 98110 98765",
      email: "vikram.malhotra@medanta.org",
      badge: "Neuro-Imaging Lead",
      avatarColor: "from-blue-600 to-cyan-600",
      bio: "Pioneer in MRI/PET structural brain analysis, cognitive rehabilitation, and precision therapeutic protocols.",
    },
  ],

  // ── BREAST CANCER SPECIALISTS (3 Locations) ─────────────────────────
  breast_cancer: [
    {
      id: "doc-bc-1",
      name: "Dr. Meenakshi Sundaram",
      qualification: "MBBS, MS (General Surgery), MCh (Surgical Oncology)",
      specialization: "Senior Breast Surgical Oncologist & Oncoplasty Lead",
      diseaseCategory: "breast_cancer",
      diseaseLabel: "Breast Oncology & Histopathology",
      hospital: "Apollo Cancer Centre",
      city: "Chennai",
      state: "Tamil Nadu",
      location: "Chennai, Tamil Nadu",
      experience: "19 Years Exp.",
      experienceYears: 19,
      rating: 4.95,
      reviewsCount: 210,
      availability: "Mon - Fri • 09:30 AM - 04:30 PM",
      consultationType: "In-Person & Comprehensive Second Opinion",
      phone: "+91 94440 23456",
      email: "meenakshi.sundaram@apollocancer.com",
      badge: "Senior Oncologist",
      avatarColor: "from-pink-600 to-rose-600",
      bio: "Extensive expertise in malignant and benign histopathology, oncoplastic breast surgery, and customized treatment planning.",
    },
    {
      id: "doc-bc-2",
      name: "Dr. Rajeshwar Rao",
      qualification: "MBBS, MD (Radiation Oncology), DNB",
      specialization: "Clinical & Radiation Oncologist",
      diseaseCategory: "breast_cancer",
      diseaseLabel: "Breast Oncology & Histopathology",
      hospital: "Basavatarakam Indo-American Cancer Hospital",
      city: "Hyderabad",
      state: "Telangana",
      location: "Hyderabad, Telangana",
      experience: "16 Years Exp.",
      experienceYears: 16,
      rating: 4.88,
      reviewsCount: 165,
      availability: "Mon - Sat • 10:00 AM - 05:00 PM",
      consultationType: "OPD & Video Consultation",
      phone: "+91 98490 87654",
      email: "rajeshwar.rao@indomedcancer.org",
      badge: "Clinical Oncology Lead",
      avatarColor: "from-rose-600 to-pink-600",
      bio: "Focuses on targeted precision radiation therapy, biopsy verification, and multi-disciplinary breast cancer care.",
    },
    {
      id: "doc-bc-3",
      name: "Dr. Aparna Sen",
      qualification: "MBBS, MD, DM (Medical Oncology), Tata Memorial Fellow",
      specialization: "Senior Medical Oncologist & Chemotherapy Specialist",
      diseaseCategory: "breast_cancer",
      diseaseLabel: "Breast Oncology & Histopathology",
      hospital: "Tata Medical Center",
      city: "Kolkata",
      state: "West Bengal",
      location: "Kolkata, West Bengal",
      experience: "13 Years Exp.",
      experienceYears: 13,
      rating: 4.92,
      reviewsCount: 135,
      availability: "Wed - Sun • 10:30 AM - 04:30 PM",
      consultationType: "In-Person Consultation",
      phone: "+91 98300 45678",
      email: "aparna.sen@tatamedcenter.in",
      badge: "Targeted Therapy Expert",
      avatarColor: "from-pink-500 to-purple-600",
      bio: "Expert in immunotherapy, systemic chemotherapy, genomic profiling, and long-term cancer survivorship support.",
    },
  ],

  // ── MALARIA SPECIALISTS (3 Locations) ───────────────────────────────
  malaria: [
    {
      id: "doc-mal-1",
      name: "Dr. Prathap Shenoy",
      qualification: "MBBS, MD (Internal Medicine), Fellow Tropical Infections",
      specialization: "Infectious Disease & Vector-Borne Infection Consultant",
      diseaseCategory: "malaria",
      diseaseLabel: "Infectious Diseases & Parasitology",
      hospital: "KMC Hospital",
      city: "Mangaluru",
      state: "Karnataka",
      location: "Mangaluru, Karnataka",
      experience: "14 Years Exp.",
      experienceYears: 14,
      rating: 4.9,
      reviewsCount: 182,
      availability: "Mon - Sat • 09:00 AM - 03:30 PM",
      consultationType: "In-Clinic & Emergency Consult",
      phone: "+91 98455 67890",
      email: "prathap.shenoy@kmchospital.com",
      badge: "Infectious Disease Specialist",
      avatarColor: "from-amber-600 to-orange-600",
      bio: "Specializes in Plasmodium falciparum/vivax blood smear diagnosis, resistant malaria management, and parasitic fever control.",
    },
    {
      id: "doc-mal-2",
      name: "Dr. Shalini Kulkarni",
      qualification: "MBBS, MD (Microbiology & Tropical Medicine), DTM&H",
      specialization: "Tropical Medicine Consultant & Clinical Parasitologist",
      diseaseCategory: "malaria",
      diseaseLabel: "Infectious Diseases & Parasitology",
      hospital: "Ruby Hall Clinic",
      city: "Pune",
      state: "Maharashtra",
      location: "Pune, Maharashtra",
      experience: "12 Years Exp.",
      experienceYears: 12,
      rating: 4.87,
      reviewsCount: 124,
      availability: "Mon - Fri • 10:00 AM - 04:00 PM",
      consultationType: "OPD & Video Consultation",
      phone: "+91 98220 34567",
      email: "shalini.kulkarni@rubyhall.com",
      badge: "Tropical Medicine Consultant",
      avatarColor: "from-orange-600 to-amber-600",
      bio: "Renowned researcher in blood cell morphology, vector transmission patterns, and rapid antimalarial therapeutic protocols.",
    },
    {
      id: "doc-mal-3",
      name: "Dr. Thomas Mathew",
      qualification: "MBBS, MD (General Medicine), Dip. Infectious Diseases",
      specialization: "Senior Consultant Physician & Tropical Health Lead",
      diseaseCategory: "malaria",
      diseaseLabel: "Infectious Diseases & Parasitology",
      hospital: "Aster Medcity",
      city: "Kochi",
      state: "Kerala",
      location: "Kochi, Kerala",
      experience: "17 Years Exp.",
      experienceYears: 17,
      rating: 4.91,
      reviewsCount: 148,
      availability: "Tue - Sun • 10:00 AM - 05:00 PM",
      consultationType: "Hospital OPD & Video Consult",
      phone: "+91 98470 12389",
      email: "thomas.mathew@astermedcity.com",
      badge: "Senior Consultant",
      avatarColor: "from-amber-500 to-yellow-600",
      bio: "Over 17 years treating acute febrile illnesses, severe complicated malaria, and endemic vector-borne conditions.",
    },
  ],

  // ── ANEMIA SPECIALISTS (3 Locations) ────────────────────────────────
  anemia: [
    {
      id: "doc-ane-1",
      name: "Dr. Anjali Jha",
      qualification: "MBBS, MD (Medicine), DM (Clinical Hematology), AIIMS",
      specialization: "Senior Consultant Hematologist & Bone Marrow Specialist",
      diseaseCategory: "anemia",
      diseaseLabel: "Clinical Hematology & Red Cell Disorders",
      hospital: "Sterling Hospital",
      city: "Ahmedabad",
      state: "Gujarat",
      location: "Ahmedabad, Gujarat",
      experience: "15 Years Exp.",
      experienceYears: 15,
      rating: 4.93,
      reviewsCount: 176,
      availability: "Mon - Sat • 10:00 AM - 04:30 PM",
      consultationType: "In-Person Consultation",
      phone: "+91 98250 67891",
      email: "anjali.jha@sterlinghospitals.com",
      badge: "Lead Hematologist",
      avatarColor: "from-rose-600 to-red-600",
      bio: "National expert in severe iron deficiency, hemolytic anemias, aplastic anemia, and bone marrow cellularity evaluation.",
    },
    {
      id: "doc-ane-2",
      name: "Dr. Harshvardhan Shekhawat",
      qualification: "MBBS, MD (General Medicine), DNB (Hematology)",
      specialization: "Consultant Physician & Nutritional Deficiency Specialist",
      diseaseCategory: "anemia",
      diseaseLabel: "Clinical Hematology & Red Cell Disorders",
      hospital: "Fortis Escorts Hospital",
      city: "Jaipur",
      state: "Rajasthan",
      location: "Jaipur, Rajasthan",
      experience: "13 Years Exp.",
      experienceYears: 13,
      rating: 4.86,
      reviewsCount: 112,
      availability: "Mon - Fri • 09:30 AM - 03:30 PM",
      consultationType: "OPD & Video Consultation",
      phone: "+91 98290 23456",
      email: "harshvardhan.s@fortishealthcare.com",
      badge: "Nutritional Anemia Lead",
      avatarColor: "from-red-600 to-rose-600",
      bio: "Expertise in microcytic vs macrocytic anemias, hemoglobinopathies, and therapeutic iron transfusion management.",
    },
    {
      id: "doc-ane-3",
      name: "Dr. Gurpreet Singh Sandhu",
      qualification: "MBBS, MD (Pathology & Transfusion Medicine), PGIMER",
      specialization: "Hematopathologist & Iron Metabolism Specialist",
      diseaseCategory: "anemia",
      diseaseLabel: "Clinical Hematology & Red Cell Disorders",
      hospital: "Max Super Speciality Hospital",
      city: "Mohali / Chandigarh",
      state: "Punjab",
      location: "Mohali / Chandigarh",
      experience: "16 Years Exp.",
      experienceYears: 16,
      rating: 4.9,
      reviewsCount: 130,
      availability: "Tue - Sun • 11:00 AM - 05:00 PM",
      consultationType: "In-Person & Teleconsultation",
      phone: "+91 98140 78901",
      email: "gurpreet.sandhu@maxhealthcare.com",
      badge: "Transfusion & Blood Specialist",
      avatarColor: "from-rose-500 to-pink-600",
      bio: "Specialist in chronic disease anemias, hemoglobin electrophoresis, and personalized hematologic interventions.",
    },
  ],
};

// Helper function to resolve doctors for a given category or disease string
export function getReferralDoctorsForDisease(diseaseString: string): ReferralDoctor[] {
  if (!diseaseString) return REFERRAL_DOCTORS.dementia;

  const lower = diseaseString.toLowerCase();
  if (lower.includes("dementia") || lower.includes("mri") || lower.includes("alzheimer")) {
    return REFERRAL_DOCTORS.dementia;
  }
  if (lower.includes("breast") || lower.includes("cancer") || lower.includes("histopathology")) {
    return REFERRAL_DOCTORS.breast_cancer;
  }
  if (lower.includes("malaria") || lower.includes("smear") || lower.includes("parasite")) {
    return REFERRAL_DOCTORS.malaria;
  }
  if (lower.includes("anemia") || lower.includes("iron") || lower.includes("hemoglobin") || lower.includes("blood")) {
    return REFERRAL_DOCTORS.anemia;
  }

  return REFERRAL_DOCTORS.dementia;
}
