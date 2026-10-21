// frontend/app/contact/page.tsx

import { PageContainer, PageEyebrow } from "@/components/ui";
import { AppInput, AppTextarea } from "@/components/ui/app";

const contactInputClassName =
  "min-h-12 w-full rounded-2xl border border-[#ddd6cb] bg-[#fcfaf7] px-4 text-base text-[#171717] shadow-none outline-none transition focus:border-[#bfb3a4] focus:bg-[#fcfaf7] focus:ring-0 sm:rounded-full sm:text-base";

const contactLabelClassName = "text-[#171717]";
const contactHintClassName = "text-xs leading-4 text-[#6e6458]";
const contactTextareaClassName =
  "min-h-[160px] w-full rounded-[1.5rem] border border-[#ddd6cb] bg-[#fcfaf7] px-4 py-3 text-base text-[#171717] shadow-none outline-none transition focus:border-[#bfb3a4] focus:bg-[#fcfaf7] focus:ring-0 sm:text-base";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] py-6 text-[#171717]">
      <PageContainer size="narrow">
        <section className="rounded-[2rem] border border-[#e7e0d5] bg-white px-5 py-6 shadow-[0_18px_40px_rgba(57,43,27,0.05)] sm:px-8 sm:py-8">
          <div className="max-w-2xl">
            <PageEyebrow>Contact</PageEyebrow>
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
            <AppInput
              id="contact-name"
              name="name"
              label="Naam"
              hint="Vul je naam in, zodat we weten van wie het bericht komt."
              type="text"
              autoComplete="name"
              required
              showRequiredIndicator={false}
              labelClassName={contactLabelClassName}
              hintClassName={contactHintClassName}
              className={contactInputClassName}
            />

            <AppInput
              id="contact-email"
              name="email"
              label="E-mailadres"
              hint="We gebruiken je e-mailadres alleen om te kunnen reageren."
              type="email"
              autoComplete="email"
              required
              showRequiredIndicator={false}
              labelClassName={contactLabelClassName}
              hintClassName={contactHintClassName}
              className={contactInputClassName}
            />

            <AppInput
              id="contact-subject"
              name="subject"
              label="Onderwerp"
              hint="Bijvoorbeeld een vraag, tip of samenwerking."
              type="text"
              required
              showRequiredIndicator={false}
              labelClassName={contactLabelClassName}
              hintClassName={contactHintClassName}
              className={contactInputClassName}
            />

            <AppTextarea
              id="contact-message"
              name="message"
              label="Bericht"
              hint="Schrijf kort wat je wilt delen. We lezen ieder bericht."
              rows={6}
              required
              showRequiredIndicator={false}
              labelClassName={contactLabelClassName}
              hintClassName={contactHintClassName}
              className={contactTextareaClassName}
            />

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
      </PageContainer>
    </main>
  );
}
