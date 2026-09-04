'use client';

export function CtaSection() {
  return (
    <section className="w-full max-w-container-max mx-auto page-pad section-y" id="get-started">
      <div className="cta-panel relative overflow-hidden rounded-[1.75rem] border border-border-crisp bg-brand-ink p-space-48 md:p-space-80 text-center flex flex-col items-center">
        <h2 className="font-display display-cta font-semibold text-text-primary max-w-[14ch] mb-space-20">
          8 weeks to agents in production.
        </h2>
        <p className="text-[15px] sm:text-[17px] text-text-secondary max-w-xl mb-space-40 leading-relaxed">
          Bring your LLMs, frameworks, and compliance mandates. We will show the architecture that makes it live in your VPC.
        </p>
        <form
          className="w-full max-w-md flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-surface-card border border-border-crisp p-1.5 rounded-full shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = "https://www.lyzr.ai/book-demo/";
          }}
        >
          <label className="sr-only" htmlFor="cta-email">
            Work email
          </label>
          <input
            autoComplete="email"
            className="w-full px-space-16 h-11 bg-transparent text-text-primary placeholder:text-text-faint text-[14px] focus:outline-none border-0 rounded-full"
            id="cta-email"
            name="email"
            placeholder="What's your work email?"
            required
            type="email"
          />
          <button className="w-full sm:w-auto shrink-0 px-space-20 h-11 btn-brand text-[13.5px] font-semibold rounded-full transition-all active:scale-[0.98]" type="submit">
            Get started
          </button>
        </form>
        <p className="text-[12px] text-text-faint mt-space-16">
          Enterprise NDA on request. VPC-native. SOC 2 Type II.
        </p>
      </div>
    </section>
  );
}
