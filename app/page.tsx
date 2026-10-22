import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SpotlightProvider } from "@/components/spotlight"
import { BestsellersSection } from "@/components/sections/bestsellers-section"
import { HeroSection } from "@/components/sections/hero-section"
import { MoreSection } from "@/components/sections/more-section"
import { MissionSection } from "@/components/sections/mission-section"
import { TextilesSection } from "@/components/sections/textiles-section"

export default function Page() {
  return (
    <SpotlightProvider>
      <SiteHeader />
      {/* Room for the fixed header: top offset + 80px bar + 80px gap. */}
      <main className="flex flex-col items-center gap-20 pt-44 pb-20 md:pt-46">
        <HeroSection />
        <MissionSection />
        <BestsellersSection />
        <TextilesSection />
        <MoreSection />
      </main>
      <SiteFooter />
    </SpotlightProvider>
  )
}
