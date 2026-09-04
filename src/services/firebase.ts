import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";
import { CVData, CVDesignConfig } from "../types";

// Initialize Firebase App (singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with the provisioned database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export interface CloudCVSummary {
  id: string;
  userId: string;
  title: string;
  personalName: string;
  targetRole: string;
  templateId: string;
  updatedAt: number;
  createdAt: number;
  data: CVData;
  config: CVDesignConfig;
}

/**
 * Ensures the user is authenticated (using anonymous auth by default)
 */
export async function ensureAuthenticated(): Promise<FirebaseUser> {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          unsubscribe();
          resolve(user);
        } else {
          signInAnonymously(auth)
            .then((credential) => {
              unsubscribe();
              resolve(credential.user);
            })
            .catch((err) => {
              unsubscribe();
              reject(err);
            });
        }
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

/**
 * Saves or updates a CV document in Firestore
 */
export async function saveCVToCloud(
  userId: string,
  cvId: string,
  cvData: CVData,
  designConfig: CVDesignConfig,
  title?: string
): Promise<{ success: boolean; id: string; error?: string }> {
  try {
    const docRef = doc(db, "cvs", cvId);
    const existing = await getDoc(docRef);

    const now = Date.now();
    const docTitle =
      title ||
      `${cvData.personal.firstName || "Mon"} ${cvData.personal.lastName || "CV"} - ${
        cvData.personal.title || "Curriculum"
      }`.trim();

    const payload = {
      id: cvId,
      userId,
      title: docTitle,
      personalName: `${cvData.personal.firstName || ""} ${cvData.personal.lastName || ""}`.trim(),
      targetRole: cvData.personal.title || "",
      templateId: designConfig.templateId,
      cvData,
      designConfig,
      updatedAt: now,
      createdAt: existing.exists() ? existing.data()?.createdAt || now : now,
    };

    await setDoc(docRef, payload, { merge: true });
    return { success: true, id: cvId };
  } catch (error: any) {
    console.error("Erreur lors de l'enregistrement dans Firestore:", error);
    return { success: false, id: cvId, error: error.message || "Erreur base de données" };
  }
}

/**
 * Real-time listener for all CVs owned by a user
 */
export function subscribeToUserCVs(
  userId: string,
  onUpdate: (cvs: CloudCVSummary[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(db, "cvs"),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const results: CloudCVSummary[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        results.push({
          id: data.id || d.id,
          userId: data.userId,
          title: data.title || "CV sans titre",
          personalName: data.personalName || "",
          targetRole: data.targetRole || "",
          templateId: data.templateId || "nordic-modern",
          updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : Date.now(),
          createdAt: typeof data.createdAt === "number" ? data.createdAt : Date.now(),
          data: data.cvData,
          config: data.designConfig,
        });
      });
      onUpdate(results);
    },
    (err) => {
      console.error("Erreur écoute Firestore:", err);
      if (onError) onError(err);
    }
  );
}

/**
 * Deletes a CV document from Firestore
 */
export async function deleteCVFromCloud(cvId: string): Promise<boolean> {
  try {
    const docRef = doc(db, "cvs", cvId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erreur suppression Firestore:", error);
    return false;
  }
}

/**
 * Get project database metadata for UI diagnostics
 */
export function getFirebaseMetadata() {
  return {
    projectId: firebaseConfig.projectId,
    databaseId: firebaseConfig.firestoreDatabaseId,
    authDomain: firebaseConfig.authDomain,
  };
}
