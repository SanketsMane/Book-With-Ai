import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./_components/Hero";
import { PopularCityList } from "./_components/PopularCityList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <PopularCityList />
    </div>
  );
}
