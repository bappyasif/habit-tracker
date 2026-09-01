"use client"

import { useState } from "react"
import { FeaturesSection } from "./_components/FeaturesSection"
import { FooterSection } from "./_components/FooterSection"
import { HeroSection } from "./_components/HeroSection"
import { LanguageToggler } from "./_components/LanguageToggler"
import { UserAuthToggleView } from "@/components/UserAuthToggleView"
import { StickyNavigationForSmallerScreen } from "./_components/StickyNavigationForSmallerScreen"

export default function Home() {
  // later on move this to context or global state using redux so that we can make this page ssr
  const [language, setLanguage] = useState<"en" | "bn">("en")

  const updateLanguage = (lang: "en" | "bn") => {
    setLanguage(lang)
  }


  return (
    <main className="flex-1 min-h-screen">
      <section className="flex justify-center w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <UserAuthToggleView />
        <LanguageToggler language={language} updateLanguage={updateLanguage} />
      </section>

      {/* Hero Section */}
      <HeroSection language={language} />

      {/* Features Section */}
      <FeaturesSection language={language} />

      {/* CTA Footer */}
      <FooterSection language={language} />

      {/* sticky navigation */}
      <StickyNavigationForSmallerScreen />
    </main>
  )
}
