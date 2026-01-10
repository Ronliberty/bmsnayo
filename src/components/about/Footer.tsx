// components/about/Footer.tsx
"use client";

import {
  FaFacebookF,
  FaTiktok,
  FaInstagram,
  FaYoutube,
  FaDiscord,
  FaTwitch,
  FaRedditAlien,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { SiThreads } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaRedditAlien />, href: "https://reddit.com/r/nayo", label: "Reddit" },
    { icon: <FaTwitter />, href: "https://x.com/nayo_official", label: "X (Twitter)" },
    { icon: <FaFacebookF />, href: "https://facebook.com/nayoapp", label: "Facebook" },
    { icon: <FaTiktok />, href: "https://tiktok.com/@nayoapp", label: "TikTok" },
    { icon: <FaInstagram />, href: "https://instagram.com/nayoapp", label: "Instagram" },
    { icon: <FaYoutube />, href: "https://youtube.com/@nayoapp", label: "YouTube" },
    { icon: <FaDiscord />, href: "https://discord.gg/nayo", label: "Discord" },
    { icon: <FaTwitch />, href: "https://twitch.tv/nayoapp", label: "Twitch" },
    { icon: <SiThreads />, href: "https://threads.net/@nayoapp", label: "Threads" },
    { icon: <FaTelegramPlane />, href: "https://t.me/nayoapp", label: "Telegram" },
    { icon: <FaWhatsapp />, href: "https://wa.me/254712345678", label: "WhatsApp" },
  ];

  return (
    <footer className="footer-solid bg-background border-t border-border py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Brand / Logo (optional - you can add if you want) */}
        <div className="mb-6">
          <span className="text-2xl font-bold text-primary">Nayo</span>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-4">
          Follow Us
        </h3>

        <div className="mt-4 flex flex-wrap justify-center gap-5 md:gap-6">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-muted-foreground hover:text-primary transition-colors duration-300 text-2xl md:text-3xl hover:scale-110 transform"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          © {currentYear} Nayo. All rights reserved.
        </p>

        <p className="mt-2 text-xs text-muted-foreground/80">
          Earn • Learn • Collaborate • Securely
        </p>
      </div>
    </footer>
  );
}