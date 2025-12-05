"use client"

import { useState } from "react"
import Link from "next/link"
import { HabitCard } from "@/components/habit-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sparkles, Brain } from "lucide-react"

const sampleHabits = [
  { title: "Fitness", icon: "💪", description: "Build strength and endurance" },
  { title: "Drink Water", icon: "💧", description: "Stay hydrated daily" },
  { title: "Sleep 7 hr", icon: "😴", description: "Get quality rest" },
]

export default function Home() {
  const [language, setLanguage] = useState<"en" | "bn">("en")

  const content = {
    en: {
      tagline: "Track one habit. Get AI coaching in Bangla & English.",
      subtitle: "Build better habits with personalized AI guidance and daily tracking.",
      startVoice: "Start with voice",
      typeHabit: "Type a habit",
      quickStart: "Quick Start",
      signin: "Sign In",
      signup: "Get Started Free",
      features: [
        {
          title: "🤖 AI Coaching",
          description: "Get personalized guidance in Bangla and English. AI learns your patterns.",
        },
        {
          title: "📊 Track Progress",
          description: "Beautiful dashboards show daily completion, streaks, and weekly insights.",
        },
        {
          title: "🎯 Smart Insights",
          description: "Weekly summaries and actionable suggestions to help you improve.",
        },
      ],
    },
    bn: {
      tagline: "একটি অভ্যাস ট্র্যাক করুন। বাংলা এবং ইংরেজিতে AI কোচিং পান।",
      subtitle: "ব্যক্তিগত AI গাইডেন্স এবং দৈনিক ট্র্যাকিং এর সাথে ভাল অভ্যাস তৈরি করুন।",
      startVoice: "ভয়েস দিয়ে শুরু করুন",
      typeHabit: "অভ্যাস টাইপ করুন",
      quickStart: "দ্রুত শুরু",
      signin: "সাইন ইন করুন",
      signup: "বিনামূল্যে শুরু করুন",
      features: [
        {
          title: "🤖 AI কোচিং",
          description: "বাংলা এবং ইংরেজিতে ব্যক্তিগত গাইডেন্স পান। AI আপনার প্যাটার্ন শিখে।",
        },
        {
          title: "📊 অগ্রগতি ট্র্যাক করুন",
          description: "সুন্দর ড্যাশবোর্ড প্রতিদিনের সম্পূর্ণতা এবং সাপ্তাহিক অন্তর্দৃষ্টি দেখায়।",
        },
        {
          title: "🎯 স্মার্ট অন্তর্দৃষ্টি",
          description: "সাপ্তাহিক সারাংশ এবং কার্যকর পরামর্শ যা আপনাকে উন্নতিতে সাহায্য করে।",
        },
      ],
    },
  }

  const t = content[language]

  return (
    <main className="flex-1 min-h-screen">
      {/* Language Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end gap-2">
        <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => setLanguage("en")}>
          English
        </Button>
        <Button variant={language === "bn" ? "default" : "outline"} size="sm" onClick={() => setLanguage("bn")}>
          বাংলা
        </Button>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">AI-Powered Habit Tracking</span>
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
          <div className="mt-16">
            <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">{t.quickStart}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleHabits.map((habit) => (
                <Link key={habit.title} href="/create-habit">
                  <HabitCard {...habit} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.features.map((feature, idx) => (
            <Card key={idx} className="border border-border/50 hover:border-primary/50 transition">
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Card className="bg-linear-to-br from-blue-600 to-cyan-500 text-white border-0">
          <CardContent className="p-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-6 h-6" />
              <h2 className="text-3xl font-bold">Ready to build better habits?</h2>
            </div>
            <p className="text-lg mb-8 text-blue-50">
              Start tracking today and watch yourself transform with AI guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-habit">
                <Button size="lg" variant="secondary">
                  {t.signup}
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-200 text-white hover:bg-blue-700 bg-transparent"
              >
                {t.signin}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
