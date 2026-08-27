import Image from "next/image";
import InterestForm from "@/components/InterestForm";

export default function Home() {
  return (
    <>
      {/* The logo PNG carries the same forest green as the page background,
          so it needs no masking to sit seamlessly in the hero. */}
      <section className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src="/images/townies-open-logo.png"
          alt="Townies Open"
          width={2391}
          height={1344}
          priority
          sizes="(min-width: 768px) 672px, 90vw"
          className="w-full max-w-2xl h-auto"
        />
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-celery/90 sm:text-base">
          The Official Golf Tournament of Unofficial Golf
        </p>
        <p className="mt-8 text-4xl font-extrabold tracking-tight text-acid sm:text-6xl">
          April 17&ndash;18, 2027
        </p>
        <p className="mt-4 max-w-md text-base text-celery/80 sm:text-lg">
          More details coming soon.
        </p>
        <a
          href="#interest"
          className="mt-10 inline-block min-h-11 rounded-full bg-acid px-9 py-4 text-base font-extrabold uppercase tracking-wide text-forest transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-celery/60"
        >
          Keep Me Posted
        </a>
      </section>

      <section id="interest" className="scroll-mt-8 bg-grey-green">
        <div className="mx-auto max-w-xl px-6 py-20">
          <h1 className="text-3xl font-extrabold text-celery sm:text-4xl">
            Want in?
          </h1>
          <p className="mt-4 leading-relaxed text-celery/80">
            Interested in playing, sponsoring, or volunteering &mdash; or just
            want the details when they drop? Leave your info and we&rsquo;ll
            keep you posted.
          </p>
          <div className="mt-10">
            <InterestForm />
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 text-center">
        <Image
          src="/images/golf-ball-mascot.png"
          alt=""
          width={1080}
          height={1350}
          sizes="80px"
          className="mx-auto h-auto w-20"
        />
        <p className="mt-4 text-sm text-celery/70">
          Follow along{" "}
          <a
            href="https://www.instagram.com/towniesgolf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-celery underline underline-offset-4 hover:text-acid"
          >
            @towniesgolf
          </a>
        </p>
      </footer>
    </>
  );
}
