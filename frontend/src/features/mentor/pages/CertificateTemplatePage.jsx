import React, { useState } from "react";
import TemplateConfiguration from "../components/TemplateConfiguration";
import LiveCertificatePreview from "../components/LiveCertificatePreview";
import PreviewToolbar from "../components/PreviewToolbar";

import { useCertificateTemplate } from "../hooks/useCertificateTemplate";

const CertificateTemplatePage = () => {
  const certificate = useCertificateTemplate();

  const {
    templateData,
    isLoading,
  } = certificate;

  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () =>
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));

  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading template editor...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-gray-50 overflow-hidden">

      {/* Left Panel */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-white border-r border-gray-200 flex flex-col shadow-sm">

        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-semibold">
            Template Configuration
          </h1>

          <p className="text-sm text-gray-500 mt-1">
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
      <div className="flex-1 bg-slate-800 flex flex-col">

        <PreviewToolbar
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          zoomLevel={zoomLevel}
        />

        <div className="flex-1 overflow-auto flex items-center justify-center p-8">

          <div
            className="transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel})`,
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