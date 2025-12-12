"use client"

import { useState } from "react"
import { FeaturesSection } from "./_components/FeaturesSection"
import { FooterSection } from "./_components/FooterSection"
import { HeroSection } from "./_components/HeroSection"
import { LanguageToggler } from "./_components/LanguageToggler"
import CounterContextDemoProvider from "../context-reducers/counterDemo"
import { CounterDemo } from "./_components/CounterDemo"

export default function Home() {
  // later on move this to context or global state using redux so that we can make this page ssr
  const [language, setLanguage] = useState<"en" | "bn">("en")

  const updateLanguage = (lang: "en" | "bn") => {
    setLanguage(lang)
  }


  return (
    <CounterContextDemoProvider>
      <main className="flex-1 min-h-screen">
        <CounterDemo />
        {/* Language Toggle */}
        <LanguageToggler language={language} updateLanguage={updateLanguage} />

        {/* Hero Section */}
        <HeroSection language={language} />

        {/* Features Section */}
        <FeaturesSection language={language} />

        {/* CTA Footer */}
        <FooterSection language={language} />
      </main>
    </CounterContextDemoProvider>
  )
}
