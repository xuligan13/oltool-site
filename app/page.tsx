import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ValuePropositions } from "@/components/value-propositions"
import { ProductShowcase } from "@/components/product-showcase"
import { WorkflowSection } from "@/components/workflow-section"
import { Footer } from "@/components/footer"
import { FloatingWidget } from "@/components/floating-widget"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ValuePropositions />
      <ProductShowcase />
      <WorkflowSection />
      <Footer />
      <FloatingWidget />
    </main>
  )
}
