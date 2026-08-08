import PageHero from "@/components/PageHero";
import Faq from "@/components/Faq";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Get answers to commonly asked questions about EPC commercial horticulture, compensatory afforestation, landscaping tenders, and our multi-year AMCs.",
  keywords: [
    "EPC Horticulture FAQ",
    "Commercial Landscaping Questions",
    "Compensatory Afforestation India",
    "PSU Tenders Landscaping",
    "Horticulture AMC",
  ]
};

export default function FaqPage() {
  return (
    <div data-testid="faq-page">
      <PageHero 
        title="Frequently Asked Questions" 
        subtitle="Answers to common queries about EPC horticulture" 
      />
      <Faq className="py-16 bg-white" />
    </div>
  );
}
