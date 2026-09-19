"use client";

import { useEffect, useRef, useState } from "react";
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
  // Counts failed validation attempts, so the focus effect below can run only
  // after a real attempt (never on mount) and re-run on a repeat failure even
  // when the fields at fault are unchanged.
  const [attempt, setAttempt] = useState(0);
  // Counts a successful login/register submitted FROM THIS FORM, so the
  // signed-in focus effect never fires for a visitor who was already signed
  // in when the page loaded.
  const [justSignedIn, setJustSignedIn] = useState(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const signedInRef = useRef<HTMLParagraphElement>(null);

  // Runs after the render that put this attempt's aria-invalid and
  // aria-describedby on the fields, so moving focus here makes a screen
  // reader read the field's label and its linked error message. A second
  // failed submit with the same message would otherwise leave the DOM (and
  // so the live region) unchanged, and say nothing.
  useEffect(() => {
    if (attempt === 0) return;
    const target = errors.name
      ? nameRef.current
      : errors.email
        ? emailRef.current
        : errors.password
          ? passwordRef.current
          : null;
    target?.focus();
  }, [attempt, errors]);

  // A successful submit unmounts the focused submit button, dropping focus to
  // <body>. Move it into the signed-in view instead, once, and only for a
  // sign-in that happened through this form.
  useEffect(() => {
    if (justSignedIn === 0) return;
    signedInRef.current?.focus();
  }, [justSignedIn]);

  // Runs one account request, then says how it went in the live region.
  // `moveFocus` is true only for a login/register submitted from this form,
  // never for the logout button in the signed-in view.
  async function run(request: () => Promise<void>, done: string, moveFocus = false) {
    setBusy(true);
    setMessage("");
    try {
      await request();
      setFailed(false);
      setMessage(done);
      if (moveFocus) setJustSignedIn((n) => n + 1);
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
      setAttempt((n) => n + 1);
      return;
    }
    await run(
      () =>
        mode === "login"
          ? login(input.email, input.password)
          : register(input.email, input.password, input.name || undefined),
      mode === "login" ? "You are signed in." : "Your account is ready, and you are signed in.",
      true
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
          {/* tabIndex={-1}: not a stop in tab order, only a target for the
              focus effect above, so a screen reader announces this text
              right after a successful submit instead of leaving focus on
              <body>. */}
          <p ref={signedInRef} tabIndex={-1} className="text-text-800">
            You are signed in as <strong>{user.email}</strong>.
          </p>
          <button type="button" onClick={() => run(logout, "You are signed out.")} disabled={busy} className={button}>
            Log out
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} noValidate>
            <p className="mb-5 text-sm text-text-700">
              Fields marked <span aria-hidden="true">*</span> are required.
            </p>

            {mode === "register" && (
              <div className="mb-5">
                <label htmlFor="name" className="font-medium">
                  Name <span className="font-normal text-text-700">(optional)</span>
                </label>
                <input
                  ref={nameRef}
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
                ref={emailRef}
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
                ref={passwordRef}
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
