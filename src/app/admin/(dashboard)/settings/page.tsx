"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Save,
  Mail,
  Phone,
  MapPin,
  Share2,
  Link as LinkIcon,
  Globe,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui";
import { useAppToast } from "@/components/ui/AppToast";

import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFControl from "@/components/ui/inputs/RHFControl";
import { apiGet, apiPut } from "@/lib/api";

const contactSchema = yup.object().shape({
  supportEmail: yup
    .string()
    .email("Invalid email")
    .required("Support email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  storeAddress: yup.string().required("Store address is required"),
});

const socialSchema = yup.object().shape({
  instagramUrl: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .url("Invalid URL")
    .defined(),
  facebookUrl: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .url("Invalid URL")
    .defined(),
  twitterUrl: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .url("Invalid URL")
    .defined(),
});

interface ContactSettingsData {
  supportEmail: string;
  phoneNumber: string;
  storeAddress: string;
}

type SocialSettingsData = yup.InferType<typeof socialSchema>;

export default function AdminSettingsPage() {
  const { addToast } = useAppToast();
  const [activeTab, setActiveTab] = useState("contact");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const contactMethods = useForm<ContactSettingsData>({
    mode: "onChange",
    resolver: yupResolver(contactSchema),
    defaultValues: {
      supportEmail: "info@westerninterio.in",
      phoneNumber: "+91 95406 41111",
      storeAddress: "Plot No. 06, Gali No.-06, Kadipur Industrial Area, Gurugram, Haryana – 122505",
    },
  });

  const socialMethods = useForm<SocialSettingsData>({
    mode: "onChange",
    resolver: yupResolver(socialSchema),
    defaultValues: {
      instagramUrl: "",
      facebookUrl: "",
      twitterUrl: "",
    },
  });

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch contact details
      try {
        const contactRes = await apiGet<ContactSettingsData>("/api/settings/bdm_settings_contact");
        if (contactRes.success && contactRes.data) {
          contactMethods.reset(contactRes.data);
        }
      } catch (e) {
        console.warn("Failed to load contact settings from API, using defaults:", e);
      }

      // Fetch social details
      try {
        const socialRes = await apiGet<SocialSettingsData>("/api/settings/bdm_settings_social");
        if (socialRes.success && socialRes.data) {
          socialMethods.reset(socialRes.data);
        }
      } catch (e) {
        console.warn("Failed to load social settings from API, using defaults:", e);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while loading settings");
    } finally {
      setIsLoading(false);
      setIsMounted(true);
    }
  }, [contactMethods, socialMethods]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const onSubmitContact = async (data: ContactSettingsData) => {
    setIsSaving(true);
    try {
      await apiPut("/api/settings/bdm_settings_contact", data);
      addToast({
        title: "Contact Settings Saved",
        message: "Store contact information has been updated successfully.",
        variant: "success",
      });
    } catch (err: unknown) {
      addToast({
        title: "Error Saving Settings",
        message: err instanceof Error ? err.message : "Failed to save contact settings",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitSocial = async (data: SocialSettingsData) => {
    setIsSaving(true);
    try {
      await apiPut("/api/settings/bdm_settings_social", data);
      addToast({
        title: "Social Links Saved",
        message: "Store social media profiles have been updated successfully.",
        variant: "success",
      });
    } catch (err: unknown) {
      addToast({
        title: "Error Saving Settings",
        message: err instanceof Error ? err.message : "Failed to save social links",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMounted || isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Manage store configuration and details
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex justify-center items-center shadow-sm">
          <div className="w-6 h-6 border-2 border-[#ed1c27]/20 border-t-[#ed1c27] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Manage store configuration and details
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 text-red-600 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={18} />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={loadSettings} className="ml-auto text-xs underline cursor-pointer font-bold uppercase tracking-widest">
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <Card>
            <Card.Body>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  id="tab-btn-contact"
                  onClick={() => setActiveTab("contact")}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                    activeTab === "contact"
                      ? "bg-[#ed1c27]/10 text-[#ed1c27]"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Contact Details
                </button>
                <button
                  type="button"
                  id="tab-btn-social"
                  onClick={() => setActiveTab("social")}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                    activeTab === "social"
                      ? "bg-[#ed1c27]/10 text-[#ed1c27]"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Social Links
                </button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Form Content */}
        <div className="flex-1">
          <Card>
            {/* Contact Settings */}
            {activeTab === "contact" && (
              <FormProvider {...contactMethods}>
                <form onSubmit={contactMethods.handleSubmit(onSubmitContact)} noValidate>
                  <Card.Header>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Mail size={18} className="text-emerald-500" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-tight">
                          Contact Information
                        </h2>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          How customers can reach you
                        </p>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RHFControl
                        control="input"
                        name="supportEmail"
                        label="Support Email"
                        type="email"
                        icon={<Mail size={16} />}
                        placeholder="info@westerninterio.in"
                      />
                      <RHFControl
                        control="input"
                        name="phoneNumber"
                        label="Phone Number"
                        type="tel"
                        icon={<Phone size={16} />}
                        placeholder="+91 95406 41111"
                      />
                      <div className="md:col-span-2">
                        <RHFControl
                          control="textarea"
                          name="storeAddress"
                          label="Store Address"
                          icon={<MapPin size={16} />}
                          placeholder="Plot No. 06, Gali No.-06, Kadipur Industrial Area, Gurugram, Haryana – 122505"
                        />
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer className="justify-end">
                    <button
                      id="save-contact-btn"
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-6 py-3.5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={14} /> {isSaving ? "Saving..." : "Save Contact Details"}
                    </button>
                  </Card.Footer>
                </form>
              </FormProvider>
            )}

            {/* Social Settings */}
            {activeTab === "social" && (
              <FormProvider {...socialMethods}>
                <form onSubmit={socialMethods.handleSubmit(onSubmitSocial)} noValidate>
                  <Card.Header>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                        <Share2 size={18} className="text-violet-500" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-tight">
                          Social Profiles
                        </h2>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          Connect your social media accounts
                        </p>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-5">
                      <RHFControl
                        control="input"
                        name="instagramUrl"
                        label="Instagram URL"
                        type="text"
                        icon={<LinkIcon size={16} className="text-pink-500" />}
                        placeholder="https://instagram.com/..."
                      />
                      <RHFControl
                        control="input"
                        name="facebookUrl"
                        label="Facebook URL"
                        type="text"
                        icon={<Globe size={16} className="text-blue-600" />}
                        placeholder="https://facebook.com/..."
                      />
                      <RHFControl
                        control="input"
                        name="twitterUrl"
                        label="Twitter URL"
                        type="text"
                        icon={<LinkIcon size={16} className="text-sky-500" />}
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </Card.Body>
                  <Card.Footer className="justify-end">
                    <button
                      id="save-social-btn"
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-6 py-3.5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={14} /> {isSaving ? "Saving..." : "Save Social Links"}
                    </button>
                  </Card.Footer>
                </form>
              </FormProvider>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
