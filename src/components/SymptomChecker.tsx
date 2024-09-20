import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Condition = 'UTI' | 'Shingles' | 'Impetigo' | 'InsectBite' | 'SoreThroat' | 'Sinusitis' | 'OtitisMedia';
type Gender = 'Male' | 'Female';

const symptoms: Record<Condition, string[]> = {
  UTI: ['Painful urination', 'Frequent urination', 'Urgency'],
  Shingles: ['Painful rash', 'Blisters', 'Tingling sensation'],
  Impetigo: ['Red sores', 'Blisters', 'Honey-colored crusts'],
  InsectBite: ['Swelling', 'Redness', 'Itching'],
  SoreThroat: ['Pain when swallowing', 'Swollen glands', 'Fever'],
  Sinusitis: ['Facial pain', 'Nasal discharge', 'Reduced sense of smell'],
  OtitisMedia: ['Ear pain', 'Difficulty hearing', 'Fever'],
};

const redFlags: Record<Condition, string[]> = {
  UTI: ['Blood in urine', 'Severe abdominal pain'],
  Shingles: ['Eye involvement', 'Widespread rash'],
  Impetigo: ['Fever', 'Swollen lymph nodes'],
  InsectBite: ['Difficulty breathing', 'Severe swelling'],
  SoreThroat: ['Difficulty breathing', 'Drooling'],
  Sinusitis: ['Severe headache', 'Visual changes'],
  OtitisMedia: ['Swelling behind the ear', 'Facial weakness'],
};

export default function SymptomChecker() {
  const [step, setStep] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [userInputs, setUserInputs] = useState({
    age: '',
    gender: '' as Gender,
    pregnant: false,
    redFlags: [] as string[],
  });
  const [result, setResult] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [gpType, setGpType] = useState<'surgery' | 'private' | null>(null);

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleConditionSelect = (condition: Condition) => {
    setSelectedCondition(condition);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setUserInputs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleRedFlagSelect = (flag: string) => {
    setUserInputs((prev) => ({
      ...prev,
      redFlags: prev.redFlags.includes(flag)
        ? prev.redFlags.filter((f) => f !== flag)
        : [...prev.redFlags, flag],
    }));
  };

  const generateSummary = () => {
    if (!selectedCondition) return;

    const summaryText = `
Condition: ${selectedCondition}
Symptoms: ${selectedSymptoms.join(', ')}
Age: ${userInputs.age}
Gender: ${userInputs.gender}
Pregnant: ${userInputs.pregnant ? 'Yes' : 'No'}
Red Flags: ${userInputs.redFlags.join(', ') || 'None'}
    `;

    setSummary(summaryText.trim());
  };

  const handleSubmit = () => {
    if (!selectedCondition) return;

    generateSummary();

    if (userInputs.redFlags.length > 0) {
      setResult('You have reported serious symptoms. Please seek immediate medical attention.');
      setStep(4);
    } else if (
      selectedCondition === 'UTI' &&
      userInputs.gender === 'Female' &&
      Number(userInputs.age) >= 16 &&
      Number(userInputs.age) <= 64
    ) {
      setResult(
        'Recommended treatment: Antibiotics may be recommended. Visit a pharmacy for assessment and possible treatment.'
      );
      setStep(4);
    } else {
      setResult(
        'Based on your answers, this condition may not be suitable for Pharmacy First. Please consult your GP.'
      );
      setStep(4);
    }
  };

  const handleDownloadReport = () => {
    if (summary) {
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'symptom_report.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedCondition(null);
    setSelectedSymptoms([]);
    setUserInputs({
      age: '',
      gender: '' as Gender,
      pregnant: false,
      redFlags: [],
    });
    setResult(null);
    setSummary(null);
    setGpType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Symptom Checker</h1>

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                Select Your Condition
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(symptoms).map((condition) => (
                  <motion.button
                    key={condition}
                    className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-lg focus:outline-none"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConditionSelect(condition as Condition)}
                  >
                    {condition}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && selectedCondition && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                Select Your Symptoms
              </h2>
              <div className="space-y-3">
                {symptoms[selectedCondition].map((symptom) => (
                  <label
                    key={symptom}
                    className="flex items-center space-x-3 bg-gray-100 rounded-xl px-4 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => handleSymptomSelect(symptom)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-700">{symptom}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  className="p-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 focus:outline-none"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none"
                  onClick={() => setStep(3)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                Additional Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={userInputs.age}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Gender:</label>
                  <select
                    name="gender"
                    value={userInputs.gender}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                {userInputs.gender === 'Female' && (
                  <div>
                    <label className="flex items-center space-x-2 text-gray-700">
                      <input
                        type="checkbox"
                        name="pregnant"
                        checked={userInputs.pregnant}
                        onChange={handleInputChange}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span>Are you pregnant?</span>
                    </label>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Do you have any of these symptoms?
                  </h3>
                  <div className="space-y-2 mt-2">
                    {selectedCondition &&
                      redFlags[selectedCondition].map((flag) => (
                        <label
                          key={flag}
                          className="flex items-center space-x-2 bg-gray-100 rounded-xl px-4 py-2"
                        >
                          <input
                            type="checkbox"
                            checked={userInputs.redFlags.includes(flag)}
                            onChange={() => handleRedFlagSelect(flag)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                          />
                          <span className="text-gray-700">{flag}</span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  className="p-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 focus:outline-none"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          )}

{step === 4 && result && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Result</h2>
              <p className="text-lg text-gray-800 mb-4 text-center">{result}</p>
              {summary && (
                <div className="bg-gray-100 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Summary:</h3>
                  <pre className="whitespace-pre-wrap text-gray-700">{summary}</pre>
                  <div className="flex justify-center mt-4">
                    <button
                      className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none"
                      onClick={handleDownloadReport}
                    >
                      Download Report
                    </button>
                  </div>
                </div>
              )}
              <button
                className="mt-6 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none w-full"
                onClick={resetForm}
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}