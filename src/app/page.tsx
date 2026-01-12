import { Header, Footer } from "@/components/layout";
import {
  Hero,
  HowItWorks,
  QualitySection,
  FAQAccordion,
  CTASection,
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <QualitySection />
        <FAQAccordion />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
