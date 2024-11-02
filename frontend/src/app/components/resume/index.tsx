"use client";
import React, { useRef } from "react";
import Summary from "./summary";
import Skills from "./skills";
import Experience from "./experience";
import Education from "./education";
import PersonalInformation from "./personal-information";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

interface ResumeProps {
  resume: {
    certifications?: string[];
    education?: string[];
    experience: {
      company: string;
      title: string;
      dates: string;
      jobDetails: string;
    }[];
    projects?: {
      company: string;
      title: string;
      dates: string;
      jobDetails: string;
    }[];
    skills?: string[];
    summary: string;
    user: {
      fullName: string;
      title: string;
      linkedIn: string;
      email: string;
      city: string;
    };
  };
}
const Resume: React.FC<ResumeProps> = (props) => {
  const reportTemplateRef = useRef(null);

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        doc.save("document");
      },
    });
  };

  const createFileName = (extension = "", ...names) => {
    if (!extension) {
      return "";
    }
    return `${names.join("")}.${extension}`;
  };

  const downloadFile = (
    image,
    { name = "meme-shot", extension = "jpg" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const handleMemeDownload = async () => {
    if (!reportTemplateRef.current) return;
    await htmlToImage.toJpeg(reportTemplateRef.current).then(downloadFile);
    alert("Meme saved as meme-shot.jpg");
  };

  return (
    <div>
      <button className="button" onClick={handleGeneratePdf}>
        Generate PDF
      </button>

      <div
        className={"grid grid-flow-row gap-y-1 bg-white p-5 self-center"}
        ref={reportTemplateRef}
      >
        <PersonalInformation personalInformation={{ ...props.resume.user }} />
        <Summary text={props.resume.summary} />
        {props.resume.skills && <Skills skiils={props.resume.skills} />}
        <Experience title="Experience" experiences={props.resume.experience} />
        {props.resume.projects?.length && (
          <Experience title="Projects" experiences={props.resume.projects} />
        )}
        {props.resume.education && (
          <Education educations={props.resume.education} />
        )}
      </div>
    </div>
  );
};

export default Resume;
