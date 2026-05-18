import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Bawa Ditta Mal Galleria",
  description: "Learn about how Bawa Ditta Mal Galleria collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-secondary">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,transparent_70%)]" />
        <div className="container relative px-4 mx-auto text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Your privacy is important to us. This policy outlines how we handle your data.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-8">
              Last Updated: May 7, 2026
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">1. Information We Collect</h2>
            <p className="mb-6">
              We collect information that you provide directly to us when you visit our showroom, make a purchase, 
              subscribe to our newsletter, or contact us through our website. This may include:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Name and contact details (email, phone number, address)</li>
              <li>Billing and payment information</li>
              <li>Product preferences and purchase history</li>
              <li>Communications you send to us</li>
            </ul>

            <h2 className="text-2xl font-medium mb-4 text-foreground">2. How We Use Your Information</h2>
            <p className="mb-6">
              Bawa Ditta Mal Galleria uses the collected information for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>To provide and maintain our services and products</li>
              <li>To process transactions and send related information</li>
              <li>To send you technical notices, updates, and security alerts</li>
              <li>To provide customer support and respond to your requests</li>
              <li>To communicate with you about products, services, and events</li>
            </ul>

            <h2 className="text-2xl font-medium mb-4 text-foreground">3. Data Security</h2>
            <p className="mb-8">
              We implement a variety of security measures to maintain the safety of your personal information. 
              Your personal information is contained behind secured networks and is only accessible by a limited 
              number of persons who have special access rights to such systems and are required to keep the 
              information confidential.
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">4. Cookies and Tracking</h2>
            <p className="mb-8">
              We use cookies and similar tracking technologies to track the activity on our website and hold certain information. 
              Cookies are files with a small amount of data which may include an anonymous unique identifier. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">5. Third-Party Services</h2>
            <p className="mb-8">
              We may employ third-party companies and individuals to facilitate our website, provide services on our behalf, 
              or assist us in analyzing how our website is used. These third parties have access to your personal information 
              only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">6. Your Rights</h2>
            <p className="mb-8">
              You have the right to access, update, or delete the information we have on you. Whenever made possible, 
              you can access, update, or request deletion of your personal information directly within your account settings section. 
              If you are unable to perform these actions yourself, please contact us to assist you.
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">7. Contact Us</h2>
            <p className="mb-8">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="p-6 bg-muted rounded-xl border border-border">
              <p className="font-medium text-foreground">Bawa Ditta Mal Galleria</p>
              <p>Email: privacy@bawadittamal.com</p>
              <p>Phone: +91 (your-number-here)</p>
              <p>Address: Pathankot, Punjab, India</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
