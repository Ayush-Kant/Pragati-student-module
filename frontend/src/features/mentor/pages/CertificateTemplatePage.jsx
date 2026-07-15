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
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-gray-100">

      {/* Left Panel */}
      <div className="flex w-[420px] flex-col border-r border-gray-200 bg-white">

        <div className="border-b p-6">
          <h1 className="text-xl font-semibold">
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
      <div className="flex-1 overflow-auto bg-slate-900">

        <div className="mx-auto flex w-full max-w-[1000px] flex-col p-6">

          <PreviewToolbar
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onDownload={handleDownload}
            zoomLevel={zoomLevel}
          />

          <div
            className="mt-6 transition-transform duration-300"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top center",
            }}
          >
            <LiveCertificatePreview
              data={templateData}
            />
          </div>

        </div>

      </div>

    </div>
  );
};

export default CertificateTemplatePage;