'use client';

import { useState } from "react";
import { FOOTER_BOTTOM, FOOTER_LEGAL, FOOTER_SOCIAL, FOOTER_TOP } from "../data";
import { FooterColumn } from "../ui";

export function SiteFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "done" | "error">("idle");

  return (
    <footer className="site-footer w-full">
      <div aria-hidden className="site-footer-art">
        <img
          alt=""
          decoding="async"
          height={853}
          loading="lazy"
          src="/lyzr-footer-art.webp"
          width={1280}
        />
        <div className="site-footer-art-fade" />
        <span className="site-footer-art-trace" />
      </div>
      <div className="site-footer-inner max-w-container-max mx-auto page-pad pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 pb-14">
          <div className="min-w-0">
            <a className="inline-block mb-7" href="https://www.lyzr.ai/">
              <img
                alt="Lyzr"
                className="h-9 w-auto brightness-0 invert"
                height={28}
                src="/lyzr-logo.png"
                width={73}
              />
            </a>
            <span className="site-footer-heading">Address</span>
            <p className="text-[14px] leading-relaxed text-white/70 mb-7">
              525 Washington Blvd, 2410, Jersey City,<br />
              NJ 07310, USA
            </p>
            <h6 className="text-[15px] font-semibold text-white mb-2">Join 24,647+ subscribers</h6>
            <p className="text-[13.5px] leading-relaxed text-white/65 mb-4">
              We share stories around AI agents every 2 weeks. No spam.
            </p>
            <form
              aria-label="Newsletter Form"
              className="flex flex-col gap-2.5"
              onSubmit={(event) => {
                event.preventDefault();
                if (!newsletterEmail.includes("@")) {
                  setNewsletterState("error");
                  return;
                }
                setNewsletterState("done");
              }}
            >
              <label className="sr-only" htmlFor="footer-email">Email</label>
              <input
                className="site-footer-input"
                id="footer-email"
                name="email"
                onChange={(event) => {
                  setNewsletterEmail(event.target.value);
                  if (newsletterState !== "idle") setNewsletterState("idle");
                }}
                placeholder="Enter your email"
                required
                type="email"
                value={newsletterEmail}
              />
              <button className="site-footer-subscribe" type="submit">
                {newsletterState === "done" ? "Subscribed" : "Subscribe"}
              </button>
              {newsletterState === "error" ? (
                <p className="text-[12px] text-accent-coral">Enter a valid work email.</p>
              ) : null}
            </form>
          </div>
          {FOOTER_TOP.map((column) => (
            <FooterColumn key={column.title} links={column.links} title={column.title} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 pb-14 border-t border-white/10 pt-14">
          {FOOTER_BOTTOM.map((column) => (
            <FooterColumn key={column.title} links={column.links} title={column.title} />
          ))}
        </div>

        <div className="flex flex-col md:grid md:grid-cols-3 items-center gap-5 border-t border-white/10 pt-6">
          <ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            {FOOTER_LEGAL.map((item) => (
              <li key={item.label}>
                <a className="text-[13px] text-white/65 hover:text-white" href={item.href} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-white/65 text-center">LYZR © 2026. All rights reserved.</p>
          <div className="flex items-center justify-center md:justify-end gap-2.5">
            {FOOTER_SOCIAL.map((item) => (
              <a
                aria-label={item.label}
                className="site-footer-social"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                <svg aria-hidden className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={item.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
