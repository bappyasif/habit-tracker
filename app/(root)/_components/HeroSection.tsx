import { ArrowRight, Sparkles } from "lucide-react"
import { content } from "../_data/content"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SampleCards } from "./SampleCards"

export const HeroSection = ({ language }: { language: "en" | "bn" }) => {
    const t = content[language]
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-secondary/30 dark:bg-secondary/50 rounded-full border border-primary/30 dark:border-secondary/70">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary/90 dark:text-primary">AI-Powered Habit Tracking</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance leading-tight">{t.tagline}</h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">{t.subtitle}</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/create-habit">
              <Button size="lg" className="gap-2">
                {t.startVoice}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/create-habit">
              <Button size="lg" variant="outline" className="bg-transparent">
                {t.typeHabit}
              </Button>
            </Link>
          </div>

          {/* Quick Sample Cards */}
          <SampleCards language={language} />
        </div>
      </section>
    )
}