// src/components/about/PartnersSection.tsx
"use client";

import { motion } from "framer-motion";

const partners = [
  {
    name: "Elante",
    logo: "/images/partners/elante.png",
    website: "https://elante.com",
  },
  {
    name: "BitsMind Systems",
    logo: "/images/partners/bitsmindsystems.png",
    website: "https://bitsmindsystems.com",
  },
];

export default function PartnersSection() {
  return (
    <section id="partners" className="relative py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Trusted by Our Partners
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          We collaborate with industry leaders to bring you the best services and solutions.
        </p>

        <motion.div
          className="mt-10 flex flex-wrap justify-center items-center gap-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {partners.map((partner, i) => (
            <motion.a
              key={i}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="flex items-center justify-center p-4 rounded-lg hover:scale-105 transition-transform"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 object-contain"
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
