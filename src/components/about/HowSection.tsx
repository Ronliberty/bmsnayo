// components/about/HowItWorksSection.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';

export default function HowItWorksSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section
      id="hows"
      className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - always visible */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            How Nayo Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Watch this quick video to see how simple and secure it is
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {showVideo ? (
              <motion.div
                key="video"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video border border-border"
              >
                {/* Close button */}
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute top-4 right-4 z-30 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition backdrop-blur-sm shadow-md hover:scale-105"
                  aria-label="Close video"
                >
                  <X className="h-6 w-6" />
                </button>

                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&controls=1&rel=0"
                  title="How Nayo Works"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
              </motion.div>
            ) : (
              <motion.div
                key="teaser"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="aspect-video bg-gradient-to-br from-muted/60 to-muted/40 rounded-2xl flex items-center justify-center border border-border cursor-pointer group"
                onClick={() => setShowVideo(true)}
              >
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                    <Play className="h-12 w-12 text-primary ml-1" />
                  </div>
                  <h4 className="text-2xl font-semibold text-foreground mb-2">
                    Watch How It Works
                  </h4>
                  <p className="text-muted-foreground">
                    Click to play the explainer video (1:45)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Steps - always visible */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {/* your 3 steps cards here */}
        </div>
      </div>
    </section>
  );
}