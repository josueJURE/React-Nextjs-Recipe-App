

"use client";

import { useRouter } from "next/navigation";

import LoginForm from "@/components/login-form"


export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
         <LoginForm/>

    </main>
 
  )
}


