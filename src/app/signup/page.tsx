"use client";

import { RESEND_OTP, SIGNUP, VERIFY_OTP } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { MotionReveal } from "@/components/ui/Motion";
import { Eye, EyeOff } from "lucide-react";
type FormErrors = Partial<
  Record<
    "name" | "email" | "password" | "confirmPassword" | "otp" | "submit",
    string
  >
>;
export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setInterval(
      () => setResendSeconds((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [resendSeconds]);
  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "", submit: "" }));
  }
  function validateDetails() {
    const next: FormErrors = {};
    if (form.name.trim().length < 2)
      next.name = "Name must contain at least 2 characters.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (form.password.length < 8)
      next.password = "Password must contain at least 8 characters.";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }
  async function submitDetails(event: FormEvent) {
    event.preventDefault();
    if (loading || !validateDetails()) return;
    setLoading(true);
    setSuccess("");
    try {
      const response = await fetch(SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        const detail = Array.isArray(payload?.errors)
          ? payload.errors.join(" ")
          : payload?.message;
        throw new Error(detail || "Unable to create your account.");
      }
      setStep("otp");
      setResendSeconds(60);
      setSuccess("We sent a 6-digit verification OTP to your email.");
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Unable to create your account.",
      });
    } finally {
      setLoading(false);
    }
  }
  async function verifyOtp(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    if (!/^\d{6}$/.test(form.otp)) {
      setErrors({ otp: "Enter the 6-digit OTP." });
      return;
    }
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const response = await fetch(VERIFY_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          otp: form.otp,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        const detail = Array.isArray(payload?.errors)
          ? payload.errors.join(" ")
          : payload?.message;
        throw new Error(detail || "Unable to verify OTP.");
      }
      setSuccess("Email verified successfully. Your account is ready.");
      window.setTimeout(
        () =>
          router.replace(
            payload.data?.user?.role === "admin" ? "/admin" : "/my-bookings",
          ),
        700,
      );
    } catch (error) {
      setErrors({
        otp: error instanceof Error ? error.message : "Unable to verify OTP.",
      });
    } finally {
      setLoading(false);
    }
  }
  async function resendOtp() {
    if (loading || resendSeconds > 0) return;
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const response = await fetch(RESEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim().toLowerCase() }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        const detail = Array.isArray(payload?.errors)
          ? payload.errors.join(" ")
          : payload?.message;
        throw new Error(detail || "Unable to resend OTP.");
      }
      setResendSeconds(60);
      setSuccess("A new verification OTP has been sent.");
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error ? error.message : "Unable to resend OTP.",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="auth-page">
      <MotionReveal className="auth-card">
        <h1 className="text-headline-lg auth-title ui-heading">
          {step === "details" ? "Create an account" : "Verify your email"}
        </h1>
        <p className="auth-subtitle">
          {step === "details"
            ? "Keep your session bookings and details together in one secure place."
            : "Enter the OTP sent to " +
              form.email +
              ". It expires in 5 minutes."}
        </p>
        {step === "details" ? (
          <form onSubmit={submitDetails} className="auth-form" noValidate>
            <AuthField label="Name" error={errors.name}>
              <input
                className="auth-input"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                maxLength={100}
              />
            </AuthField>
            <AuthField label="Email" error={errors.email}>
              <input
                type="email"
                className="auth-input"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </AuthField>
            <AuthField
              label="Password"
              error={errors.password}
              hint="Use at least 8 characters."
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input pr-12"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  minLength={8}
                  maxLength={128}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#5a6770] hover:text-[#173f4d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a8ea1]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </AuthField>
            <AuthField label="Confirm password" error={errors.confirmPassword}>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="auth-input pr-12"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  aria-pressed={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#5a6770] hover:text-[#173f4d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a8ea1]"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </AuthField>
            {errors.submit && (
              <div role="alert" className="auth-inline-message">
                {errors.submit}
              </div>
            )}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Sending OTP…" : "Create account"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="auth-form" noValidate>
            <AuthField label="Verification OTP" error={errors.otp}>
              <input
                className="auth-input text-center tracking-[0.35em]"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={form.otp}
                onChange={(e) =>
                  update("otp", e.target.value.replace(/\D/g, ""))
                }
              />
            </AuthField>
            {errors.submit && (
              <div role="alert" className="auth-inline-message">
                {errors.submit}
              </div>
            )}
            {success && (
              <div role="status" className="auth-inline-message success">
                {success}
              </div>
            )}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
            <button
              type="button"
              className="text-ui font-medium text-[#173f4d] underline disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading || resendSeconds > 0}
              onClick={resendOtp}
            >
              {resendSeconds > 0
                ? "Resend OTP in " + resendSeconds + "s"
                : "Resend OTP"}
            </button>
            <button
              type="button"
              className="text-ui text-[#5a6770] underline"
              disabled={loading}
              onClick={() => {
                setStep("details");
                setSuccess("");
                setErrors({});
              }}
            >
              Change details
            </button>
          </form>
        )}
        <div className="auth-footer">
          <span>Already have an account?</span>
          <br />
          <Link href="/login" className="auth-link">
            Log in
          </Link>
        </div>
      </MotionReveal>
    </main>
  );
}
function AuthField({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="auth-field">{label}</label>
      {children}
      {error ? (
        <span className="auth-inline-message mt-1 block">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-caption text-[#5a6770]">{hint}</span>
      ) : null}
    </div>
  );
}
