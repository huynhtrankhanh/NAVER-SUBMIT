import { AppState } from "../models/types";

const STORAGE_KEY = 'UniFlowData_V1';

// Requirement 2: Persistent Storage (localStorage)
export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Could not save state to localStorage", error);
  }
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      // Return default initial state if nothing is stored
      return {
          courses: [],
          tasks: []
      };
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Could not load state from localStorage", error);
    return { courses: [], tasks: [] };
  }
};