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
    <div className="flex h-full flex-col">

      {/* Scrollable Content */}
      <div className="flex-1 space-y-8 overflow-y-auto pr-2 pb-8">

        {/* Logo */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Organization Logo
          </h3>

          <LogoUploadDropzone
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
        </section>

        {/* Brand Colors */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Brand Colors
          </h3>

          <BrandColorPicker
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
        </section>

        {/* Signature */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Mentor Signature
          </h3>

          <MentorSignatureManager
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
        </section>

        {/* Skills */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Acquired Skills
          </h3>

          <SkillTagInput
            watch={watch}
            setValue={setValue}
          />
        </section>

       

      </div>

      {/* Save Button */}
      <div className="border-t bg-white pt-4">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="h-12 w-full rounded-lg bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >  <span className="text-xl font-bold">+</span>

          {isSaving ? "Saving Template..." : "Save Template"}
        </button>
      </div>

    </div>
  );
};

export default TemplateConfiguration;