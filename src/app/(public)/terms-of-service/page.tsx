import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Western Interio",
  description: "Read the terms and conditions for using the services provided by Western Interio.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-secondary">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,transparent_70%)]" />
        <div className="container relative px-4 mx-auto text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Please read these terms carefully before using our services or website.
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

            <h2 className="text-2xl font-medium mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="mb-8">
              By accessing and using the Western Interio website and services, you agree to be bound by these Terms of Service. 
              If you do not agree to all of these terms, please do not use our website or services. 
              We reserve the right to update these terms at any time without prior notice.
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">2. Use of Services</h2>
            <p className="mb-6">
              You agree to use our website and services only for lawful purposes and in a way that does not infringe 
              the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the services. 
              Prohibited behavior includes:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Harassing or causing distress to any person</li>
              <li>Transmitting obscene or offensive content</li>
              <li>Disrupting the normal flow of dialogue within our services</li>
              <li>Attempting to gain unauthorized access to our systems</li>
            </ul>

            <h2 className="text-2xl font-medium mb-4 text-foreground">3. Intellectual Property</h2>
            <p className="mb-8">
              All content on this website, including text, graphics, logos, images, and software, is the property of 
              Western Interio or its content suppliers and is protected by international copyright laws. 
              The compilation of all content on this site is the exclusive property of Western Interio.
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">4. Product Information and Pricing</h2>
            <p className="mb-8">
              While we strive to provide accurate product information and pricing, errors may occur. 
              In the event that an item is listed at an incorrect price or with incorrect information, 
              we reserve the right to refuse or cancel any orders placed for that item. 
              Prices and availability are subject to change without notice.
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">5. Limitation of Liability</h2>
            <p className="mb-8">
              Western Interio shall not be liable for any direct, indirect, incidental, special, or 
              consequential damages resulting from the use or inability to use our services or for the cost 
              of procurement of substitute goods and services.
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">6. Governing Law</h2>
            <p className="mb-8">
              These terms shall be governed by and construed in accordance with the laws of India, 
              without regard to its conflict of law provisions. 
              Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Gurugram, Haryana.
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">7. Termination</h2>
            <p className="mb-8">
              We reserve the right to terminate or suspend access to our services immediately, without prior notice 
              or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-medium mb-4 text-foreground">8. Contact Us</h2>
            <p className="mb-8">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="p-6 bg-muted rounded-xl border border-border">
              <p className="font-semibold text-foreground">Western Interio</p>
              <p>Email: info@westerninterio.in</p>
              <p>Phone: +91-9540641111, +91-9540017776</p>
              <p>Address: Plot No. 06, Gali No.-06, Kadipur Industrial Area, Gurugram, Haryana – 122505</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
