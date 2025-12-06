import { Button } from "@/components/ui/button"

export const LanguageToggler = ({ language, updateLanguage }: { language: "en" | "bn"; updateLanguage: (lang: "en" | "bn") => void }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end gap-2">
        <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => updateLanguage("en")}>
          English
        </Button>
        <Button variant={language === "bn" ? "default" : "outline"} size="sm" onClick={() => updateLanguage("bn")}>
          বাংলা
        </Button>
      </div>
    )
}