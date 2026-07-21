import React from "react";
import { Save } from "lucide-react";
import LogoUploadDropzone from "./LogoUploadDropzone";
import BrandColorPicker from "./BrandColorPicker";
import MentorSignatureManager from "./MentorSignatureManager";
import SkillTagInput from "./SkillTagInput";

const TemplateConfiguration = ({ templateData, certificate }) => {
  const { watch, setValue, errors, handleSubmit, onSubmit, isSaving, register } = certificate;

  const sectionHeaderClass = "mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-500";

  return (
    <div className="flex h-full flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 space-y-8 pr-2 pb-8">
        {/* Logo */}
        <section>
          <h3 className={sectionHeaderClass}>Organization Logo</h3>
          <LogoUploadDropzone watch={watch} setValue={setValue} errors={errors} />
        </section>

        {/* Brand Colors */}
        <section>
          <h3 className={sectionHeaderClass}>Brand Colors</h3>
          <BrandColorPicker register={register} watch={watch} setValue={setValue} errors={errors} />
        </section>

        {/* Signature */}
        <section>
          <h3 className={sectionHeaderClass}>Mentor Signature</h3>
          <MentorSignatureManager watch={watch} setValue={setValue} errors={errors} />
        </section>

        {/* Skills */}
        <section>
          <h3 className={sectionHeaderClass}>Acquired Skills</h3>
          <SkillTagInput watch={watch} setValue={setValue} />
        </section>
      </div>

      {/* Save Button */}
      <div className="bg-white pt-4">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-[#2563eb] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          <Save size={18} className="mr-2" />
          {isSaving ? "Saving Template..." : "Save Template"}
        </button>
      </div>
    </div>
  );
};

export default TemplateConfiguration;