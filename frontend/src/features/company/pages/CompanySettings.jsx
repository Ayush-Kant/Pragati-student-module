import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  FiUpload,
  FiSave,
  FiAlertCircle,
  FiMapPin,
  FiMail,
  FiGlobe,
  FiBriefcase,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import "./../styles/companySettings.css";
import {
  companySettingsSchema,
  logoUploadSchema,
} from "../validation/settingsSchema";
import {
  getCompanySettings,
  updateCompanySettings,
  uploadCompanyLogo,
} from "../services/companyService";

const CompanySettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] =
    useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errorBanner, setErrorBanner] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      companyName: "Pragati Technologies",
      industry: "Information Technology",
      website: "https://www.pragati.tech",
      contactEmail: "contact@pragati.tech",
      companyAddress:
        "123 Tech Park, Whitefield, Bangalore, Karnataka 560066, India",
      defaultWorkMode: "Hybrid",
      probationPeriod: 3,
      noticePeriod: 30,
      currency: "INR",
      notifications: {
        emailNotifications: true,
        interviewReminders: true,
        weeklyAnalyticsReport: false,
        offerNotifications: true,
      },
    },
  });

  /* Load Settings on Mount */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setErrorBanner(null);
        const data = await getCompanySettings();
        reset(data || {});
        setLogoPreview(data?.companyLogo || null);
      } catch (error) {
        console.error("Error loading settings:", error);
        /* Don't show error banner on initial load - only show on form submission failure */
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [reset]);

  /* Handle Logo Upload */
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const validation = logoUploadSchema.safeParse({
        file,
      });

      if (!validation.success) {
        const errorMsg =
          validation.error.errors[0]?.message ||
          "Invalid file";
        toast.error(errorMsg);
        return;
      }

      setIsUploadingLogo(true);
      const response = await uploadCompanyLogo(file);

      setLogoPreview(
        response.logoUrl ||
          URL.createObjectURL(file)
      );
      toast.success(
        "Company logo updated successfully"
      );
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to upload logo"
      );
    } finally {
      setIsUploadingLogo(false);
    }
  };

  /* Handle Form Submission */
  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      setErrorBanner(null);
      await updateCompanySettings(data);
      reset(data);
      toast.success(
        "Company settings saved successfully"
      );
    } catch (error) {
      setErrorBanner(
        error.response?.data?.message ||
          "Failed to save settings. Please try again."
      );
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="company-settings">
      <div className="settings-header">
        <h1>Company Settings</h1>
        <p>Manage your company profile and preferences</p>
      </div>

      {/* Error Banner */}
      {errorBanner && (
        <div className="error-banner">
          <FiAlertCircle className="error-icon" />
          <span>{errorBanner}</span>
          <button
            onClick={() => setErrorBanner(null)}
            className="error-close"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="settings-container">
          {/* Section 1: Company Logo */}
          <div className="settings-section">
            <h2>Company Logo</h2>
            <div className="section-content logo-section">
              <div className="logo-box">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                  />
                ) : (
                  <span>P</span>
                )}
              </div>
              <div className="logo-upload">
                <label htmlFor="logo-input">
                  <button
                    type="button"
                    className="upload-btn"
                    disabled={isUploadingLogo}
                    onClick={() =>
                      document
                        .getElementById("logo-input")
                        .click()
                    }
                  >
                    <FiUpload /> Upload New Logo
                  </button>
                </label>
                <input
                  id="logo-input"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                  hidden
                />
                <p className="logo-hint">
                  Recommended: 512x512px, PNG or JPG
                </p>
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Section 2: Company Information */}
          <div className="settings-section">
            <h2>Company Information</h2>
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="companyName">
                    Company Name
                  </label>
                  <div className="input-wrapper">
                    <FaBuilding className="input-icon" />
                    <Controller
                      name="companyName"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="companyName"
                          type="text"
                          className={`form-input ${
                            errors.companyName
                              ? "error"
                              : ""
                          }`}
                        />
                      )}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="error-message">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="industry">
                    Industry
                  </label>
                  <div className="input-wrapper">
                    <FiBriefcase className="input-icon" />
                    <Controller
                      name="industry"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          id="industry"
                          className={`form-input ${
                            errors.industry ? "error" : ""
                          }`}
                        >
                          <option value="">
                            Select Industry
                          </option>
                          <option value="Information Technology">
                            Information Technology
                          </option>
                          <option value="Financial">
                            Financial
                          </option>
                          <option value="Healthcare">
                            Healthcare
                          </option>
                          <option value="E-commerce">
                            E-commerce
                          </option>
                          <option value="Manufacturing">
                            Manufacturing
                          </option>
                          <option value="Education">
                            Education
                          </option>
                        </select>
                      )}
                    />
                  </div>
                  {errors.industry && (
                    <p className="error-message">
                      {errors.industry.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="website">
                    Website
                  </label>
                  <div className="input-wrapper">
                    <FiGlobe className="input-icon" />
                    <Controller
                      name="website"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="website"
                          type="url"
                          className={`form-input ${
                            errors.website ? "error" : ""
                          }`}
                        />
                      )}
                    />
                  </div>
                  {errors.website && (
                    <p className="error-message">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="contactEmail">
                    Contact Email
                  </label>
                  <div className="input-wrapper">
                    <FiMail className="input-icon" />
                    <Controller
                      name="contactEmail"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="contactEmail"
                          type="email"
                          className={`form-input ${
                            errors.contactEmail
                              ? "error"
                              : ""
                          }`}
                        />
                      )}
                    />
                  </div>
                  {errors.contactEmail && (
                    <p className="error-message">
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-row full-width">
                <div className="form-group">
                  <label htmlFor="companyAddress">
                    Company Address
                  </label>
                  <div className="input-wrapper">
                    <FiMapPin className="input-icon" />
                    <Controller
                      name="companyAddress"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          id="companyAddress"
                          rows={4}
                          className={`form-input ${
                            errors.companyAddress
                              ? "error"
                              : ""
                          }`}
                        />
                      )}
                    />
                  </div>
                  {errors.companyAddress && (
                    <p className="error-message">
                      {errors.companyAddress.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Section 3: Recruitment Preferences */}
          <div className="settings-section">
            <h2>Recruitment Preferences</h2>
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="defaultWorkMode">
                    Default Work Mode
                  </label>
                  <Controller
                    name="defaultWorkMode"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="defaultWorkMode"
                        className={`form-input ${
                          errors.defaultWorkMode
                            ? "error"
                            : ""
                        }`}
                      >
                        <option value="Hybrid">
                          Hybrid
                        </option>
                        <option value="Remote">
                          Remote
                        </option>
                        <option value="On-site">
                          On-site
                        </option>
                      </select>
                    )}
                  />
                  {errors.defaultWorkMode && (
                    <p className="error-message">
                      {errors.defaultWorkMode.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="probationPeriod">
                    Probation Period (months)
                  </label>
                  <Controller
                    name="probationPeriod"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="probationPeriod"
                        type="number"
                        min="0"
                        max="12"
                        onChange={(e) =>
                          field.onChange(
                            parseInt(e.target.value)
                          )
                        }
                        className={`form-input ${
                          errors.probationPeriod
                            ? "error"
                            : ""
                        }`}
                      />
                    )}
                  />
                  {errors.probationPeriod && (
                    <p className="error-message">
                      {errors.probationPeriod.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="noticePeriod">
                    Notice Period (days)
                  </label>
                  <Controller
                    name="noticePeriod"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="noticePeriod"
                        type="number"
                        min="0"
                        max="180"
                        onChange={(e) =>
                          field.onChange(
                            parseInt(e.target.value)
                          )
                        }
                        className={`form-input ${
                          errors.noticePeriod ? "error" : ""
                        }`}
                      />
                    )}
                  />
                  {errors.noticePeriod && (
                    <p className="error-message">
                      {errors.noticePeriod.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="currency">
                    Currency
                  </label>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="currency"
                        className={`form-input ${
                          errors.currency ? "error" : ""
                        }`}
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    )}
                  />
                  {errors.currency && (
                    <p className="error-message">
                      {errors.currency.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Section 4: Notification Settings */}
          <div className="settings-section">
            <h2>Notification Settings</h2>
            <div className="section-content notification-section">
              <div className="notification-item">
                <div className="checkbox-wrapper">
                  <Controller
                    name="notifications.emailNotifications"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="checkbox"
                        id="emailNotif"
                        checked={field.value}
                        className="checkbox-input"
                      />
                    )}
                  />
                  <label
                    htmlFor="emailNotif"
                    className="checkbox-label"
                  >
                    Email notifications for new
                    applications
                  </label>
                </div>
                <p className="notification-desc">
                  Get notified when candidates submit
                  applications
                </p>
              </div>

              <div className="notification-item">
                <div className="checkbox-wrapper">
                  <Controller
                    name="notifications.interviewReminders"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="checkbox"
                        id="interviewReminders"
                        checked={field.value}
                        className="checkbox-input"
                      />
                    )}
                  />
                  <label
                    htmlFor="interviewReminders"
                    className="checkbox-label"
                  >
                    Interview reminders
                  </label>
                </div>
                <p className="notification-desc">
                  Receive reminders before scheduled
                  interviews
                </p>
              </div>

              <div className="notification-item">
                <div className="checkbox-wrapper">
                  <Controller
                    name="notifications.weeklyAnalyticsReport"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="checkbox"
                        id="weeklyAnalytics"
                        checked={field.value}
                        className="checkbox-input"
                      />
                    )}
                  />
                  <label
                    htmlFor="weeklyAnalytics"
                    className="checkbox-label"
                  >
                    Weekly analytics report
                  </label>
                </div>
                <p className="notification-desc">
                  Get a weekly summary of recruitment
                  metrics
                </p>
              </div>

              <div className="notification-item">
                <div className="checkbox-wrapper">
                  <Controller
                    name="notifications.offerNotifications"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="checkbox"
                        id="offerNotif"
                        checked={field.value}
                        className="checkbox-input"
                      />
                    )}
                  />
                  <label
                    htmlFor="offerNotif"
                    className="checkbox-label"
                  >
                    Offer acceptance/decline
                    notifications
                  </label>
                </div>
                <p className="notification-desc">
                  Get notified when candidates respond
                  to offers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isDirty || isSaving}
          >
            {isSaving ? (
              <>
                <span className="spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;
