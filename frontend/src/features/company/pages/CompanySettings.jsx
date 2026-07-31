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
import { UserPlus, UserX, ToggleLeft, ToggleRight, Edit2, X } from "lucide-react";
import "./../styles/companySettings.css";
import {
  companySettingsSchema,
  logoUploadSchema,
} from "../validation/settingsSchema";
import {
  getCompanySettings,
  updateCompanySettings,
  uploadCompanyLogo,
  getCompanyTeam,
  addCompanyTeamMember,
  updateCompanyTeamMember,
  deleteCompanyTeamMember,
} from "../services/companyService";

const CompanySettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] =
    useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errorBanner, setErrorBanner] = useState(null);

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'team'
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: "",
    email: "",
    role: "Recruiter"
  });

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

  const fetchTeam = async () => {
    try {
      setLoadingTeam(true);
      const res = await getCompanyTeam();
      setTeam(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load team members");
    } finally {
      setLoadingTeam(false);
    }
  };

  useEffect(() => {
    if (activeTab === "team") {
      fetchTeam();
    }
  }, [activeTab]);

  const handleTeamFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await updateCompanyTeamMember(editingMember.id, {
          role: teamForm.role,
          is_active: editingMember.is_active
        });
        toast.success("Recruiter role updated successfully!");
      } else {
        await addCompanyTeamMember({
          full_name: teamForm.name,
          email: teamForm.email,
          role: teamForm.role
        });
        toast.success("Recruiter added successfully!");
      }
      setShowTeamModal(false);
      setEditingMember(null);
      fetchTeam();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save team member");
    }
  };

  const handleToggleActive = async (member) => {
    try {
      await updateCompanyTeamMember(member.id, {
        role: member.role,
        is_active: !member.is_active
      });
      toast.success("Recruiter status updated!");
      fetchTeam();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to remove this recruiter?")) return;
    try {
      await deleteCompanyTeamMember(id);
      toast.success("Recruiter removed from team");
      fetchTeam();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove recruiter");
    }
  };

  return (
    <div className="company-settings">
      <div className="settings-header">
        <h1>Company Settings</h1>
        <p>Manage your company profile and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-1 transition-all ${
            activeTab === "profile" 
              ? "text-blue-600 border-b-2 border-blue-600 font-bold" 
              : "text-gray-400 hover:text-gray-600"
          } cursor-pointer`}
        >
          Company Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("team")}
          className={`pb-3 px-1 transition-all ${
            activeTab === "team" 
              ? "text-blue-600 border-b-2 border-blue-600 font-bold" 
              : "text-gray-400 hover:text-gray-600"
          } cursor-pointer`}
        >
          Team Management
        </button>
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

      {activeTab === "profile" && (
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
      )}

      {activeTab === "team" && (
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Recruiter & Team Management</h2>
              <p className="text-xs text-slate-400 mt-1">Configure recruiter roles and manage organizational access.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingMember(null);
                setTeamForm({ name: "", email: "", role: "Recruiter" });
                setShowTeamModal(true);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <UserPlus size={14} />
              Add Recruiter
            </button>
          </div>

          {loadingTeam ? (
            <div className="flex justify-center py-12">
              <span className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-slate-400 text-sm">No recruiters found on your team.</p>
              <p className="text-xs text-slate-300">Click "Add Recruiter" to invite team members.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Name & Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {team.map((member) => (
                    <tr key={member.id} className="text-sm hover:bg-slate-50/50 transition">
                      <td className="py-4 pl-2">
                        <p className="font-semibold text-slate-800">{member.full_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{member.email}</p>
                      </td>
                      <td className="py-4 font-medium text-slate-600 capitalize">
                        {member.role}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          member.is_active 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {member.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2 space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMember(member);
                            setTeamForm({ name: member.full_name, email: member.email, role: member.role });
                            setShowTeamModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition inline-flex cursor-pointer"
                          title="Change Role"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(member)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 rounded hover:bg-slate-100 transition inline-flex cursor-pointer"
                          title={member.is_active ? "Deactivate" : "Activate"}
                        >
                          {member.is_active ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition inline-flex cursor-pointer"
                          title="Remove Recruiter"
                        >
                          <UserX size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showTeamModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{editingMember ? "Edit Recruiter" : "Add Recruiter"}</h3>
                <p className="text-xs text-slate-500 mt-1">Configure recruiter access rights</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTeamModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTeamFormSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingMember}
                    value={teamForm.name}
                    onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Raj Mehta"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    disabled={!!editingMember}
                    value={teamForm.email}
                    onChange={(e) => setTeamForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. raj@company.com"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Access Role</label>
                  <select
                    value={teamForm.role}
                    onChange={(e) => setTeamForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="HR Manager">HR Manager</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Interviewer">Interviewer</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-xl hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl transition"
                >
                  {editingMember ? "Save Changes" : "Invite Recruiter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySettings;
