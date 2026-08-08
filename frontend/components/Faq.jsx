"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "./Motion";

const faqs = [
  {
    question: "What is EPC Commercial Horticulture?",
    answer: "EPC (Engineering, Procurement, and Construction) commercial horticulture involves end-to-end management of large-scale landscaping and plantation projects, primarily for government and corporate sectors. We handle everything from soil testing and plant procurement to execution and long-term maintenance."
  },
  {
    question: "What is the difference between commercial landscaping and EPC horticulture?",
    answer: "While commercial landscaping typically focuses on aesthetics and design, EPC horticulture is a comprehensive, engineering-led approach. It includes site preparation, structural soil amendments, mass procurement, heavy equipment execution, and multi-year scientific maintenance linked to strict survival rate KPIs."
  },
  {
    question: "How does compensatory afforestation work for highway projects?",
    answer: "Compensatory afforestation mandates that trees removed during highway construction (e.g., NHAI projects) must be replanted in a specific ratio. We manage this end-to-end: sourcing native species, executing the plantation on designated forest or non-forest land, and maintaining them for 3-5 years with geotagged digital reporting."
  },
  {
    question: "What is included in a horticulture Annual Maintenance Contract (AMC)?",
    answer: "A comprehensive AMC includes regular watering, weeding, pruning, pest and disease management, fertilizer application (fertigation), casualty replacement, and debris clearance. For PSUs and townships, we deploy dedicated horticulturalists and site supervisors."
  },
  {
    question: "Which plants are best for industrial and PSU townships in India?",
    answer: "We select hardy, native, and pollution-tolerant species such as Neem, Peepal, Kaner, and Alstonia for peripheral green belts to absorb dust and noise. For residential zones within townships, we use ornamental, low-maintenance shade trees and flowering shrubs suited to the local agro-climatic zone."
  },
  {
    question: "Why choose an ISO-certified vendor for government landscaping tenders?",
    answer: "ISO 9001 (Quality) and ISO 14001 (Environmental) certifications ensure that the vendor follows standardized, globally recognized processes. For government agencies like CPWD, NBCC, and NHAI, these certifications mitigate risk, ensure compliance, and guarantee reliable execution and documentation."
  },
  {
    question: "Do you execute projects across India?",
    answer: "Yes, while we are headquartered in Varanasi, UP, we operate across multiple states in India, executing projects for major clients like NHAI, NTPC, Indian Oil, and BHEL."
  },
  {
    question: "How do you ensure the survival rate of plants in your projects?",
    answer: "We focus heavily on scientific site preparation, local sourcing of native species, and comprehensive multi-year Annual Maintenance Contracts (AMC). Our digitally tracked milestones and regular survival audits guarantee long-term sustainability."
  },
  {
    question: "Can I request a company profile or quote online?",
    answer: "Absolutely. You can request our detailed company profile and submit tender/quote requirements directly through the 'Request Profile' buttons available throughout our website."
  }
];

export default function Faq({ className = "py-20 bg-stone-50" }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className={`relative overflow-hidden ${className}`} id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <FadeIn className="text-center mb-12">
          <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-base font-bold uppercase tracking-[0.2em] mb-4">
            FAQ
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
            Frequently Asked Questions
          </h2>
        </FadeIn>

        <Stagger className="space-y-4">
          {faqs.map((faq, i) => (
            <StaggerItem key={i}>
              <div 
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-300 transition-colors shadow-sm"
                onClick={() => toggle(i)}
              >
                <div className="p-5 md:p-6 flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-emerald-950 text-lg">{faq.question}</h3>
                  <div className="text-emerald-700 shrink-0">
                    {openIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                {openIndex === i && (
                  <div className="px-5 md:px-6 pb-6 text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
