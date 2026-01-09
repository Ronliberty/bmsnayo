// src/components/Footer.tsx
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
  const socialLinks = [
    { icon: <FaRedditAlien />, href: "https://reddit.com" },
    { icon: <FaTwitter />, href: "https://x.com" }, // X
    { icon: <FaFacebookF />, href: "https://facebook.com" },
    { icon: <FaTiktok />, href: "https://tiktok.com" },
    { icon: <FaInstagram />, href: "https://instagram.com" },
    { icon: <FaYoutube />, href: "https://youtube.com" },
    { icon: <FaDiscord />, href: "https://discord.com" },
    { icon: <FaTwitch />, href: "https://twitch.tv" },
    { icon: <SiThreads />, href: "https://threads.net" },
    { icon: <FaTelegramPlane />, href: "https://t.me/yourchannel" },
    { icon: <FaWhatsapp />, href: "https://wa.me/yourphonenumber" },
  ];

  return (
    <footer className="bg-background border-t border-border py-10">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h3 className="text-lg font-semibold text-foreground">Follow Us</h3>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {socialLinks.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition text-xl"
            >
              {s.icon}
            </a>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Nayo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
