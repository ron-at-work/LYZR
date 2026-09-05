"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  FOOTER_BOTTOM,
  FOOTER_LEGAL,
  FOOTER_SOCIAL,
  FOOTER_TOP,
} from "../data";
import { useSound } from "../motion/SoundProvider";
import { FooterWordmark } from "./FooterWordmark";

const QUICK_LINKS = [
  { label: "About", href: "https://www.lyzr.ai/about-us/" },
  { label: "Pricing", href: "https://www.lyzr.ai/pricing/" },
  { label: "Agent Studio", href: "https://studio.lyzr.ai/" },
  { label: "Careers", href: "https://careers.lyzr.ai/" },
  { label: "Blog", href: "https://www.lyzr.ai/blog/" },
  { label: "Contact", href: "https://www.lyzr.ai/contact/" },
] as const;

export function CinematicCta() {
  const reduce = useReducedMotion();
  const { muted } = useSound();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "done" | "error">("idle");
  const year = new Date().getFullYear();

  return (
    <section className="cine-close" id="contact">
      <div className="cine-close-top">
        <div>
          <p className="cine-close-kicker">Let&apos;s build work that inspires.</p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 24 }}
            transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
            viewport={{ once: true, amount: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Ready to build something bold?
          </motion.h2>
          <p className="cine-close-copy">© Lyzr {year}. All rights reserved.</p>
          <p className="cine-close-hint">
            {muted ? "Enable sound ↑ then hover the lines." : "Sound on — hover the lines."}
          </p>
        </div>

        <div className="cine-close-actions">
          <a className="cine-link" href="https://www.lyzr.ai/book-demo/">
            Discuss your project <span aria-hidden>→</span>
          </a>
          <a className="cine-link" href="https://www.lyzr.ai/book-demo/">
            Book a 30-minute call <span aria-hidden>→</span>
          </a>

          <div className="cine-close-cols">
            <div>
              <p className="cine-label">Business enquiry</p>
              <a href="mailto:hello@lyzr.ai">hello@lyzr.ai</a>
              <a href="https://www.lyzr.ai/contact/">Contact form</a>
            </div>
            <div>
              <p className="cine-label">Visit</p>
              <p className="cine-close-address">
                525 Washington Blvd, 2410
                <br />
                Jersey City, NJ 07310, USA
              </p>
            </div>
            <div>
              <p className="cine-label">Social</p>
              {FOOTER_SOCIAL.map((item) => (
                <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              ))}
            </div>
            <div>
              <p className="cine-label">Explore</p>
              {QUICK_LINKS.map((link) => (
                <a href={link.href} key={link.label} rel="noreferrer" target="_blank">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="cine-close-details">
        <div className="cine-close-newsletter">
          <p className="cine-label">Join 24,647+ subscribers</p>
          <p className="cine-close-newsletter-copy">
            Stories around AI agents every 2 weeks. No spam.
          </p>
          <form
            aria-label="Newsletter"
            className="cine-close-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!newsletterEmail.includes("@")) {
                setNewsletterState("error");
                return;
              }
              setNewsletterState("done");
            }}
          >
            <label className="sr-only" htmlFor="cine-footer-email">
              Email
            </label>
            <input
              className="cine-close-input"
              id="cine-footer-email"
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
            <button className="cine-close-subscribe" type="submit">
              {newsletterState === "done" ? "Subscribed" : "Subscribe"}
            </button>
          </form>
          {newsletterState === "error" ? (
            <p className="cine-close-form-error">Enter a valid work email.</p>
          ) : null}
        </div>

        <div className="cine-close-link-stack">
          <div className="cine-close-link-grid">
            {FOOTER_TOP.map((column) => (
              <div key={column.title}>
                <p className="cine-label">{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} rel="noreferrer" target="_blank">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="cine-close-link-grid cine-close-link-grid--bottom">
            {FOOTER_BOTTOM.map((column) => (
              <div key={column.title}>
                <p className="cine-label">{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} rel="noreferrer" target="_blank">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cine-close-bar">
        <ul className="cine-close-legal">
          {FOOTER_LEGAL.map((item) => (
            <li key={item.label}>
              <a href={item.href} rel="noreferrer" target="_blank">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="cine-close-bar-copy">LYZR © {year}</p>
        <div className="cine-close-social-icons">
          {FOOTER_SOCIAL.map((item) => (
            <a
              aria-label={item.label}
              href={item.href}
              key={item.label}
              rel="noreferrer"
              target="_blank"
            >
              <svg aria-hidden className="cine-close-social-svg" fill="currentColor" viewBox="0 0 24 24">
                <path d={item.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>

      <FooterWordmark />
    </section>
  );
}

export function CinematicFooter() {
  return null;
}
