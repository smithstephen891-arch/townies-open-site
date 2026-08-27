"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";

// Module scope keeps the clock read out of the component body, where the React
// compiler's purity rule flags it.
function msSince(start: number | null): number {
  return start === null ? 0 : Date.now() - start;
}

const inputClass =
  "w-full rounded-lg border border-celery/40 bg-white px-4 py-3 text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-acid";

const labelClass = "mb-1.5 block text-sm font-semibold text-celery";

export default function InterestForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const mountedAt = useRef<number | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Record when the form became interactive, for the min-time-to-submit check.
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("submitting");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          interest: data.get("interest"),
          message: data.get("message"),
          website: data.get("website") ?? "",
          elapsedMs: msSince(mountedAt.current),
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl bg-celery p-8 text-center focus:outline-none"
      >
        <Image
          src="/images/golf-ball-mascot.png"
          alt=""
          width={1080}
          height={1350}
          sizes="80px"
          className="mx-auto h-auto w-20 rounded-xl"
        />
        <p className="mt-4 text-2xl font-extrabold text-forest">
          You&rsquo;re on the list!
        </p>
        <p className="mt-3 leading-relaxed text-forest/80">
          Thanks &mdash; we&rsquo;ll email you when registration and details go
          live. Keep an eye on{" "}
          <a
            href="https://www.instagram.com/towniesgolf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4"
          >
            @towniesgolf
          </a>{" "}
          in the meantime.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6">
      {/* Honeypot: humans never see or reach this field; bots that fill it are
          silently dropped server-side. Clipped to a 1px box rather than parked
          at a large negative offset, which iOS Safari treats as real content
          and lets the reader drag the whole page sideways to reach. Still not
          display:none, so naive bots keep filling it. */}
      <div
        aria-hidden="true"
        className="absolute h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]"
      >
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={120}
          autoComplete="name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          maxLength={200}
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="interest" className={labelClass}>
          I&rsquo;m interested in
        </label>
        <select id="interest" name="interest" defaultValue="updates" className={inputClass}>
          <option value="playing">Playing in the tournament</option>
          <option value="sponsoring">Sponsoring</option>
          <option value="volunteering">Volunteering</option>
          <option value="updates">Just keep me posted</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Anything else? <span className="font-normal text-celery/60">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          className={inputClass}
        />
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800"
        >
          Something went wrong and your info didn&rsquo;t go through. Please try
          again in a moment.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-acid py-4 text-base font-extrabold uppercase tracking-wide text-forest transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-celery/60 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Keep Me Posted"}
      </button>

      <p className="text-center text-xs text-celery/70">
        By submitting, you agree to receive Townies Open email updates.
        Unsubscribe anytime.
      </p>
    </form>
  );
}
