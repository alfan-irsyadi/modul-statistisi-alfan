import soalData from '../../soal.json';

export const getQuestionsForMaterial = (materialName) => {
  // Handle cases where material name includes (SSN)
  const cleanName = materialName.includes('(') 
    ? materialName.trim()
    : materialName;
  return soalData["Tata Laksana Penyelenggaraan Statistik"][cleanName] || [];
};

export const saveExerciseResult = (materialName, result) => {
  const results = JSON.parse(localStorage.getItem('exerciseResults') || '{}');
  results[materialName] = {
    ...result,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('exerciseResults', JSON.stringify(results));
};

export const getExerciseResult = (materialName) => {
  const results = JSON.parse(localStorage.getItem('exerciseResults') || '{}');
  return results[materialName];
};

export const getAllResults = () => {
  return JSON.parse(localStorage.getItem('exerciseResults') || '{}');
};
