"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useSmoothScroll } from "../motion/SmoothScrollProvider";
import { useSound } from "../motion/SoundProvider";

gsap.registerPlugin(ScrollTrigger);

const AWARDS = [
  {
    year: "2025",
    title: "AWS Partner of the Year",
    detail: "Finalist — Geo & Global GenAI category",
    href: "https://www.einpresswire.com/article/875773891/lyzr-named-finalist-in-2025-geo-and-global-aws-partner-of-the-year-awards",
  },
  {
    year: "2026",
    title: "CB Insights AI 100",
    detail: "Top 100 most innovative AI companies",
    href: "https://www.lyzr.ai/resources/newsroom/",
  },
  {
    year: "2025",
    title: "AWS GenAI Competency",
    detail: "Production-grade GenAI on AWS, validated",
    href: "https://www.lyzr.ai/resources/newsroom/",
  },
  {
    year: "2025",
    title: "Agentic AI Specialization",
    detail: "Early ISV credential for agent platforms",
    href: "https://www.lyzr.ai/resources/newsroom/",
  },
] as const;

const NEWS = [
  {
    date: "Dec 2025",
    outlet: "AWS re:Invent",
    headline: "Named finalist at the Partner Awards Gala for Generative AI",
    href: "https://www.einpresswire.com/article/875773891/lyzr-named-finalist-in-2025-geo-and-global-aws-partner-of-the-year-awards",
  },
  {
    date: "May 2026",
    outlet: "HFS Research",
    headline: "Mapped in Agentic Technology Capabilities 2026",
    href: "https://www.hfsresearch.com/research/lyzr-agentic-technology-capabilities-2026/",
  },
  {
    date: "Jun 2026",
    outlet: "CB Insights",
    headline: "Listed on the AI 100 shortlist for category-defining platforms",
    href: "https://www.lyzr.ai/resources/newsroom/",
  },
  {
    date: "2025–26",
    outlet: "Analyst brief",
    headline: "Ecosystem recognition across Gartner notes and AWS partner motion",
    href: "https://www.lyzr.ai/wp-content/uploads/2026/05/Lyzr_AI_Analyst_Ecosystem_Recognition_2026.pdf",
  },
] as const;

export function AwardsNewsSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { lenis } = useSmoothScroll();
  const { playHover } = useSound();

  useEffect(() => {
    if (!ref.current) return;
    const section = ref.current;
    const head = section.querySelector<HTMLElement>(".cine-press-head");
    const awards = section.querySelectorAll<HTMLElement>(".cine-press-award");
    const news = section.querySelectorAll<HTMLElement>(".cine-press-news");

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([head, awards, news], { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      gsap.set(head, { opacity: 0, y: 24 });
      gsap.set(awards, { opacity: 0, y: 28 });
      gsap.set(news, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(head, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" })
        .to(
          awards,
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" },
          0.1,
        )
        .to(
          news,
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
          0.25,
        );
    }, ref);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [reduce]);

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  return (
    <section className="cine-press" id="press" ref={ref}>
      <div className="cine-press-head">
        <p className="cine-label">Recognition</p>
        <h2>
          Awards
          <span aria-hidden> &amp; </span>
          news
        </h2>
        <p className="cine-press-sub">
          Signals from partners, analysts, and the ecosystem — not vanity metrics.
        </p>
      </div>

      <div className="cine-press-board">
        <ul className="cine-press-awards" role="list">
          {AWARDS.map((item, i) => (
            <li key={item.title}>
              <a
                className="cine-press-award"
                href={item.href}
                onFocus={() => playHover(0.8 + i * 0.06)}
                onMouseEnter={() => playHover(0.8 + i * 0.06)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="cine-press-year">{item.year}</span>
                <span className="cine-press-award-copy">
                  <span className="cine-press-award-title">{item.title}</span>
                  <span className="cine-press-award-detail">{item.detail}</span>
                </span>
                <span aria-hidden className="cine-press-arrow">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="cine-press-news-col">
          <p className="cine-label">In the news</p>
          <ul className="cine-press-news-list" role="list">
            {NEWS.map((item, i) => (
              <li key={item.headline}>
                <a
                  className="cine-press-news"
                  href={item.href}
                  onFocus={() => playHover(0.7 + i * 0.05)}
                  onMouseEnter={() => playHover(0.7 + i * 0.05)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="cine-press-news-meta">
                    <span>{item.date}</span>
                    <span>{item.outlet}</span>
                  </span>
                  <span className="cine-press-news-headline">{item.headline}</span>
                </a>
              </li>
            ))}
          </ul>
          <a className="cine-link" href="https://www.lyzr.ai/resources/newsroom/">
            Visit newsroom <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
