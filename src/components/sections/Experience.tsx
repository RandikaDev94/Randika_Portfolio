"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/constants/data";
import { SplitText } from "@/components/ui/SplitText";
import {
  CheckCircle2,
  Award,
  Download,
  ExternalLink,
  FolderDown,
  GraduationCap,
  Briefcase,
  Eye,
  X,
  Loader2,
  FileText,
} from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { CertificateItem } from "@/types/portfolio";

interface TimelineItemProps {
  date: string;
  title: string;
  subtitle: string;
  descriptions?: string[];
  isLeft: boolean;
}

const TimelineItem = ({ date, title, subtitle, descriptions, isLeft }: TimelineItemProps) => {
  return (
    <div className={`exp-card relative flex items-start w-full mb-12 md:mb-24 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
      
      {/* The dot connector */}
      <div className="absolute left-[24px] md:left-1/2 w-[16px] h-[16px] rounded-full bg-accent border-[4px] border-background z-10 -ml-[8px] mt-8 md:mt-10" />

      {/* Card Wrapper */}
      <div className={`w-full md:w-5/12 pl-[64px] md:pl-0 ${isLeft ? 'md:pr-12 xl:pr-16' : 'md:pl-12 xl:pl-16'}`}>
        <div className="py-6 px-6 md:p-8 rounded-2xl bg-foreground/[0.03] border border-foreground/5 hover:bg-foreground/[0.06] hover:border-foreground/10 transition-colors w-full group">
          <div className={`flex flex-col ${isLeft ? 'md:items-end md:text-right' : 'items-start text-left'}`}>
            <span className="text-[10px] md:text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">{date}</span>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">{title}</h3>
            <h4 className="text-base md:text-lg text-foreground/60 font-medium mb-6">{subtitle}</h4>
            
            {descriptions && descriptions.length > 0 && (
              <ul className={`w-full space-y-4 flex flex-col ${isLeft ? 'md:items-end' : 'items-start'}`}>
                {descriptions.map((desc, i) => (
                  <li key={i} className={`flex items-start gap-4 text-sm md:text-base text-foreground/75 ${isLeft ? 'md:flex-row-reverse text-left md:text-right' : 'text-left'}`}>
                    <CheckCircle2 className="w-5 h-5 text-accent/60 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{desc}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Experience() {
  const { certificates, experience, education } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewingCert, setViewingCert] = useState<CertificateItem | null>(null);
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [mediaLoading, setMediaLoading] = useState<boolean>(true);
  const [pdfViewMode, setPdfViewMode] = useState<"image" | "pdf">("image");
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [zipStatusText, setZipStatusText] = useState<string>("");

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (viewingCert) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [viewingCert]);

  // Close modal when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setViewingCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenViewer = (cert: CertificateItem) => {
    setMediaLoading(true);
    setPdfViewMode("image");
    setViewingCert(cert);
  };

  const isPdfFile = (url: string) => {
    const clean = url.split("?")[0].toLowerCase();
    return clean.endsWith(".pdf") || clean.includes(".pdf");
  };

  // Automatic download without opening a new tab
  const handleDownload = async (fileUrl: string, title: string) => {
    if (!fileUrl || downloadingUrl) return;
    setDownloadingUrl(fileUrl);

    try {
      // 1. Fetch file as Blob (Cloudinary provides Access-Control-Allow-Origin: *)
      let response = await fetch(fileUrl);
      let downloadedAsJpgFallback = false;

      // If Cloudinary returned 401 Unauthorized on .pdf (due to Cloudinary's default security restriction on PDF delivery)
      if (
        !response.ok &&
        response.status === 401 &&
        fileUrl.includes("res.cloudinary.com") &&
        fileUrl.toLowerCase().includes(".pdf")
      ) {
        console.warn("Cloudinary PDF delivery restricted (401). Falling back to rendered image download.");
        const fallbackUrl = fileUrl.replace(/\.pdf$/i, ".jpg");
        response = await fetch(fallbackUrl);
        if (response.ok) {
          downloadedAsJpgFallback = true;
        }
      }

      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      const blob = await response.blob();

      // Extract or infer file extension
      let ext = "";
      if (downloadedAsJpgFallback) {
        ext = ".jpg";
      } else {
        const cleanUrl = fileUrl.split("?")[0];
        const match = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);
        if (match) {
          ext = `.${match[1]}`;
        } else if (blob.type === "application/pdf") {
          ext = ".pdf";
        } else if (blob.type.includes("png")) {
          ext = ".png";
        } else if (blob.type.includes("jpeg") || blob.type.includes("jpg")) {
          ext = ".jpg";
        }
      }

      // Format safe filename
      const safeTitle = title
        ? title.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim().replace(/\s+/g, "_")
        : "certificate";
      const filename = safeTitle.toLowerCase().endsWith(ext.toLowerCase())
        ? safeTitle
        : `${safeTitle}${ext}`;

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1500);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to forced-attachment:", err);

      // 2. Fallback: If Cloudinary URL, use fl_attachment transformation which forces attachment header
      let targetUrl = fileUrl;
      const safeName = encodeURIComponent(
        title ? title.replace(/[^a-zA-Z0-9_-]/g, "_").trim() : "certificate"
      );

      if (fileUrl.includes("res.cloudinary.com") && fileUrl.includes("/upload/")) {
        if (fileUrl.toLowerCase().includes(".pdf")) {
          targetUrl = fileUrl
            .replace("/upload/", `/upload/fl_attachment:${safeName}/`)
            .replace(/\.pdf$/i, ".jpg");
        } else {
          targetUrl = fileUrl.replace("/upload/", `/upload/fl_attachment:${safeName}/`);
        }
      }

      // Invisible iframe triggers download in background without opening any tab
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = targetUrl;
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 5000);
    } finally {
      setDownloadingUrl(null);
    }
  };

  // Download all available certificates bundled into a single ZIP archive
  const handleDownloadAllZip = async () => {
    if (!certificates || certificates.length === 0 || isZipping) return;
    setIsZipping(true);
    setZipStatusText("Preparing bundle...");

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Main root folder inside the ZIP
      const rootFolder = zip.folder("Randika_Wijesooriya_Certificates") || zip;

      // Add a professional README dossier overview
      const dateStr = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const readmeContent = [
        "===========================================================",
        "RANDIKA WIJESOORIYA - VERIFIED CREDENTIAL DOSSIER",
        `Generated: ${dateStr}`,
        "Portfolio: https://steelblue-baboon-677990.hostingersite.com/",
        "===========================================================",
        "",
        `This package contains ${certificates.length} verified academic & professional documents:`,
        "",
        ...certificates.map(
          (c, i) => `${i + 1}. [${c.category}] ${c.title} - ${c.issuer} (${c.year})`
        ),
        "",
        "Thank you for reviewing my credentials!",
        "===========================================================",
      ].join("\n");
      rootFolder.file("README.txt", readmeContent);

      let successCount = 0;

      for (let i = 0; i < certificates.length; i++) {
        const cert = certificates[i];
        setZipStatusText(`Packaging ${i + 1}/${certificates.length}...`);

        try {
          const fileUrl = cert.file;
          if (!fileUrl) continue;

          // 1. Fetch the file
          let res = await fetch(fileUrl);
          let wasJpgFallback = false;

          // If Cloudinary 401 on .pdf, fetch high-res rendered JPG
          if (
            !res.ok &&
            res.status === 401 &&
            fileUrl.includes("res.cloudinary.com") &&
            fileUrl.toLowerCase().includes(".pdf")
          ) {
            const fallbackUrl = fileUrl.replace(/\.pdf$/i, ".jpg");
            res = await fetch(fallbackUrl);
            if (res.ok) {
              wasJpgFallback = true;
            }
          }

          if (!res.ok) {
            console.warn(`Could not fetch certificate "${cert.title}": HTTP ${res.status}`);
            continue;
          }

          const blob = await res.blob();
          const arrayBuffer = await blob.arrayBuffer();

          // Determine file extension
          let ext = wasJpgFallback ? ".jpg" : "";
          if (!ext) {
            const cleanUrl = fileUrl.split("?")[0];
            const match = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);
            if (match) {
              ext = `.${match[1]}`;
            } else if (blob.type === "application/pdf") {
              ext = ".pdf";
            } else if (blob.type.includes("png")) {
              ext = ".png";
            } else {
              ext = ".jpg";
            }
          }

          // Clean title for safe filesystem filename
          const cleanTitle =
            cert.title.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim().replace(/\s+/g, "_") ||
            "Certificate";
          const filename = `${String(i + 1).padStart(2, "0")}_${cleanTitle}${ext}`;

          // Organize by category folder
          const catFolderName =
            cert.category.replace(/[^a-zA-Z0-9_\s]/g, "").trim().replace(/\s+/g, "_") ||
            "Credentials";
          const catFolder = rootFolder.folder(catFolderName) || rootFolder;
          catFolder.file(filename, arrayBuffer);
          successCount++;
        } catch (itemErr) {
          console.warn(`Failed to package certificate "${cert.title}":`, itemErr);
        }
      }

      if (successCount === 0) {
        throw new Error(
          "Could not download any certificates. Please check your internet connection."
        );
      }

      setZipStatusText("Compressing archive...");
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      // Trigger browser download
      const blobUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Randika_Wijesooriya_Certificates.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      alert(err instanceof Error ? err.message : "Failed to generate certificate bundle.");
    } finally {
      setIsZipping(false);
      setZipStatusText("");
    }
  };

  const categoryOptions = [
    { id: "All", label: "All Credentials", count: certificates?.length || 0 },
    { id: "Educational Qualification", label: "Education", count: certificates?.filter(c => c.category === "Educational Qualification").length || 0 },
    { id: "Other Qualification", label: "Other Qualifications", count: certificates?.filter(c => c.category === "Other Qualification").length || 0 },
    { id: "Service Letter", label: "Service Letters", count: certificates?.filter(c => c.category === "Service Letter").length || 0 },
  ];

  const filteredCertificates = certificates
    ? activeCategory === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeCategory)
    : [];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Educational Qualification":
        return <GraduationCap className="w-4 h-4 text-accent" />;
      case "Service Letter":
        return <Briefcase className="w-4 h-4 text-accent" />;
      default:
        return <Award className="w-4 h-4 text-accent" />;
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Ignore mobile re-sizing lag for fixed smooth performance
    ScrollTrigger.config({ ignoreMobileResize: true });
    
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".exp-card");
      const badges = gsap.utils.toArray<HTMLElement>(".timeline-badge");
      const certCards = gsap.utils.toArray<HTMLElement>(".cert-card");
      
      [...cards, ...badges, ...certCards].forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-24 relative border-t border-foreground/5 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="w-full mb-16 md:mb-24 text-center">
          <SplitText text="Career Journey" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight inline-block" />
        </div>
        
        {/* Unified Timeline Container */}
        <div className="relative w-full">
          {/* Main vertical line */}
          <div className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-[2px] bg-foreground/10 -ml-[1px]" />

          {/* Experience Centered Badge */}
          <div className="timeline-badge relative flex justify-start md:justify-center w-full mb-12 md:mb-16 mt-4">
            <div className="ml-[2px] md:ml-0 px-10 py-4 rounded-full bg-background/95 backdrop-blur-md border border-foreground/20 text-accent font-bold z-10 text-sm md:text-base tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              Experience
            </div>
          </div>

          {/* Professional Experience Items */}
          {experience.map((exp, index) => (
            <TimelineItem
              key={`exp-${exp.id || index}`}
              isLeft={index % 2 === 0}
              date={exp.period}
              title={exp.role}
              subtitle={exp.company}
              descriptions={exp.description}
            />
          ))}

          {/* Education Centered Badge separator */}
          <div className="timeline-badge relative flex justify-start md:justify-center w-full mb-12 md:mb-16 mt-8">
            <div className="ml-[2px] md:ml-0 px-10 py-4 rounded-full bg-background/95 backdrop-blur-md border border-foreground/20 text-accent font-bold z-10 text-sm md:text-base tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              Education
            </div>
          </div>

          {/* Education Items */}
          {education.map((edu, index) => (
            <TimelineItem
              key={`edu-${edu.id || index}`}
              // Continuing the sequence from the last index to keep the alternation smooth
              isLeft={(experience.length + index) % 2 === 0}
              date={`Graduated ${edu.year}`}
              title={edu.degree}
              subtitle={edu.institution}
            />
          ))}

          {/* Timeline termination dot */}
          <div className="absolute left-[24px] md:left-1/2 bottom-0 w-[12px] h-[12px] rounded-full bg-accent/60 border-2 border-background z-10 -ml-[6px]" />
        </div>

        {/* Certificates & Credentials Section */}
        {certificates && certificates.length > 0 && (
          <div id="certificates" className="scroll-mt-24 mt-20 md:mt-28 w-full pt-16 border-t border-foreground/10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-widest mb-4">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Qualifications</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                Certificates & Diplomas
              </h3>
              <p className="text-sm md:text-base text-foreground/60 leading-relaxed">
                Official academic degrees, technical diplomas, and certified training validating hands-on expertise.
              </p>
            </div>

            {/* Master Download All Banner */}
            <div className="cert-card mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-accent/10 via-foreground/[0.03] to-accent/5 border border-accent/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="p-3.5 rounded-xl bg-accent/15 border border-accent/30 text-accent shrink-0 hidden sm:flex">
                  <FolderDown className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground mb-1 flex items-center justify-center sm:justify-start gap-2">
                    <span>Complete Credential Dossier</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/20 text-accent font-semibold">
                      {certificates.length} {certificates.length === 1 ? "File" : "Files"}
                    </span>
                  </h4>
                  <p className="text-xs md:text-sm text-foreground/60">
                    Download all {certificates.length} verified certificates and qualification documents in a single organized ZIP package.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isZipping}
                onClick={handleDownloadAllZip}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-accent text-white font-semibold text-sm hover:bg-accent/80 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] shrink-0 group cursor-pointer disabled:opacity-70 disabled:cursor-wait"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{zipStatusText || "Generating ZIP..."}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    <span>Download All ({certificates.length} Files .ZIP)</span>
                  </>
                )}
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
              {categoryOptions.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] scale-105"
                        : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground border border-foreground/10"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-foreground/10 text-foreground/50"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Individual Certificate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {filteredCertificates.map((cert, idx) => (
                <div
                  key={`cert-${cert.title}-${idx}`}
                  className="cert-card p-6 md:p-7 rounded-2xl bg-foreground/[0.03] border border-foreground/5 hover:bg-foreground/[0.06] hover:border-accent/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent">
                        {getCategoryIcon(cert.category)}
                        <span>{cert.category}</span>
                      </span>
                      <span className="text-xs text-foreground/40 font-medium">
                        {cert.year}
                      </span>
                    </div>

                    <h4 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {cert.title}
                    </h4>
                    <p className="text-xs md:text-sm text-foreground/60 font-medium mb-6">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-foreground/5">
                    <button
                      type="button"
                      onClick={() => handleOpenViewer(cert)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground border border-foreground/10 transition-colors cursor-pointer group/btn"
                    >
                      <Eye className="w-3.5 h-3.5 text-foreground/60 group-hover/btn:text-accent transition-colors" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      disabled={downloadingUrl === cert.file}
                      onClick={() => handleDownload(cert.file, cert.title)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 hover:border-accent transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                    >
                      {downloadingUrl === cert.file ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Popup Viewer Modal */}
      {viewingCert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md transition-opacity duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewingCert(null);
            }
          }}
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c1222] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur-sm">
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent shrink-0">
                    {getCategoryIcon(viewingCert.category)}
                    <span>{viewingCert.category}</span>
                  </span>
                  <span className="text-xs text-foreground/40 font-medium">
                    {viewingCert.year}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                  {viewingCert.title}
                </h3>
                <p className="text-xs text-foreground/60 truncate">
                  {viewingCert.issuer}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {isPdfFile(viewingCert.file) && viewingCert.file.includes("res.cloudinary.com") && (
                  <button
                    type="button"
                    onClick={() => {
                      setMediaLoading(true);
                      setPdfViewMode((prev) => (prev === "image" ? "pdf" : "image"));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground border border-white/10 transition-colors cursor-pointer"
                    title={pdfViewMode === "image" ? "Switch to interactive PDF document view" : "Switch to image view"}
                  >
                    <FileText className="w-3.5 h-3.5 text-accent" />
                    <span className="hidden sm:inline">
                      {pdfViewMode === "image" ? "PDF Document" : "Image View"}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={downloadingUrl === viewingCert.file}
                  onClick={() => handleDownload(viewingCert.file, viewingCert.title)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold bg-accent text-white hover:bg-accent/80 transition-all shadow-sm cursor-pointer disabled:opacity-60"
                  title="Download File"
                >
                  {downloadingUrl === viewingCert.file ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {downloadingUrl === viewingCert.file ? "Downloading..." : "Download"}
                  </span>
                </button>

                <a
                  href={viewingCert.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setViewingCert(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body / Viewer */}
            <div className="relative flex-1 overflow-auto bg-[#070b14] flex items-center justify-center min-h-[350px]">
              {mediaLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#070b14]/90 z-10 text-foreground/60">
                  <Loader2 className="w-7 h-7 animate-spin text-accent" />
                  <span className="text-xs font-medium tracking-wide">Loading credential...</span>
                </div>
              )}

              {isPdfFile(viewingCert.file) && pdfViewMode === "pdf" ? (
                <div className="w-full h-full flex flex-col">
                  <iframe
                    src={viewingCert.file}
                    className="w-full h-[65vh] md:h-[75vh] border-0 bg-white"
                    title={viewingCert.title}
                    onLoad={() => setMediaLoading(false)}
                  />
                  <div className="p-2.5 bg-black/60 border-t border-white/5 text-[11px] text-foreground/50 text-center">
                    Note: If document fails to load, ensure <span className="text-accent font-semibold">&quot;Allow delivery of PDF and ZIP files&quot;</span> is checked in Cloudinary Settings → Security.
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6 flex items-center justify-center w-full h-full">
                  <img
                    src={
                      isPdfFile(viewingCert.file) && viewingCert.file.includes("res.cloudinary.com")
                        ? viewingCert.file.replace(/\.pdf$/i, ".jpg")
                        : viewingCert.file
                    }
                    alt={viewingCert.title}
                    onLoad={() => setMediaLoading(false)}
                    onError={() => setMediaLoading(false)}
                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
