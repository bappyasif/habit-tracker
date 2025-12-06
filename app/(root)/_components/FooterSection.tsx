import { Card, CardContent } from "@/components/ui/card"
import { content } from "../_data/content"
import { Brain } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const FooterSection = ({ language }: { language: "en" | "bn" }) => {
    const t = content[language]
    return (
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
    )
}