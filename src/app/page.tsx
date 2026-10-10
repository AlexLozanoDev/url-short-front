'use client'

import Header from "@/components/layout/Header";
import { HeroSection } from "@/features/links/components/hero-component";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e9e9e9] text-black flex flex-col p-6 relative dark:bg-[#161616] dark:text-white">
      <Header/>
      <HeroSection />
    </main>
  );
}
