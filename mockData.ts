
import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { Department, INITIAL_DEPARTMENTS } from './types';

const AUTH_KEY = 'yuga_sports_admin_session';

/**
 * Creates the default department objects.
 */
const getDefaultDepartments = (): Department[] => {
  return INITIAL_DEPARTMENTS.map(name => ({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: name,
    totalPoints: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
    lastUpdated: Date.now()
  }));
};

/**
 * Parses raw Firestore data into Department objects.
 */
const parseFirestoreData = (data: any): Department[] => {
  const departments: Department[] = [];
  Object.keys(data).forEach((key) => {
    const item = data[key];
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      departments.push({
        id: key,
        name: item.name || key,
        totalPoints: Number(item.totalPoints) || 0,
        gold: Number(item.gold) || 0,
        silver: Number(item.silver) || 0,
        bronze: Number(item.bronze) || 0,
        lastUpdated: item.lastUpdated || Date.now()
      });
    }
  });

  const defaults = getDefaultDepartments();
  return defaults.map(def => {
    const cloud = departments.find(d => d.id === def.id);
    return cloud || def;
  });
};

/**
 * Real-time subscription to department scores.
 */
export const subscribeToDepartments = (onUpdate: (depts: Department[]) => void, onError: (err: any) => void) => {
  const scoresDocRef = doc(db, 'leaderboard', 'scores');
  
  return onSnapshot(scoresDocRef, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(parseFirestoreData(docSnap.data()));
    } else {
      onUpdate(getDefaultDepartments());
    }
  }, (error) => {
    console.error("[Firestore] Subscription Error:", error);
    onError(error);
  });
};

/**
 * Fetches departments from Firestore once. 
 */
export const getStoredDepartments = async (): Promise<Department[]> => {
  try {
    const scoresDocRef = doc(db, 'leaderboard', 'scores');
    const docSnap = await getDoc(scoresDocRef);

    if (docSnap.exists()) {
      return parseFirestoreData(docSnap.data());
    } else {
      return getDefaultDepartments();
    }
  } catch (error: any) {
    console.error("[Firestore] Fetch Error:", error);
    return getDefaultDepartments();
  }
};

/**
 * Updates a specific department map in the 'leaderboard/scores' document.
 */
export const updateDepartmentData = async (deptId: string, updates: Partial<Department>): Promise<Department[]> => {
  try {
    const scoresDocRef = doc(db, 'leaderboard', 'scores');
    const timestamp = Date.now();
    
    const currentDepts = await getStoredDepartments();
    const targetDept = currentDepts.find(d => d.id === deptId);

    const firestoreUpdates: any = {
      [deptId]: {
        name: targetDept?.name || deptId,
        gold: Number(updates.gold ?? targetDept?.gold ?? 0),
        silver: Number(updates.silver ?? targetDept?.silver ?? 0),
        bronze: Number(updates.bronze ?? targetDept?.bronze ?? 0),
        totalPoints: Number(updates.totalPoints ?? targetDept?.totalPoints ?? 0),
        lastUpdated: timestamp
      }
    };

    await setDoc(scoresDocRef, firestoreUpdates, { merge: true });
    return await getStoredDepartments();
  } catch (error: any) {
    console.error("[Firestore] Update Error:", error);
    throw error;
  }
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const setAdminAuth = (value: boolean) => {
  if (value) {
    localStorage.setItem(AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
};
