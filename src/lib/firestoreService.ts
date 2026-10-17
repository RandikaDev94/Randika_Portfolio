import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { CertificateItem, ExperienceItem, EducationItem, ProjectItem } from "@/types/portfolio";
import { PORTFOLIO_DATA } from "@/constants/data";

// Collection Names
export const COLLECTIONS = {
  CERTIFICATES: "certificates",
  EXPERIENCE: "experience",
  EDUCATION: "education",
  PROJECTS: "projects",
} as const;

// --- CERTIFICATES ---
export const subscribeCertificates = (callback: (data: CertificateItem[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, COLLECTIONS.CERTIFICATES));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as CertificateItem[];
    callback(items);
  }, (error) => {
    console.error("Firestore certificates subscribe error:", error);
  });
};

export const addCertificate = async (item: Omit<CertificateItem, "id">) => {
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = await addDoc(collection(db, COLLECTIONS.CERTIFICATES), {
    ...item,
    createdAt: Date.now(),
  });
  return docRef.id;
};

export const updateCertificate = async (id: string, item: Partial<CertificateItem>) => {
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, COLLECTIONS.CERTIFICATES, id);
  await updateDoc(docRef, item);
};

export const deleteCertificate = async (id: string) => {
  if (!db) throw new Error("Firebase DB not initialized");
  await deleteDoc(doc(db, COLLECTIONS.CERTIFICATES, id));
};

// --- EXPERIENCES ---
export const subscribeExperiences = (callback: (data: ExperienceItem[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, COLLECTIONS.EXPERIENCE));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ExperienceItem[];
    // Sort by order or createdAt
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    callback(items);
  }, (error) => {
    console.error("Firestore experience subscribe error:", error);
  });
};

export const addExperience = async (item: Omit<ExperienceItem, "id">) => {
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = await addDoc(collection(db, COLLECTIONS.EXPERIENCE), {
    ...item,
    createdAt: Date.now(),
  });
  return docRef.id;
};

export const updateExperience = async (id: string, item: Partial<ExperienceItem>) => {
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, COLLECTIONS.EXPERIENCE, id);
  await updateDoc(docRef, item);
};

export const deleteExperience = async (id: string) => {
  if (!db) throw new Error("Firebase DB not initialized");
  await deleteDoc(doc(db, COLLECTIONS.EXPERIENCE, id));
};

// --- EDUCATION ---
export const subscribeEducation = (callback: (data: EducationItem[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, COLLECTIONS.EDUCATION));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as EducationItem[];
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    callback(items);
  }, (error) => {
    console.error("Firestore education subscribe error:", error);
  });
};

export const addEducation = async (item: Omit<EducationItem, "id">) => {
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = await addDoc(collection(db, COLLECTIONS.EDUCATION), {
    ...item,
    createdAt: Date.now(),
  });
  return docRef.id;
};

export const updateEducation = async (id: string, item: Partial<EducationItem>) => {
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, COLLECTIONS.EDUCATION, id);
  await updateDoc(docRef, item);
};

export const deleteEducation = async (id: string) => {
  if (!db) throw new Error("Firebase DB not initialized");
  await deleteDoc(doc(db, COLLECTIONS.EDUCATION, id));
};

// --- PROJECTS ---
export const subscribeProjects = (callback: (data: ProjectItem[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, COLLECTIONS.PROJECTS));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ProjectItem[];
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    callback(items);
  }, (error) => {
    console.error("Firestore projects subscribe error:", error);
  });
};

export const addProject = async (item: Omit<ProjectItem, "id">) => {
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
    ...item,
    createdAt: Date.now(),
  });
  return docRef.id;
};

export const updateProject = async (id: string, item: Partial<ProjectItem>) => {
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, COLLECTIONS.PROJECTS, id);
  await updateDoc(docRef, item);
};

export const deleteProject = async (id: string) => {
  if (!db) throw new Error("Firebase DB not initialized");
  await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
};

// --- INITIAL SEED SYNC ---
export const seedPortfolioToFirestore = async () => {
  if (!db) throw new Error("Firebase DB not initialized");

  // 1. Certificates
  if (PORTFOLIO_DATA.certificates) {
    for (let i = 0; i < PORTFOLIO_DATA.certificates.length; i++) {
      const c = PORTFOLIO_DATA.certificates[i];
      await addDoc(collection(db, COLLECTIONS.CERTIFICATES), {
        title: c.title,
        issuer: c.issuer,
        year: c.year,
        category: c.category,
        file: c.file,
        createdAt: Date.now() + i,
      });
    }
  }

  // 2. Experience
  if (PORTFOLIO_DATA.experience) {
    for (let i = 0; i < PORTFOLIO_DATA.experience.length; i++) {
      const exp = PORTFOLIO_DATA.experience[i];
      await addDoc(collection(db, COLLECTIONS.EXPERIENCE), {
        role: exp.role,
        company: exp.company,
        period: exp.period,
        description: exp.description,
        order: i,
        createdAt: Date.now() + i,
      });
    }
  }

  // 3. Education
  if (PORTFOLIO_DATA.education) {
    for (let i = 0; i < PORTFOLIO_DATA.education.length; i++) {
      const edu = PORTFOLIO_DATA.education[i];
      await addDoc(collection(db, COLLECTIONS.EDUCATION), {
        degree: edu.degree,
        institution: edu.institution,
        year: edu.year,
        order: i,
        createdAt: Date.now() + i,
      });
    }
  }

  // 4. Projects
  if (PORTFOLIO_DATA.projects) {
    for (let i = 0; i < PORTFOLIO_DATA.projects.length; i++) {
      const p = PORTFOLIO_DATA.projects[i];
      await addDoc(collection(db, COLLECTIONS.PROJECTS), {
        title: p.title,
        tech: p.tech,
        description: p.description,
        order: i,
        createdAt: Date.now() + i,
      });
    }
  }
};
