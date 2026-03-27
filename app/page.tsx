"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import EventList from "@/components/EventList";
import AuthBlock from "@/components/AuthBlock";
import { apiGet } from "@/lib/api";
import EventsClient from "@/app/events/EventsClient";

import HeroSection from "@/components/HeroSection";
import InspirationCardsSection from "@/components/InspirationCardsSection";
import TrustedSection from "@/components/TrustedSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import FeatureCardsSection from "@/components/FeatureCardsSection";
import TestimonialSection from "@/components/TestimonialSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import TrustedTeamsSection from "@/components/TrustedTeamsSection";

type EventItem = {
  id: number;
  title?: string;
};

const cityItems = [
  {
    id: 1,
    title: "Apeldoorn",
    description: "Leuke restaurants, events en plekken voor een gezellige dag of avond.",
    image: "/images/cities/apeldoorn.jpg",
    href: "/ontdek?city=apeldoorn",
    cta: "Bekijk Apeldoorn",
  },
  {
    id: 2,
    title: "Deventer",
    description: "Ontdek kroegen, terrassen, markten en culturele hotspots.",
    image: "/images/cities/deventer.jpg",
    href: "/ontdek?city=deventer",
    cta: "Bekijk Deventer",
  },
  {
    id: 3,
    title: "Arnhem",
    description: "Van shoppen tot uitgaan en leuke activiteiten voor het weekend.",
    image: "/images/cities/arnhem.jpg",
    href: "/ontdek?city=arnhem",
    cta: "Bekijk Arnhem",
  },
];

export default function Home() {
  const city = "apeldoorn";
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const spotlightTags = ["Live muziek", "Food spots", "Weekendtips"];
  const curatedMoments = [
    "Kies sneller tussen cultureel, spontaan en gezinsvriendelijk.",
    "Gebruik de preview om direct door te klikken naar actuele plannen.",
    "Houd de homepage redactioneel, niet alleen functioneel.",
  ];

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`/api/events/?city=${city}`)
      .then((data) => setEvents(Array.isArray(data) ? data : data.results || []))
      .finally(() => setLoading(false));
  }, [city]);

  const previewLabel = loading
    ? "Preview wordt geladen"
    : events.length === 0
      ? "Nog geen events in de preview"
      : `${events.length} events klaar om te bekijken`;

  return (
    <>
  
      <HeroSection />
       <TrustedTeamsSection />
      <InspirationCardsSection />
      <TrustedSection />
      <ShowcaseSection />
      <FeatureCardsSection />
      <TestimonialSection />

      

      <FinalCtaSection />
    </>
  );
}