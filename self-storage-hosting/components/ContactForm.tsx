"use client";

import { useState } from "react";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";
import { interpretResponse } from "@/lib/contact";

type Errors = Record<string, string>;
type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ subject = "general" }: { subject?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setErrors({});
    setMessage("");

    const data = Object.fromEntries(new FormData(form).entries());

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, subject }),
        signal: controller.signal,
      });
      const body = await res.json().catch(() => ({}));
      const outcome = interpretResponse(res.ok, body);
      setErrors(outcome.errors);
      setStatus(outcome.status);
      setMessage(outcome.message);
      if (outcome.status === "sent") form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof DOMException && err.name === "AbortError"
          ? "That took too long. Please try again."
          : "We could not reach the server. Please check your connection and try again."
      );
    } finally {
      clearTimeout(timer);
    }
  }

  const field = `mt-1 w-full rounded-lg border border-background-600 bg-white px-3 py-2 ${FOCUS_RING_LIGHT}`;

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl">
      {/* Honeypot: hidden from users, irresistible to bots. Never name this
          after a field the form really collects - see lib/contact.ts. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="font-medium">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={field}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-700">
              {errors.name}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="company" className="font-medium">
            Company <span className="font-normal text-text-700">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="email" className="font-medium">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={field}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-700">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="font-medium">
            Phone <span className="font-normal text-text-700">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </div>

        <div>
          <label htmlFor="facilityCount" className="font-medium">
            How many facilities? <span className="font-normal text-text-700">(optional)</span>
          </label>
          <input id="facilityCount" name="facilityCount" type="text" className={field} />
        </div>

        <div>
          <label htmlFor="fms" className="font-medium">
            Facility management software <span className="font-normal text-text-700">(optional)</span>
          </label>
          <input
            id="fms"
            name="fms"
            type="text"
            placeholder="e.g. Sitelink by Storable, Storable Easy"
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="gateSystem" className="font-medium">
            Gate or access control system{" "}
            <span className="font-normal text-text-700">(optional)</span>
          </label>
          <input
            id="gateSystem"
            name="gateSystem"
            type="text"
            placeholder="e.g. DigiGate, PTI, Janus"
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="font-medium">
            What do you need? <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            maxLength={5000}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={field}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-sm text-red-700">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className={`mt-6 rounded-full bg-accent-500 px-6 py-3 font-semibold text-text-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING_LIGHT}`}
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {/* Announced to screen readers without stealing focus. */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-4 text-sm ${status === "error" ? "text-red-700" : "text-accent-800"}`}
      >
        {message}
      </p>
    </form>
  );
}
