export function FounderSection() {
  return (
    <>
      {/* 10. FOUNDER'S VISION & OPERATING MANIFESTO */}
      <section className="w-full max-w-container-max mx-auto page-pad section-y">
        <div className="founder-panel w-full bg-text-primary text-on-primary rounded-2xl p-space-40 md:p-space-64 relative overflow-hidden shadow-xl border border-border-strong/30">
          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <img
              alt="Siva Surendira, Founder and CEO of Lyzr AI"
              className="w-28 h-28 rounded-2xl object-cover border border-primary/30 lg:col-span-4 lg:w-full lg:h-auto lg:aspect-square"
              src="/founders/siva-surendira.jpg"
            />
            <div className="lg:col-span-8 lg:order-first">
              <span className="text-[11px] font-mono text-on-primary/45 tracking-widest uppercase mb-space-16 block font-medium">Founder&apos;s Operating Manifesto</span>
              <blockquote className="text-[24px] md:text-[34px] font-normal tracking-tight leading-[1.25] mb-space-32 text-on-primary">
                “Most agent platforms sell raw tools and leave enterprise teams to figure out the hardest parts. At Lyzr, we operate like{" "}
                <span className="font-editorial-italic text-[1.15em] text-volt">Palantir for the agent era</span>
                : platform plus forward-deployed engineers, deep in your VPC, obsessed with taking you to production.”
              </blockquote>
              <div>
                <div className="text-[15px] font-semibold text-on-primary">Siva Surendira</div>
                <div className="text-[13px] text-on-primary/55">Founder &amp; CEO, Lyzr AI</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
