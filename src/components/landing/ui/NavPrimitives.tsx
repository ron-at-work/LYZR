'use client';

import { type ReactNode } from "react";
import { NAV_EXT } from "../data/nav";

export function NavChevron({ open }: { open?: boolean }) {
  return (
    <svg
      aria-hidden
      className={`ml-0.5 h-3 w-3 opacity-50 transition-transform duration-200 ${open ? "rotate-180 opacity-80" : ""}`}
      fill="none"
      viewBox="0 0 12 12"
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function NavExtArrow() {
  return (
    <svg
      aria-hidden
      className="h-2.5 w-2.5 shrink-0 text-ink-hint opacity-0 -translate-x-0.5 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-150"
      fill="none"
      viewBox="0 0 10 10"
    >
      <path d="M2 8L8 2M8 2H3M8 2v5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  );
}

export function NavIcon({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="material-symbols-outlined text-[16px] leading-none text-ink-soft group-hover/link:text-ink transition-colors"
    >
      {name}
    </span>
  );
}

export function NavDropLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-hint block mb-2.5 px-1.5">
      {children}
    </span>
  );
}

export function NavTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-volt/70 text-ink leading-none">
      {children}
    </span>
  );
}

export function NavMegaLink({
  name,
  sub,
  href,
  icon,
}: {
  name: string;
  sub?: string;
  href: string;
  icon?: string;
}) {
  return (
    <a className="nav-mega-link group/link" href={href} {...NAV_EXT}>
      {icon ? (
        <span className="nav-mega-icon">
          <NavIcon name={icon} />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-ink leading-snug tracking-tight">{name}</span>
        {sub ? <span className="block text-[11.5px] text-ink-quiet leading-snug mt-0.5">{sub}</span> : null}
      </span>
      <NavExtArrow />
    </a>
  );
}

export function NavSimpleLink({
  name,
  href,
  tag,
  icon,
}: {
  name: string;
  href: string;
  tag?: string | null;
  icon?: string;
}) {
  return (
    <a className="nav-mega-link group/link" href={href} {...NAV_EXT}>
      {icon ? (
        <span className="nav-mega-icon nav-mega-icon--sm">
          <NavIcon name={icon} />
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1.5 min-w-0 flex-1">
        <span className="text-[13px] font-medium text-ink tracking-tight">{name}</span>
        {tag ? <NavTag>{tag}</NavTag> : null}
      </span>
      <NavExtArrow />
    </a>
  );
}

export function NavProductCard({
  name,
  sub,
  href,
  tag,
  icon,
}: {
  name: string;
  sub: string;
  href: string | null;
  tag?: string | null;
  icon: string;
}) {
  if (!href) {
    return (
      <div className="nav-product-card is-disabled" aria-disabled="true">
        <span className="nav-mega-icon">
          <NavIcon name={icon} />
        </span>
        <span className="min-w-0">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[13px] font-medium text-ink tracking-tight">{name}</span>
            {tag ? <NavTag>{tag}</NavTag> : null}
          </span>
          <span className="block text-[11.5px] text-ink-quiet leading-snug mt-0.5">{sub}</span>
        </span>
      </div>
    );
  }

  return (
    <a className="nav-product-card group/link" href={href} {...NAV_EXT}>
      <span className="nav-mega-icon">
        <NavIcon name={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-ink tracking-tight">{name}</span>
          {tag ? <NavTag>{tag}</NavTag> : null}
        </span>
        <span className="block text-[11.5px] text-ink-quiet leading-snug mt-0.5">{sub}</span>
      </span>
      <NavExtArrow />
    </a>
  );
}

export function NavFooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="nav-mega-footer-link group/link" href={href} {...NAV_EXT}>
      <span>{children}</span>
      <svg aria-hidden className="h-3 w-3 transition-transform duration-150 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 12 12">
        <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
      </svg>
    </a>
  );
}
