"use client";

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AppModal from './AppModal';
import RHFControl from './inputs/RHFControl';
import { useAppToast } from './AppToast';
import { User, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import Image from 'next/image';
import siteContent from "@/data/site-content.json";


const schema = yup.object().shape({
    fullName: yup.string().required('Full name is required').min(3, 'Name too short'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required').matches(/^[0-9+ ]{10,15}$/, 'Invalid phone number'),
    message: yup.string(),
});

interface Product {
  name: string;
  catNo?: string;
  id: string;
  brand?: string;
  images: string[];
}

interface QuoteFormData {
  fullName: string;
  email: string;
  phone: string;
  message?: string;
}

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, product }) => {
    const { addToast } = useAppToast();
    const contact = siteContent.common.contact;

    const methods = useForm<QuoteFormData>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            message: `I'm interested in ${product?.name}.`,
        }
    });

    // Reset message when product changes
    React.useEffect(() => {
        if (product) {
            methods.setValue('message', `I'm interested in ${product.name}.`);
        }
    }, [product, methods]);

    const onSubmit = (data: QuoteFormData) => {
        const whatsappMessage = `*Quote Request from ${data.fullName}*\n\n` +
            `*Product:* ${product.name}\n` +
            `*Model:* ${product.catNo || 'N/A'}\n` +
            `*Email:* ${data.email}\n` +
            `*Phone:* ${data.phone}\n` +
            `*Message:* ${data.message}`;

        const phone = contact.phones[0].replace(/[^0-9]/g, ""); // Clean mobile phone
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
        
        addToast({
            title: 'Inquiry Sent',
            message: 'Your request has been prepared for WhatsApp.',
            variant: 'success'
        });
        
        onClose();
        methods.reset({
            fullName: '',
            email: '',
            phone: '',
            message: `I'm interested in ${product?.name}.`,
        });
    };

    if (!product) return null;

    return (
        <AppModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Request A Quote" 
            size="md"
            footer={
                <div className="flex w-full gap-4">
                    <button 
                        className="flex-1 inline-flex items-center justify-center px-7 py-3.5 bg-transparent border-2 border-secondary text-secondary font-extrabold uppercase tracking-[0.15em] text-[11px] rounded-lg transition-all duration-500 hover:bg-secondary hover:text-white cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="quote-form" 
                        className="flex-[2] inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-primary text-white font-extrabold uppercase tracking-[0.15em] text-[11px] rounded-lg transition-all duration-500 hover:bg-secondary shadow-xl shadow-primary/20 hover:shadow-secondary/20 cursor-pointer"
                    >
                        <Send size={14} />
                        Send Request
                    </button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Product Summary */}
                <div className="flex gap-5 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 group">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-soft">
                        <Image 
                            src={product.images[0]} 
                            alt={product.name} 
                            fill 
                            className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                        />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{product.brand}</p>
                        <h4 className="text-base font-black uppercase leading-tight text-secondary line-clamp-1">{product.name}</h4>
                        <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">
                            {product.catNo ? `Model: ${product.catNo}` : `SKU: ${product.id.slice(0, 8).toUpperCase()}`}
                        </p>
                    </div>
                </div>

                <FormProvider {...methods}>
                    <form 
                        id="quote-form" 
                        onSubmit={methods.handleSubmit(onSubmit)} 
                        className="space-y-4"
                    >
                        <RHFControl 
                            control="input"
                            name="fullName"
                            label="Full Name"
                            placeholder="e.g. Rahul Sharma"
                            icon={<User size={16} />}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <RHFControl 
                                control="input"
                                name="email"
                                label="Email Address"
                                placeholder="name@example.com"
                                type="email"
                                icon={<Mail size={16} />}
                            />
                            <RHFControl 
                                control="input"
                                name="phone"
                                label="Phone Number"
                                placeholder="+91 99999 99999"
                                icon={<Phone size={16} />}
                            />
                        </div>
                        <RHFControl 
                            control="textarea"
                            name="message"
                            label="Message (Optional)"
                            placeholder="Tell us about your requirements..."
                            icon={<MessageSquare size={16} />}
                        />
                    </form>
                </FormProvider>

                <p className="text-[9px] text-center text-gray-400 uppercase font-bold tracking-widest">
                    Your request will be sent directly to our team via WhatsApp
                </p>
            </div>
        </AppModal>
    );
};

export default QuoteModal;
