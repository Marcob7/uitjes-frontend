// frontend/app/contact/page.tsx

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-[2rem] border border-[#e7e0d5] bg-white px-5 py-6 shadow-[0_18px_40px_rgba(57,43,27,0.05)] sm:px-8 sm:py-8">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-2xl bg-[#eef5df] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#50672f] sm:rounded-full">
              Contact
            </div>
            <h1 className="mt-5 text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.95] tracking-[-0.06em] text-[#171717]">
              Stuur ons een bericht
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#61584d] sm:text-base">
              Heb je een tip, vraag, samenwerking of klopt er iets niet? Stuur
              gerust een bericht.
            </p>
          </div>

          <form
            action="https://forminit.com/f/sr7Inj96bwy"
            method="POST"
            className="mt-8 grid gap-5"
          >
            <label className="grid gap-2" htmlFor="contact-name">
              <div className="text-sm font-semibold text-[#171717]">
                Naam
              </div>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-describedby="contact-name-help"
                className="min-h-12 w-full rounded-2xl border border-[#ddd6cb] bg-[#fcfaf7] px-4 text-base text-[#171717] outline-none transition focus:border-[#bfb3a4] sm:rounded-full"
              />
              <div id="contact-name-help" className="text-xs text-[#6e6458]">
                Vul je naam in, zodat we weten van wie het bericht komt.
              </div>
            </label>

            <label className="grid gap-2" htmlFor="contact-email">
              <div className="text-sm font-semibold text-[#171717]">
                E-mailadres
              </div>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-describedby="contact-email-help"
                className="min-h-12 w-full rounded-2xl border border-[#ddd6cb] bg-[#fcfaf7] px-4 text-base text-[#171717] outline-none transition focus:border-[#bfb3a4] sm:rounded-full"
              />
              <div id="contact-email-help" className="text-xs text-[#6e6458]">
                We gebruiken je e-mailadres alleen om te kunnen reageren.
              </div>
            </label>

            <label className="grid gap-2" htmlFor="contact-subject">
              <div className="text-sm font-semibold text-[#171717]">
                Onderwerp
              </div>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                aria-describedby="contact-subject-help"
                className="min-h-12 w-full rounded-2xl border border-[#ddd6cb] bg-[#fcfaf7] px-4 text-base text-[#171717] outline-none transition focus:border-[#bfb3a4] sm:rounded-full"
              />
              <div id="contact-subject-help" className="text-xs text-[#6e6458]">
                Bijvoorbeeld een vraag, tip of samenwerking.
              </div>
            </label>

            <label className="grid gap-2" htmlFor="contact-message">
              <div className="text-sm font-semibold text-[#171717]">
                Bericht
              </div>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                required
                aria-describedby="contact-message-help"
                className="min-h-[160px] w-full rounded-[1.5rem] border border-[#ddd6cb] bg-[#fcfaf7] px-4 py-3 text-base text-[#171717] outline-none transition focus:border-[#bfb3a4]"
              />
              <div id="contact-message-help" className="text-xs text-[#6e6458]">
                Schrijf kort wat je wilt delen. We lezen ieder bericht.
              </div>
            </label>

            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#171717] bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#2b261f] sm:w-auto sm:rounded-full"
            >
              Verstuur bericht
            </button>

            <div className="text-xs text-[#6e6458]">
              Na versturen handelt Forminit de bevestiging af.
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
