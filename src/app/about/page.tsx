"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground">
          We are building a platform that connects buyers, sellers, and clients in a
          seamless peer-to-peer ecosystem. Our goal is to make transactions safer,
          faster, and more transparent.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-8 py-12">
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="text-muted-foreground">
              To empower individuals and businesses by offering a secure marketplace
              powered by our escrow system, ensuring trust and fairness in every deal.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
            <p className="text-muted-foreground">
              To become the go-to global platform where buyers and sellers can connect
              effortlessly, unlocking opportunities and creating long-lasting value.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Team / Values Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow rounded-2xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Trust</h3>
              <p className="text-muted-foreground">
                Built on transparency and reliability, our platform ensures every
                transaction is safe and secure.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow rounded-2xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We leverage modern technology to simplify trade and empower users
                across the globe.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow rounded-2xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Our marketplace thrives because of our users, and we are committed to
                supporting them every step of the way.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
