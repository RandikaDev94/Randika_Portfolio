"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CertificateItem, ExperienceItem, EducationItem, ProjectItem } from "@/types/portfolio";
import { PORTFOLIO_DATA } from "@/constants/data";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  subscribeCertificates,
  subscribeExperiences,
  subscribeEducation,
  subscribeProjects,
} from "@/lib/firestoreService";

interface PortfolioDataContextType {
  certificates: CertificateItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  isLive: boolean;
}

const PortfolioDataContext = createContext<PortfolioDataContextType>({
  certificates: (PORTFOLIO_DATA.certificates as CertificateItem[]) || [],
  experience: (PORTFOLIO_DATA.experience as ExperienceItem[]) || [],
  education: (PORTFOLIO_DATA.education as EducationItem[]) || [],
  projects: (PORTFOLIO_DATA.projects as ProjectItem[]) || [],
  isLive: false,
});

export const PortfolioDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [certificates, setCertificates] = useState<CertificateItem[]>(
    (PORTFOLIO_DATA.certificates as CertificateItem[]) || []
  );
  const [experience, setExperience] = useState<ExperienceItem[]>(
    (PORTFOLIO_DATA.experience as ExperienceItem[]) || []
  );
  const [education, setEducation] = useState<EducationItem[]>(
    (PORTFOLIO_DATA.education as EducationItem[]) || []
  );
  const [projects, setProjects] = useState<ProjectItem[]>(
    (PORTFOLIO_DATA.projects as ProjectItem[]) || []
  );
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    setIsLive(true);

    const unsubCerts = subscribeCertificates((data) => {
      if (data && data.length > 0) {
        setCertificates(data);
      }
    });

    const unsubExp = subscribeExperiences((data) => {
      if (data && data.length > 0) {
        setExperience(data);
      }
    });

    const unsubEdu = subscribeEducation((data) => {
      if (data && data.length > 0) {
        setEducation(data);
      }
    });

    const unsubProj = subscribeProjects((data) => {
      if (data && data.length > 0) {
        setProjects(data);
      }
    });

    return () => {
      unsubCerts();
      unsubExp();
      unsubEdu();
      unsubProj();
    };
  }, []);

  return (
    <PortfolioDataContext.Provider
      value={{
        certificates,
        experience,
        education,
        projects,
        isLive,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => useContext(PortfolioDataContext);
