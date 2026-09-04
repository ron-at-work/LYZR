export function FounderSection() {
  return (
    <section className="w-full max-w-container-max mx-auto page-pad section-y">
      <div className="founder-panel w-full bg-ink text-on-primary rounded-[1.75rem] p-space-40 md:p-space-64 relative overflow-hidden border border-border-strong/20">
        <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <img
            alt="Siva Surendira, Founder and CEO of Lyzr AI"
            className="w-28 h-28 rounded-2xl object-cover border border-white/10 lg:col-span-4 lg:w-full lg:h-auto lg:aspect-square"
            height={400}
            loading="lazy"
            src="/founders/siva-surendira.jpg"
            width={400}
          />
          <div className="lg:col-span-8 lg:order-first">
            <blockquote className="font-display text-[22px] md:text-[32px] font-medium tracking-tight leading-[1.2] mb-space-32 text-on-primary">
              Most agent platforms sell tools and leave teams alone with the hard parts. We operate like{" "}
              <em className="not-italic text-volt font-semibold">Palantir for the agent era</em>
              : platform plus forward-deployed engineers, inside your VPC, until you are in production.
            </blockquote>
            <div>
              <div className="text-[15px] font-semibold text-on-primary">Siva Surendira</div>
              <div className="text-[13px] text-on-primary/55">Founder and CEO, Lyzr</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
