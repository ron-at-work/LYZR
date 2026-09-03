'use client';

import { useState } from "react";

export function ArrowHint() {
  return (
    <span aria-hidden className="customer-arrow">
      <svg fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.5 9.5 9.5 2.5M9.5 2.5H4.25M9.5 2.5V7.75"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      </svg>
    </span>
  );
}

export function LogoTile({
  name,
  src,
  col,
  row,
  href,
}: {
  name: string;
  src: string;
  col: number;
  row: number;
  href?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="customer-tile group text-left"
      style={{ gridColumn: col, gridRow: row }}
    >
      <div className="relative h-full w-full">
        <div aria-hidden className="absolute inset-0 bg-white" />
        <div className="relative z-10 flex h-full w-full items-center justify-center px-3 py-6 lg:px-4">
          {!failed ? (
            <img
              alt={name}
              className="customer-logo"
              height={40}
              loading="lazy"
              onError={() => setFailed(true)}
              src={src}
              width={120}
            />
          ) : (
            <span className="text-[14px] font-semibold text-text-primary/50 tracking-tight text-center">
              {name}
            </span>
          )}
          <ArrowHint />
        </div>
        {href ? (
          <a
            aria-label={`Read the ${name} customer story`}
            className="absolute inset-0 z-30 rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/40"
            href={href}
          />
        ) : null}
      </div>
    </div>
  );
}
