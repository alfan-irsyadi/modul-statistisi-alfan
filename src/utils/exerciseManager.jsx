import soalData from '../../soal.json';

export const getQuestionsForMaterial = (materialName) => {
  if (!materialName) {
    console.error('No material name provided to getQuestionsForMaterial');
    return [];
  }

  // Normalize the material name to handle case sensitivity
  const normalizedMaterialName = materialName.trim();

  // Search through all topics for the material
  for (const topicData of Object.values(soalData)) {
    for (const [material, questions] of Object.entries(topicData)) {
      if (material.trim() === normalizedMaterialName) {
        return questions;
      }
    }
  }

  console.warn(`No questions found for material: ${materialName}`);
  return [];
};

export const saveExerciseResult = (materialName, result) => {
  try {
    const existingResults = JSON.parse(localStorage.getItem('exerciseResults') || '{}');
    existingResults[materialName] = result;
    localStorage.setItem('exerciseResults', JSON.stringify(existingResults));
    console.log(`Saved result for ${materialName}:`, result);
  } catch (error) {
    console.error('Error saving exercise result:', error);
  }
};

export const getExerciseResult = (materialName) => {
  try {
    const results = JSON.parse(localStorage.getItem('exerciseResults') || '{}');
    return results[materialName];
  } catch (error) {
    console.error('Error getting exercise result:', error);
    return null;
  }
};
