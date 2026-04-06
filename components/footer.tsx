'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

// TikTok doesn't have a lucide icon — use a simple SVG inline
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.85a8.18 8.18 0 004.78 1.52V6.9a4.85 4.85 0 01-1.01-.21z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/pempekfarina.id',
    icon: Instagram,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/pempekfarina.id',
    icon: Facebook,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@pempekfarina.id',
    icon: Youtube,
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@pempekfarina.id',
    icon: TikTokIcon,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-t border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand & Tagline */}
          <div className="flex flex-col gap-3">
            <Image
              src="/farina-logo.png"
              alt="Pempek Farina Logo"
              width={80}
              height={80}
              className="h-16 w-auto object-contain"
            />
            <div>
              <h3 className="font-bold text-foreground text-sm">PT. Primaboga Nusantara Inti</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Primaboga Trade Analysis Dashboard</p>
              <p className="text-xs text-muted-foreground italic mt-2">
                "Pempek Farina Jajanan Favorit Bunda Indonesia"
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Kontak</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/6281134977180"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  +62 811-3497-718
                </a>
              </li>
              <li>
                <a
                  href="mailto:pempekfarina.id@gmail.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  pempekfarina.id@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Address + Embedded Map */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Alamat</h4>
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Jl. Jabon, Tambaksawah, Waru,<br />
                Sidoarjo Regency,<br />
                East Java 61256
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm">
              <iframe
                title="Lokasi PT. Primaboga Nusantara Inti"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.2977!2d112.7197!3d-7.3805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fb48d2c4b0ab%3A0x5c0fc3a6b51a0e70!2sWaru%2C%20Sidoarjo%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1680000000000!5m2!1sen!2sid"
                width="100%"
                height="120"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Social Media</h4>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    @pempekfarina.id
                    <span className="text-xs text-muted-foreground/60">({label})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              © {currentYear} PT. Primaboga Nusantara Inti. All rights reserved.
            </p>
            <p className="text-center sm:text-right">
              IT Department · Integration Development Project
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
