"use client"

import { Button } from "@/components/ui/button";
import { useToCheckUserAuthAndRedirect } from "@/hooks/useToCheckUserAuthAndRedirect";
import { useToUpdateUserSession } from "@/hooks/useToUpdateUserSession";
import { se } from "date-fns/locale";
import { LogInIcon, Handshake } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [isSigningIn, setIsSigningIn] = useState(false);

    useToUpdateUserSession()
    // useToCheckUserAuthAndRedirect()
    const router = useRouter()

    // const handleSignIn = async () => {
    //     try {
    //         await signIn("google", { callbackUrl: "/dashboard" });
    //         // After successful sign-in, redirect to the dashboard
    //         // router.push("/dashboard");
    //     } catch (error) {
    //         console.error("Error signing in:", error);
    //     }
    // }

    const handleSignIn = async () => {
        try {
            // 0. Set signing in state to true to prevent multiple clicks
            // setIsSigningIn(true);

            // 1. Tell NextAuth not to redirect automatically
            const result = await signIn("google", {
                // redirect: false,
                callbackUrl: "/dashboard"
            });

            // 2. NextAuth returns an object instead of throwing an error
            if (result?.error) {
                console.error("Sign in failed:", result.error);
                // Put your custom error state handling here (e.g., setStatusMessage(result.error))
                // setIsSigningIn(false); // Reset signing in state on error
                return;
            }

            // 3. Manually redirect on success
            if (result?.ok) {
                // Put your custom success state handling here (e.g., setStatusMessage("Sign in successful! Redirecting..."))
                // setIsSigningIn(false);
                // After successful sign-in, redirect to the dashboard
                router.push("/dashboard");
            }
        } catch (error) {
            // This only catches network/runtime crashes, not auth failures
            console.error("Critical network error:", error);
        }
    };

    return (
        <main className="flex-1 min-h-screen">
            <section className="flex justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-2xl font-bold">Login Page</h1>
            </section>
            {/* oauth login with google */}
            <section className="flex justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Login with Google</h2>
                    <Button onClick={() => signIn()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"><LogInIcon className="w-4 h-4 mr-2" /> Sign In <Handshake className="w-4 h-4 ml-2" /></Button>
                    {/* <Button onClick={() => {
                        setIsSigningIn(true)
                        signIn().then(() => {
                            setIsSigningIn(false)
                        }).catch((error) => {
                            console.error("Error signing in:", error)
                            setIsSigningIn(false)
                        })
                    }} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"><LogInIcon className="w-4 h-4 mr-2" /> Sign In <Handshake className="w-4 h-4 ml-2" /></Button> */}
                    {/* <Button
                        onClick={async () => {
                            setIsSigningIn(true);
                            try {
                                // 1. Target your provider and prevent default hard redirect
                                const result = await signIn("google", { redirect: false });

                                if (result?.ok) {
                                    // 2. If successful, redirect manually
                                    setIsSigningIn(false);
                                    router.push("/dashboard");
                                } else {
                                    console.error("Auth failed:", result?.error);
                                    setIsSigningIn(false);
                                }
                            } catch (error) {
                                console.error("Error signing in:", error);
                                setIsSigningIn(false);
                            }
                        }}
                        disabled={isSigningIn}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    ><LogInIcon className="w-4 h-4 mr-2" /> Sign In <Handshake className="w-4 h-4 ml-2" /></Button> */}
                    
                    {/* <Button disabled={isSigningIn} onClick={() => handleSignIn()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"><LogInIcon className="w-4 h-4 mr-2" /> Sign In <Handshake className="w-4 h-4 ml-2" /></Button> */}
                    
                    {isSigningIn && <p className="text-sm text-gray-500">Signing in, please wait...</p>}
                    {/* <Button onClick={() => signIn()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login with Google</Button> */}
                </div>
            </section>
        </main>
    )
}