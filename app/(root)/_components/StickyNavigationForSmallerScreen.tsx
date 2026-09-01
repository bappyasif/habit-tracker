import { Button } from "@/components/ui/button"
import Link from "next/link"

export const StickyNavigationForSmallerScreen = () => {
    return (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 flex  justify-center gap-10 md:justify-around bg-card/80 border-t border-border pb-[env(safe-area-inset-bottom)]">
            <Link href="/dashboard" className="md:w-80">
                <Button variant="outline" size="lg" className="w-full">
                    Dashboard!
                </Button>
            </Link>
            <Link href="/create-habit" className="md:w-80">
                <Button size="lg" className="w-full">Get Started</Button>
            </Link>
        </div >
    )
}