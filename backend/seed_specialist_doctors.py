import uuid
from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.domain import Doctor
from app.core.security import get_password_hash

# Ensure all tables exist
Base.metadata.create_all(bind=engine)

DOCTOR_PROFILES = [
    # ── Dementia (3 Doctors) ──
    {
        "name": "Dr. Ramesh Iyer",
        "email": "ramesh123@gmail.com",
        "specialization": "Senior Neurologist & Cognitive Disorder Specialist",
        "license_number": "LIC-KA-NEURO-1001",
        "experience_years": 18.0,
        "bio": "Hospital: Manipal Hospital | Location: Bengaluru, Karnataka | Phone: +91 98450 12345 | Focus: Early Alzheimer's, cognitive rehabilitation, structural MRI brain analysis.",
    },
    {
        "name": "Dr. Sunita Deshmukh",
        "email": "sunita.deshmukh@kokilabenhosp.com",
        "specialization": "Neuro-Geriatrician & Memory Disorder Specialist",
        "license_number": "LIC-MH-NEURO-2002",
        "experience_years": 15.0,
        "bio": "Hospital: Kokilaben Dhirubhai Ambani Hospital | Location: Mumbai, Maharashtra | Phone: +91 98201 54321 | Focus: Neurodegenerative biomarkers, vascular dementia, geriatric memory care.",
    },
    {
        "name": "Dr. Vikram Malhotra",
        "email": "vikram.malhotra@medanta.org",
        "specialization": "Consultant Neurologist & Neuro-Imaging Specialist",
        "license_number": "LIC-DL-NEURO-3003",
        "experience_years": 14.0,
        "bio": "Hospital: Medanta - The Medicity | Location: Gurugram / New Delhi NCR | Phone: +91 98110 98765 | Focus: Advanced neuro-imaging interpretation, cognitive decline therapies.",
    },

    # ── Breast Cancer (3 Doctors) ──
    {
        "name": "Dr. Meenakshi Sundaram",
        "email": "meenakshi.sundaram@apollocancer.com",
        "specialization": "Senior Breast Surgical Oncologist",
        "license_number": "LIC-TN-ONCO-4004",
        "experience_years": 19.0,
        "bio": "Hospital: Apollo Cancer Centre | Location: Chennai, Tamil Nadu | Phone: +91 94440 23456 | Focus: Breast histopathology, oncoplastic surgery, malignant/benign diagnostic review.",
    },
    {
        "name": "Dr. Rajeshwar Rao",
        "email": "rajeshwar.rao@indomedcancer.org",
        "specialization": "Clinical & Radiation Oncologist",
        "license_number": "LIC-TG-ONCO-5005",
        "experience_years": 16.0,
        "bio": "Hospital: Basavatarakam Indo-American Cancer Hospital | Location: Hyderabad, Telangana | Phone: +91 98490 87654 | Focus: Precision radiotherapy, biopsy confirmation, multi-disciplinary oncology.",
    },
    {
        "name": "Dr. Aparna Sen",
        "email": "aparna.sen@tatamedcenter.in",
        "specialization": "Senior Medical Oncologist & Chemotherapy Specialist",
        "license_number": "LIC-WB-ONCO-6006",
        "experience_years": 13.0,
        "bio": "Hospital: Tata Medical Center | Location: Kolkata, West Bengal | Phone: +91 98300 45678 | Focus: Targeted therapies, genomic tumor analysis, systemic cancer management.",
    },

    # ── Malaria (3 Doctors) ──
    {
        "name": "Dr. Prathap Shenoy",
        "email": "prathap.shenoy@kmchospital.com",
        "specialization": "Infectious Disease & Vector-Borne Infection Consultant",
        "license_number": "LIC-KA-INFECT-7007",
        "experience_years": 14.0,
        "bio": "Hospital: KMC Hospital | Location: Mangaluru, Karnataka | Phone: +91 98455 67890 | Focus: Plasmodium blood smear parasitology, resistant malaria strains, acute fever.",
    },
    {
        "name": "Dr. Shalini Kulkarni",
        "email": "shalini.kulkarni@rubyhall.com",
        "specialization": "Tropical Medicine Consultant & Clinical Parasitologist",
        "license_number": "LIC-MH-TROPIC-8008",
        "experience_years": 12.0,
        "bio": "Hospital: Ruby Hall Clinic | Location: Pune, Maharashtra | Phone: +91 98220 34567 | Focus: Red blood cell morphology, vector transmission, rapid antimalarial protocols.",
    },
    {
        "name": "Dr. Thomas Mathew",
        "email": "thomas.mathew@astermedcity.com",
        "specialization": "Senior Consultant Physician & Tropical Health Lead",
        "license_number": "LIC-KL-MED-9009",
        "experience_years": 17.0,
        "bio": "Hospital: Aster Medcity | Location: Kochi, Kerala | Phone: +91 98470 12389 | Focus: Acute tropical infections, complicated malaria syndromes, travel medicine.",
    },

    # ── Anemia (3 Doctors) ──
    {
        "name": "Dr. Anjali Jha",
        "email": "anjali.jha@sterlinghospitals.com",
        "specialization": "Senior Consultant Hematologist & Bone Marrow Specialist",
        "license_number": "LIC-GJ-HEM-1010",
        "experience_years": 15.0,
        "bio": "Hospital: Sterling Hospital | Location: Ahmedabad, Gujarat | Phone: +91 98250 67891 | Focus: Severe nutritional anemia, hemolytic disorders, aplastic anemia, bone marrow study.",
    },
    {
        "name": "Dr. Harshvardhan Shekhawat",
        "email": "harshvardhan.s@fortishealthcare.com",
        "specialization": "Consultant Physician & Nutritional Deficiency Specialist",
        "license_number": "LIC-RJ-HEM-2020",
        "experience_years": 13.0,
        "bio": "Hospital: Fortis Escorts Hospital | Location: Jaipur, Rajasthan | Phone: +91 98290 23456 | Focus: Microcytic vs macrocytic anemia, iron deficiency therapies, CBC interpretation.",
    },
    {
        "name": "Dr. Gurpreet Singh Sandhu",
        "email": "gurpreet.sandhu@maxhealthcare.com",
        "specialization": "Hematopathologist & Iron Metabolism Specialist",
        "license_number": "LIC-PB-HEM-3030",
        "experience_years": 16.0,
        "bio": "Hospital: Max Super Speciality Hospital | Location: Mohali / Chandigarh | Phone: +91 98140 78901 | Focus: Chronic disease anemias, hemoglobinopathies, transfusion medicine.",
    },
]

def seed_specialist_doctors():
    db = SessionLocal()
    print("Seeding 12 Specialist Referral Doctors across different locations...")

    for d in DOCTOR_PROFILES:
        user = db.query(User).filter_by(email=d["email"]).first()
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                email=d["email"],
                hashed_password=get_password_hash("123456789"),
                role="DOCTOR",
                full_name=d["name"],
                is_active=True,
                is_verified=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"[+] Created doctor account: {d['name']} ({d['email']})")

        doc = db.query(Doctor).filter_by(user_id=user.id).first()
        if not doc:
            doc = Doctor(
                id=str(uuid.uuid4()),
                user_id=user.id,
                specialization=d["specialization"],
                license_number=d["license_number"],
                experience_years=d["experience_years"],
                bio=d["bio"],
            )
            db.add(doc)
            db.commit()
            print(f"[+] Created doctor profile: {d['name']} - {d['specialization']}")
        else:
            # Update fields
            doc.specialization = d["specialization"]
            doc.experience_years = d["experience_years"]
            doc.bio = d["bio"]
            db.commit()

    db.close()
    print("Successfully seeded all 12 specialist doctors!")

if __name__ == "__main__":
    seed_specialist_doctors()
