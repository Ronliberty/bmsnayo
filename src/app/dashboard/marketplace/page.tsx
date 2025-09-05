"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ------------------ Mock Data -------------------
const people = [
  {
    id: 1,
    name: "John Doe",
    skills: ["Web Design", "SEO"],
    services: [
      { name: "Portfolio Website", price: "$199" },
      { name: "Logo Design", price: "$50" },
    ],
  },
  {
    id: 2,
    name: "Sarah Lee",
    skills: ["Marketing", "Social Media"],
    services: [{ name: "Instagram Growth Plan", price: "$75" }],
  },
];

const webApps = [
  {
    id: 1,
    name: "AI Resume Builder",
    seller: "Jane Doe",
    price: "$49 / one-time",
    desc: "Generate professional resumes with AI.",
  },
  {
    id: 2,
    name: "Social Media Scheduler",
    seller: "Sarah Lee",
    price: "$15 / month",
    desc: "Plan and automate your social posts.",
  },
];

const mobileApps = [
  {
    id: 1,
    name: "Budget Tracker App",
    seller: "Alex Kim",
    price: "Free / In-app purchases",
    desc: "Track daily expenses and savings goals.",
  },
  {
    id: 2,
    name: "Workout Planner App",
    seller: "FitLabs",
    price: "$4.99",
    desc: "Personalized fitness routines on mobile.",
  },
];

const companies = [
  {
    id: 1,
    name: "BrightAgency",
    verified: true,
    services: [
      { name: "SEO Bundle", price: "$499" },
      { name: "PPC Ads", price: "$799" },
    ],
    rating: 4.8,
  },
];

// ------------------ Page Component -------------------
export default function MarketplacePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
      <Link className="text-sm text-blue-500 mb-4 inline-block" href="/dashboard/p2p">P2P</Link>
      <p className="text-muted-foreground mb-6">Hire freelancers or buy apps and services securely.</p>

      <Tabs defaultValue="people">
        <TabsList className="mb-6">
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="webapps">Web Apps</TabsTrigger>
          <TabsTrigger value="mobileapps">Mobile Apps</TabsTrigger>
          <TabsTrigger value="companies">Trusted Companies</TabsTrigger>
        </TabsList>

        {/* People Tab */}
        <TabsContent value="people" className="grid md:grid-cols-2 gap-4">
          {people.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
                <CardDescription>Skills: {p.skills.join(", ")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {p.services.map((s, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{s.name}</span>
                      <span className="font-semibold">{s.price}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View Profile</Button>
                <Button>Hire</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* Web Apps Tab */}
        <TabsContent value="webapps" className="grid md:grid-cols-2 gap-4">
          {webApps.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <CardTitle>{app.name}</CardTitle>
                <CardDescription>By {app.seller}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{app.desc}</p>
                <p className="mt-2 font-semibold">{app.price}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Wishlist</Button>
                <Button>Buy Now</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* Mobile Apps Tab */}
        <TabsContent value="mobileapps" className="grid md:grid-cols-2 gap-4">
          {mobileApps.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <CardTitle>{app.name}</CardTitle>
                <CardDescription>By {app.seller}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{app.desc}</p>
                <p className="mt-2 font-semibold">{app.price}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Wishlist</Button>
                <Button>Download</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* Trusted Companies Tab */}
        <TabsContent value="companies" className="grid md:grid-cols-2 gap-4">
          {companies.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle>
                  {c.name} {c.verified && <span className="ml-2 text-green-500">✅</span>}
                </CardTitle>
                <CardDescription>Rating: ⭐ {c.rating}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {c.services.map((s, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{s.name}</span>
                      <span className="font-semibold">{s.price}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View Company</Button>
                <Button>Contact</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
