'use client';

import type React from "react";
import {
  NAV_EXT,
  NAV_SOLUTIONS,
  NAV_PLATFORM,
  NAV_PARTNERS,
  NAV_RESOURCES,
  type NavMenuId,
} from "../data";
import {
  NavChevron,
  NavDropLabel,
  NavMegaLink,
  NavSimpleLink,
  NavProductCard,
  NavFooterLink,
} from "../ui";

export type SiteHeaderProps = {
  bannerOpen: boolean;
  onDismissBanner: () => void;
  navSolid: boolean;
  openNav: NavMenuId | null;
  openNavMenu: (id: NavMenuId) => void;
  scheduleCloseNav: () => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileSection: NavMenuId | null;
  toggleMobileSection: (id: NavMenuId) => void;
  closeMobileNav: () => void;
  headerRef: React.RefObject<HTMLElement | null>;
};

export function SiteHeader({
  bannerOpen,
  onDismissBanner,
  navSolid,
  openNav,
  openNavMenu,
  scheduleCloseNav,
  mobileOpen,
  setMobileOpen,
  mobileSection,
  toggleMobileSection,
  closeMobileNav,
  headerRef,
}: SiteHeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 pointer-events-none" ref={headerRef}>
      {bannerOpen && (
        <div className="pointer-events-auto relative bg-ink-banner site-announce text-center text-on-primary/90 tracking-tight">
          <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 pr-1">
            <span className="site-announce-copy">New: Lyzr Control Plane — govern every agent across AWS, Azure, and LangChain.</span>
            <span className="site-announce-copy-short">New: Lyzr Control Plane is live.</span>
            <a className="font-medium text-on-primary underline underline-offset-2 hover:text-on-primary/70 transition-colors" href="#control-plane" onClick={closeMobileNav}>
              Learn more
            </a>
          </span>
          <button
            aria-label="Dismiss announcement"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-on-primary/50 hover:text-on-primary transition-colors p-1.5"
            onClick={onDismissBanner}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
      <div className="pointer-events-none px-3 sm:px-5 pt-3 pb-2">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-3">
          {/* Brand */}
          <a
            aria-label="Lyzr home"
            className={`nav-chrome pointer-events-auto inline-flex items-center h-11 ${navSolid ? "is-solid px-3.5" : "px-1"}`}
            href="#"
            onClick={closeMobileNav}
          >
            <img
              alt=""
              className="h-7 w-auto"
              src="/lyzr-logo.png"
            />
          </a>

          {/* Nav + CTA */}
          <div
            className={`nav-chrome pointer-events-auto hidden lg:flex items-center h-11 overflow-visible ${navSolid ? "is-solid pl-1 pr-1.5" : ""}`}
          >
            <nav className="hidden lg:flex items-center h-full px-1">
              {/* Solutions */}
              <div
                className={`nav-item relative h-full flex items-center${openNav === "solutions" ? " is-open" : ""}`}
                onMouseEnter={() => openNavMenu("solutions")}
                onMouseLeave={scheduleCloseNav}
              >
                <button
                  aria-expanded={openNav === "solutions"}
                  className={`nav-trigger${openNav === "solutions" ? " is-active" : ""}`}
                  onClick={() => openNavMenu("solutions")}
                  onFocus={() => openNavMenu("solutions")}
                  type="button"
                >
                  Solutions
                  <NavChevron open={openNav === "solutions"} />
                </button>
                <div className="nav-mega nav-mega--solutions" role="menu">
                  <div className="nav-mega-panel">
                    <div className="nav-mega-body">
                      <div className="nav-mega-cols">
                        <div>
                          <NavDropLabel>By Industry</NavDropLabel>
                          {NAV_SOLUTIONS.industry.map((item) => (
                            <NavMegaLink key={item.name} href={item.href} icon={item.icon} name={item.name} sub={item.sub} />
                          ))}
                        </div>
                        <div>
                          <NavDropLabel>By Function</NavDropLabel>
                          {NAV_SOLUTIONS.function.map((item) => (
                            <NavMegaLink key={item.name} href={item.href} icon={item.icon} name={item.name} sub={item.sub} />
                          ))}
                        </div>
                        <div>
                          <NavDropLabel>By Team</NavDropLabel>
                          {NAV_SOLUTIONS.team.map((item) => (
                            <NavMegaLink key={item.name} href={item.href} icon={item.icon} name={item.name} sub={item.sub} />
                          ))}
                        </div>
                      </div>
                      <aside className="nav-mega-aside">
                        <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-hint">Spotlight</span>
                        <a className="nav-spotlight group/link" href="https://www.lyzr.ai/control-plane/" {...NAV_EXT}>
                          <span className="nav-spotlight-kicker">New</span>
                          <span className="nav-spotlight-title">Control Plane</span>
                          <span className="nav-spotlight-copy">Govern every agent across AWS, Azure, and LangChain — one policy layer.</span>
                          <span className="nav-spotlight-cta">
                            Explore Control Plane
                            <svg aria-hidden className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 12 12">
                              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                            </svg>
                          </span>
                        </a>
                        <div className="nav-role-row">
                          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-hint shrink-0">By role</span>
                          <div className="flex flex-wrap gap-1.5">
                            {NAV_SOLUTIONS.role.map((item) => (
                              <a className="nav-role-chip" href={item.href} key={item.name} {...NAV_EXT}>
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </aside>
                    </div>
                    <div className="nav-mega-footer">
                      <span className="text-[12.5px] text-ink-quiet">Agents shaped for your industry, function, and team.</span>
                      <NavFooterLink href="https://www.lyzr.ai/usecases/">View all solutions</NavFooterLink>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform */}
              <div
                className={`nav-item relative h-full flex items-center${openNav === "platform" ? " is-open" : ""}`}
                onMouseEnter={() => openNavMenu("platform")}
                onMouseLeave={scheduleCloseNav}
              >
                <button
                  aria-expanded={openNav === "platform"}
                  className={`nav-trigger${openNav === "platform" ? " is-active" : ""}`}
                  onClick={() => openNavMenu("platform")}
                  onFocus={() => openNavMenu("platform")}
                  type="button"
                >
                  Platform
                  <NavChevron open={openNav === "platform"} />
                </button>
                <div className="nav-mega nav-mega--platform" role="menu">
                  <div className="nav-mega-panel">
                    <div className="nav-mega-body nav-mega-body--platform">
                      <div>
                        <NavDropLabel>Products</NavDropLabel>
                        <div className="grid grid-cols-2 gap-1">
                          {NAV_PLATFORM.products.map((item) => (
                            <NavProductCard
                              key={item.name}
                              href={item.href}
                              icon={item.icon}
                              name={item.name}
                              sub={item.sub}
                              tag={item.tag}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="nav-mega-rail">
                        <div>
                          <NavDropLabel>Modules</NavDropLabel>
                          {NAV_PLATFORM.modules.map((item) => (
                            <NavSimpleLink key={item.name} href={item.href} icon={item.icon} name={item.name} />
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-hairline">
                          <NavDropLabel>Open Source &amp; Dev</NavDropLabel>
                          {NAV_PLATFORM.openSource.map((item) => (
                            <NavSimpleLink key={item.name} href={item.href} name={item.name} tag={item.tag} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="nav-mega-footer">
                      <span className="text-[12.5px] text-ink-quiet">Build in Studio. Govern in Control Plane. Ship on Agentic OS.</span>
                      <NavFooterLink href="https://studio.lyzr.ai/">Open Agent Studio</NavFooterLink>
                    </div>
                  </div>
                </div>
              </div>

              <a className="nav-trigger" href="https://www.lyzr.ai/customers/" {...NAV_EXT}>
                Customers
              </a>
              <a className="nav-trigger" href="https://www.lyzr.ai/pricing/" {...NAV_EXT}>
                Pricing
              </a>

              {/* Partners */}
              <div
                className={`nav-item relative h-full flex items-center${openNav === "partners" ? " is-open" : ""}`}
                onMouseEnter={() => openNavMenu("partners")}
                onMouseLeave={scheduleCloseNav}
              >
                <button
                  aria-expanded={openNav === "partners"}
                  className={`nav-trigger${openNav === "partners" ? " is-active" : ""}`}
                  onClick={() => openNavMenu("partners")}
                  onFocus={() => openNavMenu("partners")}
                  type="button"
                >
                  Partners
                  <NavChevron open={openNav === "partners"} />
                </button>
                <div className="nav-mega nav-mega--partners" role="menu">
                  <div className="nav-mega-panel">
                    <div className="nav-mega-body nav-mega-body--partners">
                      <div>
                        <NavDropLabel>Technology</NavDropLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {NAV_PARTNERS.technology.map((item) => {
                            const inner = (
                              <>
                                <span className="nav-partner-logo">
                                  <img alt="" className="h-5 w-auto max-w-[72px] object-contain" src={item.logo} />
                                </span>
                                <span className="text-[12.5px] font-medium text-ink tracking-tight">{item.name}</span>
                              </>
                            );
                            return item.href ? (
                              <a className="nav-partner-tile group/link" href={item.href} key={item.name} {...NAV_EXT}>
                                {inner}
                              </a>
                            ) : (
                              <div aria-disabled="true" className="nav-partner-tile is-disabled" key={item.name}>
                                {inner}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <NavDropLabel>Ecosystem</NavDropLabel>
                        {NAV_PARTNERS.ecosystem.map((item) => (
                          <NavMegaLink key={item.name} href={item.href} icon={item.icon} name={item.name} sub={item.sub} />
                        ))}
                        <a className="nav-spotlight nav-spotlight--compact group/link mt-3" href="https://www.lyzr.ai/partners/" {...NAV_EXT}>
                          <span className="nav-spotlight-title">Become a partner</span>
                          <span className="nav-spotlight-copy">Co-sell, co-build, and marketplace routes with Lyzr.</span>
                          <span className="nav-spotlight-cta">
                            Join the program
                            <svg aria-hidden className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 12 12">
                              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                            </svg>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div
                className={`nav-item relative h-full flex items-center${openNav === "resources" ? " is-open" : ""}`}
                onMouseEnter={() => openNavMenu("resources")}
                onMouseLeave={scheduleCloseNav}
              >
                <button
                  aria-expanded={openNav === "resources"}
                  className={`nav-trigger${openNav === "resources" ? " is-active" : ""}`}
                  onClick={() => openNavMenu("resources")}
                  onFocus={() => openNavMenu("resources")}
                  type="button"
                >
                  Resources
                  <NavChevron open={openNav === "resources"} />
                </button>
                <div className="nav-mega nav-mega--resources" role="menu">
                  <div className="nav-mega-panel">
                    <div className="nav-mega-body">
                      <div className="nav-mega-cols nav-mega-cols--3">
                        <div>
                          <NavDropLabel>Learn</NavDropLabel>
                          {NAV_RESOURCES.learn.map((item) => (
                            <NavSimpleLink key={item.name} href={item.href} icon={item.icon} name={item.name} />
                          ))}
                        </div>
                        <div>
                          <NavDropLabel>Playbooks &amp; Templates</NavDropLabel>
                          {NAV_RESOURCES.playbooks.map((item) => (
                            <NavSimpleLink key={item.name} href={item.href} name={item.name} />
                          ))}
                        </div>
                        <div>
                          <NavDropLabel>Analyze</NavDropLabel>
                          {NAV_RESOURCES.analyze.map((item) => (
                            <NavSimpleLink key={item.name} href={item.href} icon={item.icon} name={item.name} />
                          ))}
                        </div>
                      </div>
                      <aside className="nav-mega-aside">
                        <NavDropLabel>Featured</NavDropLabel>
                        <div className="flex flex-col gap-2">
                          {NAV_RESOURCES.featured.map((item) => (
                            <a
                              className={`nav-featured-card group/link${item.tone === "volt" ? " is-volt" : ""}`}
                              href={item.href}
                              key={item.title}
                              {...NAV_EXT}
                            >
                              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">{item.label}</span>
                              <span className="mt-1.5 block text-[13px] font-medium text-ink leading-snug tracking-tight">{item.title}</span>
                              <span className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-ink-soft">
                                Read story
                                <svg aria-hidden className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 12 12">
                                  <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                                </svg>
                              </span>
                            </a>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-hairline">
                          <NavDropLabel>Connect</NavDropLabel>
                          {NAV_RESOURCES.connect.map((item) => (
                            <NavSimpleLink key={item.name} href={item.href} name={item.name} />
                          ))}
                        </div>
                      </aside>
                    </div>
                    <div className="nav-mega-footer">
                      <span className="text-[12.5px] text-ink-quiet">Playbooks, assessments, and proof from production.</span>
                      <NavFooterLink href="https://www.lyzr.ai/blog/">Browse the blog</NavFooterLink>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <div className="nr">
              <a className="bsi" href="https://studio.lyzr.ai/" {...NAV_EXT}>
                Agent Studio
                <svg aria-hidden className="bsi-arrow" fill="none" height="12" viewBox="0 0 12 12" width="12">
                  <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </a>
              <a
                className="ml-0.5 inline-flex items-center gap-2 h-8 pl-3 pr-3.5 rounded-full btn-brand text-[13px] font-semibold active:scale-[0.98] transition-all"
                href="#get-started"
              >
                Get started
              </a>
            </div>
          </div>

          {/* Mobile / tablet actions */}
          <div className="mobile-nav-actions pointer-events-auto flex lg:hidden items-center gap-2">
            <a
              className="inline-flex items-center h-11 px-4 rounded-full btn-brand text-[13px] font-semibold shadow-mobile-cta"
              href="#get-started"
              onClick={closeMobileNav}
            >
              Get started
            </a>
            <button
              aria-controls="mobile-nav"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="mobile-nav-btn"
              onClick={() => setMobileOpen((v) => !v)}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="mobile-nav pointer-events-auto" id="mobile-nav" role="dialog" aria-modal="true" aria-label="Site navigation">
          <div className="mobile-nav-bar">
            <a aria-label="Lyzr home" className="inline-flex items-center h-11 px-1" href="#" onClick={closeMobileNav}>
              <img alt="" className="h-7 w-auto" src="/lyzr-logo.png" />
            </a>
            <button aria-label="Close menu" className="mobile-nav-btn" onClick={closeMobileNav} type="button">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">close</span>
            </button>
          </div>
          <div className="mobile-nav-scroll">
            <div className="mobile-nav-group">
              <button className="mobile-nav-group-btn" onClick={() => toggleMobileSection("solutions")} type="button">
                Solutions
                <NavChevron open={mobileSection === "solutions"} />
              </button>
              {mobileSection === "solutions" ? (
                <div className="mobile-nav-group-panel">
                  {[...NAV_SOLUTIONS.industry, ...NAV_SOLUTIONS.function, ...NAV_SOLUTIONS.team].map((item) => (
                    <a className="mobile-nav-sublink" href={item.href} key={`sol-${item.name}`} onClick={closeMobileNav} {...NAV_EXT}>
                      {item.name}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mobile-nav-group">
              <button className="mobile-nav-group-btn" onClick={() => toggleMobileSection("platform")} type="button">
                Platform
                <NavChevron open={mobileSection === "platform"} />
              </button>
              {mobileSection === "platform" ? (
                <div className="mobile-nav-group-panel">
                  {[...NAV_PLATFORM.products, ...NAV_PLATFORM.modules]
                    .filter((item) => Boolean(item.href))
                    .map((item) => (
                      <a className="mobile-nav-sublink" href={item.href!} key={`plat-${item.name}`} onClick={closeMobileNav} {...NAV_EXT}>
                        {item.name}
                      </a>
                    ))}
                </div>
              ) : null}
            </div>

            <a className="mobile-nav-link" href="https://www.lyzr.ai/customers/" onClick={closeMobileNav} {...NAV_EXT}>
              Customers
            </a>
            <a className="mobile-nav-link" href="https://www.lyzr.ai/pricing/" onClick={closeMobileNav} {...NAV_EXT}>
              Pricing
            </a>

            <div className="mobile-nav-group">
              <button className="mobile-nav-group-btn" onClick={() => toggleMobileSection("partners")} type="button">
                Partners
                <NavChevron open={mobileSection === "partners"} />
              </button>
              {mobileSection === "partners" ? (
                <div className="mobile-nav-group-panel">
                  {NAV_PARTNERS.ecosystem.map((item) => (
                    <a className="mobile-nav-sublink" href={item.href} key={`par-${item.name}`} onClick={closeMobileNav} {...NAV_EXT}>
                      {item.name}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mobile-nav-group">
              <button className="mobile-nav-group-btn" onClick={() => toggleMobileSection("resources")} type="button">
                Resources
                <NavChevron open={mobileSection === "resources"} />
              </button>
              {mobileSection === "resources" ? (
                <div className="mobile-nav-group-panel">
                  {[...NAV_RESOURCES.learn, ...NAV_RESOURCES.playbooks, ...NAV_RESOURCES.analyze].map((item) => (
                    <a className="mobile-nav-sublink" href={item.href} key={`res-${item.name}`} onClick={closeMobileNav} {...NAV_EXT}>
                      {item.name}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mobile-nav-cta-row">
              <a className="mobile-nav-cta mobile-nav-cta--primary" href="#get-started" onClick={closeMobileNav}>
                Get started
              </a>
              <a className="mobile-nav-cta mobile-nav-cta--ghost" href="https://studio.lyzr.ai/" onClick={closeMobileNav} {...NAV_EXT}>
                Open Agent Studio
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
