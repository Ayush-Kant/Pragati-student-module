import React, { useState } from "react";
import TemplateConfiguration from "../components/TemplateConfiguration";
import LiveCertificatePreview from "../components/LiveCertificatePreview";
import PreviewToolbar from "../components/PreviewToolbar";
import { useCertificateTemplate } from "../hooks/useCertificateTemplate";

const CertificateTemplatePage = () => {
  const certificate = useCertificateTemplate();
  const { templateData, isLoading } = certificate;
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleDownload = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading template editor...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-white">
      {/* Left Panel */}
      <div className="flex w-[420px] flex-col border-r border-gray-200 bg-white shadow-sm z-10">
        <div className="border-b p-6">
          <h1 className="text-xl font-bold text-gray-900">
            Template Configuration
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Design your premium completion certificate.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <TemplateConfiguration
            templateData={templateData}
            certificate={certificate}
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className="relative flex-1 overflow-hidden bg-[#283142]">
        <div className="absolute top-6 left-6 right-6 z-20">
          <PreviewToolbar
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onDownload={handleDownload}
          />
        </div>

        <div className="flex h-full w-full items-center justify-center overflow-auto p-12">
          <div
            className="transition-transform duration-300"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
          >
            <LiveCertificatePreview data={templateData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplatePage;