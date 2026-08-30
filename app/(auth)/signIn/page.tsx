"use client"

import { Button } from "@/components/ui/button";
import { useToUpdateUserSession } from "@/hooks/useToUpdateUserSession";
import { LogInIcon, Handshake } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
    const [isSigningIn, setIsSigningIn] = useState(false);

    useToUpdateUserSession()

    return (
        <main className="flex-1 min-h-screen flex flex-col justify-center items-center">
            <section className="flex justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-2xl font-bold">Login Page</h1>
            </section>
            {/* oauth login with google */}
            <section className="flex justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Login with Google</h2>
                    <Button onClick={() => {
                        signIn()
                        setIsSigningIn(true)
                    }} className="px-4 py-2 bg-secondary/30 text-primary rounded hover:bg-secondary/50"><LogInIcon className="w-4 h-4 mr-2" /> Sign In <Handshake className="w-4 h-4 ml-2" /></Button>
                    
                    {isSigningIn && <p className="text-sm text-muted-foreground">Signing in, please wait...</p>}
                </div>
            </section>
        </main>
    )
}