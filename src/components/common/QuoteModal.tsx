"use client";

import React, { useState } from "react";
import Image from "next/image";
import AppModal from "@/components/ui/AppModal";
import RHFControl from "@/components/ui/inputs/RHFControl";
import { Send, Phone, User, Mail, MessageSquare, Sparkles, CheckCircle2, X } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  fullName: yup.string().required("Full name is required").min(3, "Too short"),
  phone: yup.string().required("Phone number is required").matches(/^[0-9+ ]+$/, "Invalid phone number"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().required("Please describe your project").min(10, "Provide more detail"),
}).required();

type FormData = yup.InferType<typeof schema>;

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function QuoteModal({ 
  isOpen, 
  onClose, 
  title = "Get a Premium Quote",
  subtitle = "Tell us about your project and our experts will contact you within 24 hours."
}: QuoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const modalBody = document.querySelector(".quote-modal-body");
        if (modalBody) {
          modalBody.scrollTop = 0;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    console.log("Form Data:", data);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      methods.reset();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <AppModal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      hideFooter
      hideHeader
      bodyClassName="p-0 quote-modal-body flex flex-col md:flex-row h-[550px] max-h-[85vh] overflow-hidden"
    >
      {/* Left Side - High-Impact Image */}
      <div className="hidden md:block md:w-1/3 lg:w-2/5 relative overflow-hidden h-full">
        <Image 
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
          alt="Western Interio"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-secondary/40 backdrop-blur-[2px]" />
        
        <div className="absolute inset-0 p-12 flex flex-col justify-between text-white">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 backdrop-blur-xl">
              <Sparkles size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Material Excellence</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Crafting Your <br /> <span className="text-primary">Masterpiece</span>.
            </h2>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm">
                   <Phone size={20} className="text-primary" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Expert Help</p>
                   <p className="text-lg font-bold">+91 99996 59940</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side - Premium Form */}
      <div className="w-full md:w-2/3 lg:w-3/5 p-6 lg:p-8 bg-white relative flex flex-col justify-center h-full overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-300 hover:text-secondary transition-colors cursor-pointer z-10"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
        {isSuccess ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-12 animate-in fade-in zoom-in duration-700">
             <div className="w-24 h-24 bg-green-50 text-green-500 flex items-center justify-center rounded-full shadow-2xl shadow-green-500/10">
                <CheckCircle2 size={48} />
             </div>
             <div className="space-y-3">
                <h3 className="text-3xl font-bold text-secondary uppercase tracking-tighter">Inquiry Sent</h3>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Our material consultants will contact you shortly.</p>
             </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-2xl lg:text-3xl font-bold text-secondary tracking-tight leading-none">{title}</h3>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.2em] leading-relaxed max-w-md">
                {subtitle}
              </p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <RHFControl 
                     control="input"
                     name="fullName"
                     label="Full Name"
                     placeholder="e.g. Mukesh Mahajan"
                     icon={<User size={18} />}
                   />
                   <RHFControl 
                     control="input"
                     name="phone"
                     label="Contact Number"
                     placeholder="+91 XXXXX XXXXX"
                     icon={<Phone size={18} />}
                   />
                </div>

                <RHFControl 
                  control="input"
                  name="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  icon={<Mail size={18} />}
                />

                <RHFControl 
                  control="textarea"
                  name="message"
                  label="Project Requirements"
                  placeholder="Describe your material needs..."
                  icon={<MessageSquare size={18} />}
                />

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 inline-flex items-center justify-center gap-3 bg-primary text-white font-bold tracking-widest text-xs rounded-lg transition-all duration-500 hover:bg-secondary shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : (
                    <>
                      Submit Inquiry
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </FormProvider>
          </div>
        )}
      </div>
    </AppModal>
  );
}
