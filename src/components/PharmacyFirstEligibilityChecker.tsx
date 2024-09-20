"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./button"; // Adjust path according to your folder structure

// Updated Symptom List
const symptoms = [
  // Uncomplicated Urinary Tract Infections
  "painful urination",
  "frequent urination",
  "urgency to urinate",
  "lower abdominal pain",
  // Shingles
  "painful rash",
  "blisters",
  "tingling sensation",
  "skin sensitivity",
  // Impetigo
  "red sores",
  "blisters",
  "honey-colored crusts",
  // Infected Insect Bites
  "swelling",
  "redness",
  "itchiness",
  "warmth around bite",
  // Sinusitis
  "facial pain",
  "nasal discharge",
  "reduced sense of smell",
  "sinus pressure",
  // Sore Throat
  "sore throat",
  "difficulty swallowing",
  "swollen glands",
  "fever",
  // Acute Otitis Media
  "ear pain",
  "difficulty hearing",
  "fluid draining from ear",
  "fever",
  // Common symptoms across multiple conditions
  "headache",
  "fatigue",
  "body aches",
  "fever",
  "cough",
];

// Conditions and their related symptoms
const conditions = {
  "Urinary Tract Infection": [
    "painful urination",
    "frequent urination",
    "urgency to urinate",
    "lower abdominal pain",
  ],
  Shingles: [
    "painful rash",
    "blisters",
    "tingling sensation",
    "skin sensitivity",
  ],
  Impetigo: ["red sores", "blisters", "honey-colored crusts"],
  "Infected Insect Bite": [
    "swelling",
    "redness",
    "itchiness",
    "warmth around bite",
  ],
  Sinusitis: [
    "facial pain",
    "nasal discharge",
    "reduced sense of smell",
    "sinus pressure",
  ],
  "Sore Throat": [
    "sore throat",
    "difficulty swallowing",
    "swollen glands",
    "fever",
  ],
  "Acute Otitis Media": [
    "ear pain",
    "difficulty hearing",
    "fluid draining from ear",
    "fever",
  ],
};

// OTC Treatments and guidance on seeking medical attention
const treatmentData = {
  "Urinary Tract Infection": {
    otc: [
      "Increased water intake",
      "Pain relievers like ibuprofen",
      "Urinary alkalinizers (e.g., potassium citrate)",
    ],
    medical: [
      "Symptoms persist after 2-3 days",
      "Blood in urine",
      "Fever or back pain (potential kidney infection)",
    ],
  },
  Shingles: {
    otc: [
      "Calamine lotion",
      "Pain relievers like acetaminophen",
      "Cool compresses for blisters",
    ],
    medical: [
      "Rash near eyes or ears",
      "Severe pain",
      "Need for antiviral medications",
    ],
  },
  Impetigo: {
    otc: [
      "Gentle cleansing with soap and water",
      "Antibiotic ointments (e.g., Neosporin)",
      "Covering the area",
    ],
    medical: [
      "Infection spreads",
      "Needs oral antibiotics",
      "Fever or painful sores",
    ],
  },
  "Infected Insect Bite": {
    otc: ["Antihistamine creams", "Hydrocortisone cream", "Antiseptic creams"],
    medical: [
      "Severe allergic reaction",
      "Spreading redness",
      "Fever or flu-like symptoms",
    ],
  },
  Sinusitis: {
    otc: [
      "Nasal decongestant sprays",
      "Saline nasal irrigation",
      "Pain relievers like ibuprofen",
    ],
    medical: [
      "Symptoms last more than 10 days",
      "Severe symptoms or high fever",
      "Recurring sinusitis episodes",
    ],
  },
  "Sore Throat": {
    otc: [
      "Throat lozenges",
      "Saltwater gargling",
      "Pain relievers like ibuprofen",
    ],
    medical: [
      "Difficulty swallowing",
      "High fever",
      "Symptoms last more than a week",
    ],
  },
  "Acute Otitis Media": {
    otc: ["Pain relievers like ibuprofen", "Warm compress"],
    medical: [
      "Children under 6 months",
      "High fever or severe pain",
      "Symptoms last more than 2-3 days",
    ],
  },
};

export default function PharmacyFirstEligibilityChecker() {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [floatingWords, setFloatingWords] = useState<string[]>([]);
  const [condition, setCondition] = useState("");
  const [selectedMedication, setSelectedMedication] = useState("");
  const [userInputs, setUserInputs] = useState({
    age: "",
    gender: "",
    pregnant: false,
    conditions: [] as string[],
    medications: [] as string[],
  });
  const [isPharmacyFirstEligible, setIsPharmacyFirstEligible] = useState(false);
  const [result, setResult] = useState("");
  const [report, setReport] = useState<string | null>(null);

  // Floating words effect
  useEffect(() => {
    const interval = setInterval(() => {
      const randomSymptom =
        symptoms[Math.floor(Math.random() * symptoms.length)];
      setSelectedSymptoms((prev) => {
        if (prev.includes(randomSymptom)) {
          return prev.filter((word) => word !== randomSymptom);
        } else {
          return [...prev, randomSymptom];
        }
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Handle symptom click
  const handleWordClick = (word: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(word)
        ? prev.filter((symptom) => symptom !== word)
        : [...prev, word],
    );
  };

  // Determine condition based on selected symptoms
  const determineCondition = () => {
    let maxMatchCount = 0;
    let determinedCondition = "";

    for (const [conditionName, conditionSymptoms] of Object.entries(
      conditions,
    )) {
      const matchCount = conditionSymptoms.filter((symptom) =>
        selectedSymptoms.includes(symptom),
      ).length;
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        determinedCondition = conditionName;
      }
    }

    setCondition(determinedCondition || "Undetermined");
    setStep(3);
  };

  const generateReport = () => {
    if (!condition) return;

    const treatment = treatmentData[condition as keyof typeof treatmentData];

    const reportText = `
Pharmacy First Report:

- Condition: ${condition}
- Selected Symptoms: ${selectedSymptoms.join(", ")}
- Over-the-counter (OTC) Treatments: 
  ${treatment.otc.join("\n")}
- When to Seek Medical Attention:
  ${treatment.medical.join("\n")}
    `;

    setReport(reportText.trim());
  };

  const handleDownloadReport = () => {
    if (report) {
      const blob = new Blob([report], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pharmacy_first_report.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Pharmacy First Eligibility Checker
          </h1>

          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Select Your Symptoms
              </h2>
              <Button
                onClick={() => setStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
              >
                Start
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <AnimatePresence>
                {selectedSymptoms.map((word) => (
                  <motion.div
                    key={word}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={`px-3 py-1 rounded-full cursor-pointer text-sm font-medium ${selectedSymptoms.includes(word) ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"}`}
                    onClick={() => handleWordClick(word)}
                  >
                    {word}
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button
                onClick={determineCondition}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full"
              >
                Check Condition
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Report Generated
              </h2>
              <Button
                onClick={generateReport}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
              >
                Download Report
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
