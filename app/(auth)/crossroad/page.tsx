"use client"

import Link from "next/link";

export default function CrossroadPage() {
    return (
        <main className="flex-1 min-h-screen flex flex-col justify-center items-center gap-4 bg-secondary">
            <section className="flex justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-4xl font-bold text-primary">Crossroad Page</h1>
            </section>
            <section className="text-xl">
                <h2 className="text-2xl">You are not logged in</h2>
                <div className="flex flex-col justify-center items-center gap-4 mt-4">
                    <h3>You can either choose to go back home page or goto sign in page</h3>
                <div className="flex gap-4">
                    <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go to Home</Link>
                    <Link href="/signIn" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Go to Sign In</Link>
                </div>
                </div>
            </section>
        </main>
    )
}