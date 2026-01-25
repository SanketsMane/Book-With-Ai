"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function PopularCityList() {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ));

    return (
        <div className="w-full h-full py-20 bg-gradient-to-b from-background to-muted/10">
            <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-3xl font-bold text-foreground font-sans mb-8">
                Popular Destination to Visit
            </h2>
            <Carousel items={cards} />
        </div>
    );
}



const data = [
    {
        category: "Paris, France",
        title: "Explore the City of Lights – Eiffel Tower, Louvre & more",
        src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop",
        content: (
            <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">
                        Paris is a dream destination.
                    </span>{" "}
                    From the iconic Eiffel Tower to the artistic treasures of the Louvre, every corner tells a story. Enjoy a Seine river cruise at sunset, savor authentic croissants in Montmartre, and experience the romance of the city.
                </p>
                <img
                    src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop"
                    alt="Paris"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-cover rounded-xl mt-8"
                />
            </div>
        ),
    },
    {
        category: "New York, USA",
        title: "Experience NYC – Times Square, Central Park, Broadway",
        src: "https://plus.unsplash.com/premium_photo-1661954654458-c673671d4a08?q=80&w=1170&auto=format&fit=crop",
        content: (
            <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">
                        The city that never sleeps.
                    </span>{" "}
                    Walk through the neon lights of Times Square, relax in the vast greenery of Central Park, and catch a world-class show on Broadway. NYC offers an energy like no other place on Earth.
                </p>
                <img
                    src="https://plus.unsplash.com/premium_photo-1661954654458-c673671d4a08?q=80&w=1170&auto=format&fit=crop"
                    alt="New York"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-cover rounded-xl mt-8"
                />
            </div>
        ),
    },
    {
        category: "Tokyo, Japan",
        title: "Discover Tokyo – Shibuya, Cherry Blossoms, Temples",
        src: "https://images.unsplash.com/photo-1522547902298-51566e4fb383?q=80&w=735&auto=format&fit=crop",
        content: (
            <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">
                        A perfect blend of tradition and future.
                    </span>{" "}
                    Witness the scramble crossing at Shibuya, find peace in the historic Senso-ji Temple, and enjoy the breathtaking cherry blossoms in Ueno Park. Tokyo is a sensory masterpiece.
                </p>
                <img
                    src="https://images.unsplash.com/photo-1522547902298-51566e4fb383?q=80&w=735&auto=format&fit=crop"
                    alt="Tokyo"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-cover rounded-xl mt-8"
                />
            </div>
        ),
    },
    {
        category: "Rome, Italy",
        title: "Walk through History – Colosseum, Vatican, Roman Forum",
        src: "https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1170&auto=format&fit=crop",
        content: (
            <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">
                        The Eternal City.
                    </span>{" "}
                    Step back in time at the Colosseum, marvel at the art of the Vatican Museums, and toss a coin into the Trevi Fountain. Roman history and cuisine await you.
                </p>
                <img
                    src="https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1170&auto=format&fit=crop"
                    alt="Rome"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-cover rounded-xl mt-8"
                />
            </div>
        ),
    },
    {
        category: "Dubai, UAE",
        title: "Luxury and Innovation – Burj Khalifa, Desert Safari",
        src: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=687&auto=format&fit=crop",
        content: (
            <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">
                        The city of gold.
                    </span>{" "}
                    Visit the world's tallest building, the Burj Khalifa, shop at massive malls, and take a thrilling 4x4 safari into the desert dunes. Dubai redefines luxury.
                </p>
                <img
                    src="https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=687&auto=format&fit=crop"
                    alt="Dubai"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-cover rounded-xl mt-8"
                />
            </div>
        ),
    },
    {
        category: "Sydney, Australia",
        title: "Harbour Views – Opera House, Bondi Beach & Wildlife",
        src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1171&auto=format&fit=crop",
        content: (
            <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">
                        Sun, surf, and icons.
                    </span>{" "}
                    Snap a photo with the Opera House, surf the waves at Bondi Beach, and meet koalas at the zoo. Sydney combines urban life with stunning nature.
                </p>
                <img
                    src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1171&auto=format&fit=crop"
                    alt="Sydney"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-cover rounded-xl mt-8"
                />
            </div>
        ),
    },
];


