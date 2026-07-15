import React from "react";

import LogoUploadDropzone from "./LogoUploadDropzone";
import BrandColorPicker from "./BrandColorPicker";
import MentorSignatureManager from "./MentorSignatureManager";
import SkillTagInput from "./SkillTagInput";

const TemplateConfiguration = ({
  templateData,
  certificate,
}) => {
  const {
    register,
    watch,
    setValue,
    errors,
    handleSubmit,
    onSubmit,
    isSaving,
  } = certificate;

  return (
    <div className="space-y-8 pb-24 relative min-h-full">

      {/* Logo Upload */}
      <section>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Organization Logo
        </label>

        <LogoUploadDropzone
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
      </section>

      {/* Brand Colors */}
      <section>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Brand Colors
        </label>

        <BrandColorPicker
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
      </section>

      {/* Mentor Signature */}
      <section>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Mentor Signature
        </label>

        <MentorSignatureManager
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
      </section>

      {/* Skills */}
      <section>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Acquired Skills
        </label>

        <SkillTagInput
          watch={watch}
          setValue={setValue}
        />
      </section>

      {/* Live Preview Information */}
      {templateData && (
        <section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold mb-3">
            Current Template
          </h3>

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Primary Color</span>
              <span className="font-medium">
                {watch("primaryColor")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Secondary Color</span>
              <span className="font-medium">
                {watch("secondaryColor")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Skills</span>
              <span className="font-medium">
                {(watch("skills") || []).length}
              </span>
            </div>

          </div>
        </section>
      )}

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white pt-4 border-t">

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {isSaving ? "Saving Template..." : "Save Template"}
        </button>

      </div>

    </div>
  );
};

export default TemplateConfiguration;