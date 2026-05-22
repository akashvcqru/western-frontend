"use client";
import React, { useState, useEffect } from "react";
import {
  Save,
  Mail,
  Phone,
  MapPin,
  Share2,
  Link as LinkIcon,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui";
import { useAppToast } from "@/components/ui/AppToast";

import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFControl from "@/components/ui/inputs/RHFControl";

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

  const contactMethods = useForm<ContactSettingsData>({
    mode: "onChange",
    resolver: yupResolver(contactSchema),
    defaultValues: {
      supportEmail: "info@bawadittamal.com",
      phoneNumber: "+91 98765 43210",
      storeAddress: "123, Building Material Market, New Delhi, 110001",
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

  // Load configuration from sessionStorage after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      
      const storedContact = sessionStorage.getItem("bdm_settings_contact");
      if (storedContact) {
        try {
          contactMethods.reset(JSON.parse(storedContact));
        } catch (e) {
          console.error("Failed to parse stored contact settings:", e);
        }
      }

      const storedSocial = sessionStorage.getItem("bdm_settings_social");
      if (storedSocial) {
        try {
          socialMethods.reset(JSON.parse(storedSocial));
        } catch (e) {
          console.error("Failed to parse stored social settings:", e);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [contactMethods, socialMethods]);

  const onSubmitContact = (data: ContactSettingsData) => {
    sessionStorage.setItem("bdm_settings_contact", JSON.stringify(data));
    addToast({
      title: "Contact Settings Saved",
      message: "Store contact information has been updated successfully.",
      variant: "success",
    });
  };

  const onSubmitSocial = (data: SocialSettingsData) => {
    sessionStorage.setItem("bdm_settings_social", JSON.stringify(data));
    addToast({
      title: "Social Links Saved",
      message: "Store social media profiles have been updated successfully.",
      variant: "success",
    });
  };

  if (!isMounted) {
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
                        placeholder="info@bawadittamal.com"
                      />
                      <RHFControl
                        control="input"
                        name="phoneNumber"
                        label="Phone Number"
                        type="tel"
                        icon={<Phone size={16} />}
                        placeholder="+91 98765 43210"
                      />
                      <div className="md:col-span-2">
                        <RHFControl
                          control="textarea"
                          name="storeAddress"
                          label="Store Address"
                          icon={<MapPin size={16} />}
                          placeholder="123, Building Material Market, New Delhi, 110001"
                        />
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer className="justify-end">
                    <button
                      id="save-contact-btn"
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-6 py-3.5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
                    >
                      <Save size={14} /> Save Contact Details
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
                      className="inline-flex items-center justify-center gap-2 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.12em] text-[10px] rounded-xl px-6 py-3.5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ed1c27]/25"
                    >
                      <Save size={14} /> Save Social Links
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

