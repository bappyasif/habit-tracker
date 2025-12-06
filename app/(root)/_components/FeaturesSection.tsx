import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { content } from "../_data/content"

export const FeaturesSection = ({ language }: { language: "en" | "bn" }) => {
    const t = content[language]
    return (
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
    )
}