"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import {
  addCertificate,
  updateCertificate,
  deleteCertificate,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addProject,
  updateProject,
  deleteProject,
  seedPortfolioToFirestore,
} from "@/lib/firestoreService";
import {
  CertificateItem,
  ExperienceItem,
  EducationItem,
  ProjectItem,
} from "@/types/portfolio";
import {
  Lock,
  Mail,
  Key,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap,
  FolderDown,
  Search,
  Check,
  AlertCircle,
  X,
  RefreshCw,
  Globe,
  UploadCloud,
  Upload,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { uploadCertificateFile } from "@/lib/storageService";

type TabType = "certificates" | "experience" | "education" | "projects";

export default function AdminPage() {
  const { user, loading, isConfigured, login, logout } = useAuth();
  const { certificates, experience, education, projects, isLive } = usePortfolioData();

  // Auth form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard navigation
  const [activeTab, setActiveTab] = useState<TabType>("certificates");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Certificate Modal state
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certUploadProgress, setCertUploadProgress] = useState<number | null>(null);
  const [certUploadError, setCertUploadError] = useState<string>("");
  const [certInputMode, setCertInputMode] = useState<"file" | "url">("file");
  const [isSubmittingCert, setIsSubmittingCert] = useState(false);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    year: "",
    category: "Educational Qualification" as CertificateItem["category"],
    file: "",
  });

  // Experience Modal state
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [expForm, setExpForm] = useState({
    role: "",
    company: "",
    period: "",
    description: [""],
  });

  // Education Modal state
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [eduForm, setEduForm] = useState({
    degree: "",
    institution: "",
    year: "",
  });

  // Project Modal state
  const [projModalOpen, setProjModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<ProjectItem | null>(null);
  const [projForm, setProjForm] = useState({
    title: "",
    tech: "",
    description: "",
    liveUrl: "",
    githubUrl: "",
  });

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: TabType;
    id: string;
    title: string;
  }>({
    open: false,
    type: "certificates",
    id: "",
    title: "",
  });

  // --- AUTH HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message || "Failed to sign in. Check email and password.");
      } else {
        setAuthError("Failed to sign in. Check email and password.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // --- SYNC INITIAL DATA ---
  const handleSeedData = async () => {
    if (!confirm("This will upload your current default portfolio items to Firestore. Continue?")) return;
    setIsSyncing(true);
    try {
      await seedPortfolioToFirestore();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    } catch (err: unknown) {
      alert("Error syncing data: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSyncing(false);
    }
  };

  // --- CERTIFICATE HANDLERS ---
  const openAddCert = () => {
    setEditingCert(null);
    setCertFile(null);
    setCertUploadProgress(null);
    setCertUploadError("");
    setCertInputMode("file");
    setCertForm({
      title: "",
      issuer: "",
      year: new Date().getFullYear().toString(),
      category: "Educational Qualification",
      file: "",
    });
    setCertModalOpen(true);
  };

  const openEditCert = (item: CertificateItem) => {
    setEditingCert(item);
    setCertFile(null);
    setCertUploadProgress(null);
    setCertUploadError("");
    setCertInputMode(item.file && item.file.startsWith("http") ? "url" : "file");
    setCertForm({
      title: item.title,
      issuer: item.issuer,
      year: item.year,
      category: item.category,
      file: item.file,
    });
    setCertModalOpen(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setCertUploadError("");
    setIsSubmittingCert(true);

    try {
      let finalFilePath = certForm.file;

      // If user selected a file to upload:
      if (certInputMode === "file" && certFile) {
        setCertUploadProgress(5);
        finalFilePath = await uploadCertificateFile(certFile, (p) => {
          setCertUploadProgress(p);
        });
      } else if (!finalFilePath) {
        setCertUploadError("Please upload a file or specify a file path / URL.");
        setIsSubmittingCert(false);
        return;
      }

      const payload = {
        ...certForm,
        file: finalFilePath,
      };

      if (editingCert && editingCert.id) {
        await updateCertificate(editingCert.id, payload);
      } else {
        await addCertificate(payload);
      }
      setCertModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("storage/") || msg.includes("Firebase Storage")) {
        setCertUploadError(
          "Cloud Storage upload issue: " + msg + ". Make sure Cloud Storage is enabled in Firebase Console (Build > Storage)."
        );
      } else {
        setCertUploadError("Error saving certificate: " + msg);
      }
    } finally {
      setIsSubmittingCert(false);
      setCertUploadProgress(null);
    }
  };

  // --- EXPERIENCE HANDLERS ---
  const openAddExp = () => {
    setEditingExp(null);
    setExpForm({
      role: "",
      company: "",
      period: "",
      description: [""],
    });
    setExpModalOpen(true);
  };

  const openEditExp = (item: ExperienceItem) => {
    setEditingExp(item);
    setExpForm({
      role: item.role,
      company: item.company,
      period: item.period,
      description: item.description && item.description.length > 0 ? item.description : [""],
    });
    setExpModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanDesc = expForm.description.filter((d) => d.trim().length > 0);
      if (editingExp && editingExp.id) {
        await updateExperience(editingExp.id, { ...expForm, description: cleanDesc });
      } else {
        await addExperience({ ...expForm, description: cleanDesc });
      }
      setExpModalOpen(false);
    } catch (err: unknown) {
      alert("Error saving experience: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // --- EDUCATION HANDLERS ---
  const openAddEdu = () => {
    setEditingEdu(null);
    setEduForm({
      degree: "",
      institution: "",
      year: "",
    });
    setEduModalOpen(true);
  };

  const openEditEdu = (item: EducationItem) => {
    setEditingEdu(item);
    setEduForm({
      degree: item.degree,
      institution: item.institution,
      year: item.year,
    });
    setEduModalOpen(true);
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEdu && editingEdu.id) {
        await updateEducation(editingEdu.id, eduForm);
      } else {
        await addEducation(eduForm);
      }
      setEduModalOpen(false);
    } catch (err: unknown) {
      alert("Error saving education: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // --- PROJECT HANDLERS ---
  const openAddProj = () => {
    setEditingProj(null);
    setProjForm({
      title: "",
      tech: "",
      description: "",
      liveUrl: "",
      githubUrl: "",
    });
    setProjModalOpen(true);
  };

  const openEditProj = (item: ProjectItem) => {
    setEditingProj(item);
    setProjForm({
      title: item.title,
      tech: item.tech ? item.tech.join(", ") : "",
      description: item.description,
      liveUrl: item.liveUrl || "",
      githubUrl: item.githubUrl || "",
    });
    setProjModalOpen(true);
  };

  const handleSaveProj = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const techArr = projForm.tech
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title: projForm.title,
        tech: techArr,
        description: projForm.description,
        liveUrl: projForm.liveUrl || undefined,
        githubUrl: projForm.githubUrl || undefined,
      };

      if (editingProj && editingProj.id) {
        await updateProject(editingProj.id, payload);
      } else {
        await addProject(payload);
      }
      setProjModalOpen(false);
    } catch (err: unknown) {
      alert("Error saving project: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // --- DELETE HANDLER ---
  const handleConfirmDelete = async () => {
    try {
      if (deleteDialog.type === "certificates") {
        await deleteCertificate(deleteDialog.id);
      } else if (deleteDialog.type === "experience") {
        await deleteExperience(deleteDialog.id);
      } else if (deleteDialog.type === "education") {
        await deleteEducation(deleteDialog.id);
      } else if (deleteDialog.type === "projects") {
        await deleteProject(deleteDialog.id);
      }
      setDeleteDialog({ open: false, type: "certificates", id: "", title: "" });
    } catch (err: unknown) {
      alert("Error deleting item: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070709]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground/50 text-sm tracking-wider uppercase font-semibold">
            Loading Admin Security...
          </p>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#070709] relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-foreground/[0.03] border border-foreground/10 rounded-3xl p-8 sm:p-10 backdrop-blur-xl relative z-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-accent/15 border border-accent/30 text-accent mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Portfolio Admin
            </h1>
            <p className="text-foreground/50 text-xs sm:text-sm mt-1">
              Private access for Randika Wijesooriya
            </p>
          </div>

          {!isConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-1">Firebase Configuration Notice:</strong>
                Your Firebase environment variables (in <code className="bg-black/40 px-1 py-0.5 rounded">.env.local</code>) are ready to be set up. Once you add your Firebase credentials, you can log in directly here.
              </div>
            </div>
          )}

          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@randika.dev"
                  className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-4 py-3.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/80 transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-foreground/5">
            <Link
              href="/"
              className="text-xs text-foreground/50 hover:text-accent transition-colors inline-flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#070709] text-foreground flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-foreground/10 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight">
                Portfolio Admin Console
              </h1>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-foreground/40">{user.email}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-400 font-medium">Live Cloud</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedData}
              disabled={isSyncing}
              title="Populate cloud database with default portfolio data"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground border border-foreground/10 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>Sync Default Data</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground border border-foreground/10 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {syncSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Default portfolio data successfully seeded into Cloud Firestore!</span>
            </div>
            <button onClick={() => setSyncSuccess(false)}>
              <X className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 border-b border-foreground/5 pb-4">
          <button
            onClick={() => {
              setActiveTab("certificates");
              setSearchQuery("");
            }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "certificates"
                ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates & Service Letters</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
              {certificates?.length || 0}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("experience");
              setSearchQuery("");
            }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "experience"
                ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Experience</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
              {experience?.length || 0}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("education");
              setSearchQuery("");
            }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "education"
                ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Education</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
              {education?.length || 0}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("projects");
              setSearchQuery("");
            }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "projects"
                ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"
            }`}
          >
            <FolderDown className="w-4 h-4" />
            <span>Projects</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
              {projects?.length || 0}
            </span>
          </button>
        </div>

        {/* --- TAB 1: CERTIFICATES & SERVICE LETTERS --- */}
        {activeTab === "certificates" && (
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search certificates or service letters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm placeholder:text-foreground/30 focus:outline-none focus:border-accent"
                />
              </div>

              <button
                onClick={openAddCert}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs sm:text-sm hover:bg-accent/80 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certificate / Letter</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates
                .filter(
                  (c) =>
                    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-5 rounded-2xl bg-foreground/[0.03] border border-foreground/10 hover:border-accent/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent">
                          {cert.category}
                        </span>
                        <span className="text-xs text-foreground/40 font-medium">{cert.year}</span>
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-1">{cert.title}</h3>
                      <p className="text-xs text-foreground/60 mb-3">{cert.issuer}</p>
                      <p className="text-[11px] font-mono text-foreground/40 truncate bg-black/30 px-2.5 py-1.5 rounded-lg mb-4">
                        {cert.file}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-foreground/5">
                      <a
                        href={cert.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview File</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditCert(cert)}
                          className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              type: "certificates",
                              id: cert.id || "",
                              title: cert.title,
                            })
                          }
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: WORK EXPERIENCE --- */}
        {activeTab === "experience" && (
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search work experience..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm placeholder:text-foreground/30 focus:outline-none focus:border-accent"
                />
              </div>

              <button
                onClick={openAddExp}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs sm:text-sm hover:bg-accent/80 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Work Experience</span>
              </button>
            </div>

            <div className="space-y-4">
              {experience
                .filter(
                  (exp) =>
                    exp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    exp.company.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/10 hover:border-accent/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold">
                          {exp.period}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-foreground/60 mb-3">{exp.company}</h4>

                      {exp.description && exp.description.length > 0 && (
                        <ul className="space-y-1.5 list-disc list-inside text-xs text-foreground/75">
                          {exp.description.map((desc, i) => (
                            <li key={i}>{desc}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={() => openEditExp(exp)}
                        className="px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs font-semibold flex items-center gap-1.5 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            type: "experience",
                            id: exp.id || "",
                            title: `${exp.role} at ${exp.company}`,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5 text-red-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- TAB 3: EDUCATION --- */}
        {activeTab === "education" && (
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search education..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm placeholder:text-foreground/30 focus:outline-none focus:border-accent"
                />
              </div>

              <button
                onClick={openAddEdu}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs sm:text-sm hover:bg-accent/80 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {education
                .filter(
                  (edu) =>
                    edu.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    edu.institution.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-5 rounded-2xl bg-foreground/[0.03] border border-foreground/10 hover:border-accent/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs text-accent font-semibold mb-1 block">
                        {edu.year}
                      </span>
                      <h3 className="text-base font-bold text-foreground mb-1">{edu.degree}</h3>
                      <p className="text-xs text-foreground/60 mb-4">{edu.institution}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-foreground/5">
                      <button
                        onClick={() => openEditEdu(edu)}
                        className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            type: "education",
                            id: edu.id || "",
                            title: edu.degree,
                          })
                        }
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: PROJECTS --- */}
        {activeTab === "projects" && (
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects by title or tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm placeholder:text-foreground/30 focus:outline-none focus:border-accent"
                />
              </div>

              <button
                onClick={openAddProj}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs sm:text-sm hover:bg-accent/80 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects
                .filter(
                  (p) =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((project, idx) => (
                  <div
                    key={project.id || idx}
                    className="p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/10 hover:border-accent/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{project.title}</h3>
                      <p className="text-xs text-foreground/75 leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tech.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-foreground/5 border border-foreground/10 text-foreground/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-foreground/5">
                      <div className="flex items-center gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live</span>
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-foreground/60 hover:text-foreground flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Code</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProj(project)}
                          className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              type: "projects",
                              id: project.id || "",
                              title: project.title,
                            })
                          }
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL: CERTIFICATE ADD / EDIT --- */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#101014] border border-foreground/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingCert ? "Edit Certificate / Letter" : "Add New Certificate"}
              </h2>
              <button
                onClick={() => setCertModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-foreground/10 text-foreground/60 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Category
                </label>
                <select
                  value={certForm.category}
                  onChange={(e) =>
                    setCertForm({
                      ...certForm,
                      category: e.target.value as CertificateItem["category"],
                    })
                  }
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                >
                  <option value="Educational Qualification" className="bg-[#101014]">
                    Educational Qualification (Degree / Diploma)
                  </option>
                  <option value="Other Qualification" className="bg-[#101014]">
                    Other Qualification (Certification / Course)
                  </option>
                  <option value="Service Letter" className="bg-[#101014]">
                    Service Letter (Employment Verification)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Title / Qualification Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BSc. in Information Technology"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Issuing Institution / Company
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Lanka Institute of Information Technology"
                  value={certForm.issuer}
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Year / Period
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2018 or 2018 – 2024"
                  value={certForm.year}
                  onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              {/* Upload Mode Selector */}
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-2">
                  Certificate Document / File
                </label>
                <div className="flex rounded-xl bg-foreground/5 p-1 mb-3 border border-foreground/10">
                  <button
                    type="button"
                    onClick={() => {
                      setCertInputMode("file");
                      setCertUploadError("");
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      certInputMode === "file"
                        ? "bg-accent text-white shadow-md"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload File (PDF / Image)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCertInputMode("url");
                      setCertUploadError("");
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      certInputMode === "url"
                        ? "bg-accent text-white shadow-md"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Path or Cloud URL</span>
                  </button>
                </div>

                {certInputMode === "file" ? (
                  <div>
                    <div className="relative border-2 border-dashed border-foreground/15 hover:border-accent/50 rounded-2xl p-6 text-center transition-colors bg-foreground/[0.02]">
                      <input
                        type="file"
                        accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setCertFile(e.target.files[0]);
                            setCertUploadError("");
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />

                      {certFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="p-2.5 rounded-xl bg-accent/15 text-accent">
                            {certFile.type.includes("pdf") ? (
                              <FileText className="w-6 h-6" />
                            ) : (
                              <ImageIcon className="w-6 h-6" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-[260px]">
                              {certFile.name}
                            </p>
                            <p className="text-[11px] text-foreground/50">
                              {(certFile.size / 1024).toFixed(1)} KB · Ready to upload
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCertFile(null);
                            }}
                            className="p-1 rounded-md hover:bg-foreground/10 text-foreground/40 hover:text-foreground z-20 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 rounded-full bg-accent/10 text-accent">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">
                              Click or drag certificate PDF or image here
                            </p>
                            <p className="text-[11px] text-foreground/40 mt-0.5">
                              Supports PDF, PNG, JPG, JPEG up to 10MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Current existing file indicator if editing */}
                    {editingCert && !certFile && editingCert.file && (
                      <div className="mt-2 text-[11px] text-foreground/50 flex items-center justify-between bg-black/20 px-3 py-1.5 rounded-lg">
                        <span className="truncate max-w-[260px]">Current: {editingCert.file}</span>
                        <a
                          href={editingCert.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline flex items-center gap-1 shrink-0 ml-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </a>
                      </div>
                    )}

                    {/* Progress Bar */}
                    {certUploadProgress !== null && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-foreground/70 mb-1">
                          <span className="font-semibold text-accent">Uploading to Cloud Storage...</span>
                          <span>{certUploadProgress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all duration-300"
                            style={{ width: `${certUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. /certificates/degree.pdf or Google Drive link"
                      value={certForm.file}
                      onChange={(e) => setCertForm({ ...certForm, file: e.target.value })}
                      className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-accent"
                    />
                    <p className="text-[11px] text-foreground/40 mt-1">
                      Direct local path in <code className="text-accent">public/certificates/</code> or external cloud sharing URL.
                    </p>
                  </div>
                )}
              </div>

              {certUploadError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{certUploadError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-foreground/5">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  disabled={isSubmittingCert}
                  className="px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCert}
                  className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent/80 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmittingCert ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{certUploadProgress !== null ? `Uploading (${certUploadProgress}%)...` : "Saving..."}</span>
                    </>
                  ) : (
                    <span>{editingCert ? "Update Certificate" : "Save Certificate"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EXPERIENCE ADD / EDIT --- */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#101014] border border-foreground/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingExp ? "Edit Experience" : "Add Work Experience"}
              </h2>
              <button
                onClick={() => setExpModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-foreground/10 text-foreground/60 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Job Role
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IT Technician & Web Developer"
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Transtek Lanka (Pvt) Ltd"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Period / Timeline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. May 2025 – Present"
                  value={expForm.period}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground/70">
                    Key Responsibilities / Highlights
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setExpForm({
                        ...expForm,
                        description: [...expForm.description, ""],
                      })
                    }
                    className="text-xs text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Point</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {expForm.description.map((desc, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Point ${i + 1}`}
                        value={desc}
                        onChange={(e) => {
                          const updated = [...expForm.description];
                          updated[i] = e.target.value;
                          setExpForm({ ...expForm, description: updated });
                        }}
                        className="flex-1 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                      />
                      {expForm.description.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = expForm.description.filter((_, idx) => idx !== i);
                            setExpForm({ ...expForm, description: updated });
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-foreground/5">
                <button
                  type="button"
                  onClick={() => setExpModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent/80 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
                >
                  {editingExp ? "Update Experience" : "Add Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDUCATION ADD / EDIT --- */}
      {eduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#101014] border border-foreground/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingEdu ? "Edit Education" : "Add Education"}
              </h2>
              <button
                onClick={() => setEduModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-foreground/10 text-foreground/60 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdu} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Degree / Certificate Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BSc. in Information Technology"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Institution / University
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Lanka Institute of Information Technology"
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Year Period
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2015 – 2018"
                  value={eduForm.year}
                  onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-foreground/5">
                <button
                  type="button"
                  onClick={() => setEduModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent/80 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
                >
                  {editingEdu ? "Update Education" : "Add Education"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: PROJECT ADD / EDIT --- */}
      {projModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#101014] border border-foreground/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingProj ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={() => setProjModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-foreground/10 text-foreground/60 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProj} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Book Rental Web App"
                  value={projForm.title}
                  onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React, Next.js, Tailwind CSS, Firebase"
                  value={projForm.tech}
                  onChange={(e) => setProjForm({ ...projForm, tech: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Comprehensive description of the application and problems solved..."
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={projForm.liveUrl}
                    onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                    GitHub URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projForm.githubUrl}
                    onChange={(e) => setProjForm({ ...projForm, githubUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-foreground/5">
                <button
                  type="button"
                  onClick={() => setProjModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent/80 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
                >
                  {editingProj ? "Update Project" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION DELETE DIALOG --- */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#121216] border border-red-500/20 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl text-center">
            <div className="inline-flex p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Delete Item?</h3>
            <p className="text-sm text-foreground/60 mb-6 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground font-semibold">"{deleteDialog.title}"</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() =>
                  setDeleteDialog({ open: false, type: "certificates", id: "", title: "" })
                }
                className="flex-1 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-xs font-semibold text-foreground/80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
