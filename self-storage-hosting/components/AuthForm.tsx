"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { friendlyAuthError, validateAuthInput, MAX_NAME, MIN_PASSWORD, type AuthMode } from "@/lib/auth-form";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

/**
 * The login and register form. /legal/accessibility promises what every form
 * on the site does, and tests/form-a11y.test.ts holds this file to it: a
 * visible label for each field, invalid fields marked and linked to their
 * message, and the result announced in a live region. The page renders the
 * h1, not this component.
 */
export default function AuthForm({ mode }: { mode: AuthMode }) {
  const { user, ready, available, login, register, logout } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  // Runs one account request, then says how it went in the live region.
  async function run(request: () => Promise<void>, done: string) {
    setBusy(true);
    setMessage("");
    try {
      await request();
      setFailed(false);
      setMessage(done);
    } catch (err) {
      setFailed(true);
      setMessage(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const input = {
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
      name: String(data.get("name") ?? "").trim(),
    };
    const found = validateAuthInput(mode, input);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFailed(true);
      setMessage("Please fix the fields marked above.");
      return;
    }
    await run(
      () =>
        mode === "login"
          ? login(input.email, input.password)
          : register(input.email, input.password, input.name || undefined),
      mode === "login" ? "You are signed in." : "Your account is ready, and you are signed in."
    );
  }

  const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;
  const field = `mt-1 w-full rounded-lg border border-background-600 bg-white px-3 py-2 ${FOCUS_RING_LIGHT}`;
  const button = `mt-6 rounded-full bg-accent-500 px-6 py-3 font-semibold text-text-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:bg-background-200 ${FOCUS_RING_LIGHT}`;

  if (!available) {
    return (
      <p className="mt-6 text-text-800">
        Signing in is not available right now. If you need help, use the{" "}
        <Link href="/contact" className={link}>
          contact form
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="mt-6">
      {ready && user ? (
        <div>
          <p className="text-text-800">
            You are signed in as <strong>{user.email}</strong>.
          </p>
          <button type="button" onClick={() => run(logout, "You are signed out.")} disabled={busy} className={button}>
            Log out
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} noValidate>
            {mode === "register" && (
              <div className="mb-5">
                <label htmlFor="name" className="font-medium">
                  Name <span className="font-normal text-text-700">(optional)</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={MAX_NAME}
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
            )}

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

            <div className="mt-5">
              <label htmlFor="password" className="font-medium">
                Password <span aria-hidden="true">*</span>
              </label>
              {mode === "register" && (
                <p id="password-hint" className="mt-1 text-sm text-text-700">
                  At least {MIN_PASSWORD} characters.
                </p>
              )}
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                aria-invalid={!!errors.password}
                aria-describedby={
                  [mode === "register" ? "password-hint" : "", errors.password ? "password-error" : ""]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                className={field}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-700">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Disabled until the signed-in check has finished (spec 6.10). */}
            <button type="submit" disabled={!ready || busy} className={button}>
              {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-text-800">
            {mode === "login" ? (
              <>
                New here?{" "}
                <Link href="/user/register" className={link}>
                  Create an account
                </Link>
                .
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/user/login" className={link}>
                  Log in
                </Link>
                .
              </>
            )}
          </p>
        </>
      )}

      {/* Stays mounted across the switch between the form and the signed-in
          view, so "You are signed in." is still announced. */}
      <p role="status" aria-live="polite" className={`mt-4 text-sm ${failed ? "text-red-700" : "text-accent-800"}`}>
        {message}
      </p>
    </div>
  );
}
