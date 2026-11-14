"use client";

import { CREATE_QUOTE_CONTACTS } from "@/utils/api";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  MotionSection,
  MotionText,
  MotionReveal,
  MotionStagger,
  MotionItem,
  HoverZoomContainer,
  HoverZoomImage,
} from "@/components/ui/Motion";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  preferredSession: "",
  preferredFormat: "",
  message: "",
};

const emergencyHelplines = [
  {
    name: "Mann Talks",
    phone: "8686 139139",
    hours: "Available 9 AM – 8 PM",
    website: "https://www.manntalks.org/",
  },
  {
    name: "Vandrevala Foundation Mental Health Helpline",
    phone: "+91 9999 666 555",
    hours: "Available 24/7",
    website: "https://www.vandrevalafoundation.com/free-counseling",
    whatsapp: "919999666555",
  },
  {
    name: "Sangath",
    phone: "011-41198666",
    hours: "Available 10 AM – 6 PM",
    website: "https://www.sangath.in/",
  },
  {
    name: "Connecting Trust",
    phones: ["+91 99220 01122", "+91 99220 04305"],
    hours: "Available 10 AM – 8 PM",
    website: "https://connectingngo.org/",
  },
];

export default function ConversationPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(CREATE_QUOTE_CONTACTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
          preferredSession: form.preferredSession,
          preferredFormat: form.preferredFormat,
          message: form.message.trim(),
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.message ||
          payload.errors?.[0] ||
          "Unable to send your enquiry.",
        );
      }

      setSuccess("Thank you. Your session request has been sent successfully.");
      setForm(initialForm);
      router.replace("/book-session");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send your enquiry.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="design-system-page flex-grow flex flex-col items-center w-full max-w-[1440px] mx-auto">

        <MotionSection className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-start gap-6 px-[clamp(1rem,3vw,3rem)] pb-0 lg:grid-cols-12 lg:gap-12">

          {/* Form card */}
          <MotionReveal
            direction="right"
            className="col-span-1 p-4 lg:col-span-7 md:p-6"
          >
            <MotionStagger className="relative z-10 mb-6">
              {/* <MotionItem>
                <span className="text-label-lg uppercase tracking-widest mb-4 block ui-muted">

                  LET&apos;S TALK
                </span>
              </MotionItem> */}

              <MotionItem>
                <h2 className="mb-2 text-headline-lg ui-heading">
                  Tell us a little about yourself.
                </h2>
              </MotionItem>

              <MotionItem>
                <p className="text-body-md ui-copy">
                  You don&apos;t need to tell us your entire story here. Just share
                  enough for us to understand how we can begin.
                </p>
              </MotionItem>
            </MotionStagger>

            <form onSubmit={handleSubmit} className="relative z-10">
              <MotionStagger className="space-y-8">

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                {/* Name + Phone */}
                <MotionItem>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                    {/* Name */}
                    <div className="group/field relative flex flex-col">
                      <label
                        htmlFor="name"
                        className="mb-1 text-label-md transition-colors ui-text"
                      >
                        Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          handleChange("name", e.target.value)
                        }
                        placeholder="How should we address you?"
                        className="ghost-input"
                      />
                    </div>

                    {/* Phone */}
                    <div className="group/field relative flex flex-col">
                      <label
                        htmlFor="phone"
                        className="mb-1 text-label-md transition-colors ui-text"
                      >
                        Phone / WhatsApp
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) =>
                          handleChange("phone", e.target.value)
                        }
                        placeholder="Best number to reach you"
                        className="ghost-input"
                      />
                    </div>

                  </div>
                </MotionItem>

                {/* Email */}
                <MotionItem>
                  <div className="group/field relative flex flex-col">
                    <label
                      htmlFor="email"
                      className="mb-1 text-label-md ui-text"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        handleChange("email", e.target.value)
                      }
                      placeholder="Where should we send details?"
                      className="ghost-input"
                    />
                  </div>
                </MotionItem>

                {/* Session + Format */}
                <MotionItem>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                    {/* Session */}
                    <div className="group/field relative flex flex-col">
                      <label
                        htmlFor="session"
                        className="mb-1 text-label-md ui-text"
                      >
                        Preferred Session
                      </label>

                      <div className="relative">
                        <select
                          id="session"
                          name="session"
                          value={form.preferredSession}
                          onChange={(e) =>
                            handleChange(
                              "preferredSession",
                              e.target.value
                            )
                          }
                          className="ghost-input w-full pr-8"
                        >
                          <option value="">Select an option</option>
                          <option value="individual">
                            Individual Therapy
                          </option>
                          <option value="couples">
                            Couples Therapy
                          </option>
                          <option value="unsure">
                            I&apos;m Not Sure
                          </option>
                        </select>

                        <span className="material-symbols-outlined pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 ui-muted">
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Format */}
                    <div className="group/field relative flex flex-col">
                      <label
                        htmlFor="format"
                        className="mb-1 text-label-md ui-text"
                      >
                        Preferred Format
                      </label>

                      <div className="relative">
                        <select
                          id="format"
                          name="format"
                          value={form.preferredFormat}
                          onChange={(e) =>
                            handleChange(
                              "preferredFormat",
                              e.target.value
                            )
                          }
                          className="ghost-input w-full pr-8"
                        >
                          <option value="">Select an option</option>
                          <option value="online">Online</option>
                          <option value="in-person">In-person</option>
                          <option value="either">Either</option>
                        </select>

                        <span className="material-symbols-outlined pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 ui-muted">
                          expand_more
                        </span>
                      </div>
                    </div>

                  </div>
                </MotionItem>

                {/* Message */}
                <MotionItem>
                  <div className="group/field relative flex flex-col pt-2">
                    <label
                      htmlFor="message"
                      className="mb-2 text-headline-md ui-heading"
                    >
                      What would you like us to understand about you before we
                      meet?
                    </label>

                    <p className="mb-2 text-body-md ui-copy">
                      You don&apos;t need to explain everything. A few words are
                      enough. Perhaps{" "}
                      <em>&quot;I&apos;ve been feeling anxious for a while,&quot;</em>{" "}
                      or simply{" "}
                      <em>&quot;I think I need some help.&quot;</em>
                    </p>

                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={(e) =>
                        handleChange("message", e.target.value)
                      }
                      placeholder="Your message..."
                      className="ghost-input resize-none"
                    />
                  </div>
                </MotionItem>

                {/* Submit */}
                <MotionItem>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? "Sending..." : "Request a Session"}
                    </button>
                  </div>
                </MotionItem>

              </MotionStagger>
            </form>
          </MotionReveal>

          {/* Clinic card */}
          <div className="col-span-1 min-w-0 rounded-xl p-6 surface-sand sm:p-8 lg:col-span-5 lg:p-6">
            <MotionStagger className="min-w-0">

              <MotionItem>
                <h3 className="mb-3 text-headline-md ui-heading">
                  Visit
                </h3>
              </MotionItem>

              <MotionItem>
                <div className="grid min-w-0 grid-cols-1 items-stretch gap-8 md:grid-cols-1">

                  {/* Address + Contact */}
                  <div className="flex min-w-0 flex-col gap-6">

                    <div className="flex items-start gap-4">
                      <span className="material-symbols-outlined mt-1 ui-accent">
                        location_on
                      </span>

                      <div className="min-w-0 text-body-md ui-copy">
                        <p className="mb-2 font-bold ui-text">
                          Somani Health Clinic
                        </p>

                        <p>First Floor, Tropical Lagoon,</p>
                        <p>Anand Nagar, Kavesar, GB Road,</p>
                        <p>Thane (W) – 400615</p>
                        <p>Maharashtra, India</p>

                        <a
                          href="https://maps.google.com/?q=Somani+Health+Clinic,+First+Floor,+Tropical+Lagoon,+Anand+Nagar,+Kavesar,+GB+Road,+Thane+West+400615"
                          className="mt-2 inline-flex items-center gap-2 text-label-md ui-accent transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Get Directions</span>

                          <span className="material-symbols-outlined text-sm">
                            arrow_forward
                          </span>
                        </a>
                      </div>
                    </div>

                    <div className="border-t border-black/10 pt-3">
                      <p className="mb-2 font-bold ui-text">
                        ONLINE &amp; OFFLINE CONSULTATION AVAILABLE
                      </p>

                      <div className="space-y-3 text-body-md ui-copy">

                        <p>
                          <span className="font-bold ui-text">
                            Contact no:
                          </span>{" "}
                          <a
                            href="tel:+917304490951"
                            className="ui-accent"
                          >
                            +91 73044 90951
                          </a>
                        </p>

                        <p className="break-words">
                          <span className="font-bold ui-text">
                            Email:
                          </span>{" "}
                          <a
                            href="mailto:mindandsoulklinic@gmail.com"
                            className="ui-accent"
                          >
                            mindandsoulklinic@gmail.com
                          </a>
                        </p>

                      </div>
                    </div>

                  </div>

                  {/* Google Map */}
                  <div className="min-w-0">
                    <div className="min-h-[300px] overflow-hidden rounded-xl border border-white/60 bg-white/40">
                      <iframe
                        title="Somani Health Clinic location map"
                        src="https://maps.google.com/maps?q=Somani+Health+Clinic,+First+Floor,+Tropical+Lagoon,+Anand+Nagar,+Kavesar,+GB+Road,+Thane+West+400615&output=embed"
                        className="block h-[300px] w-full border-0 lg:h-[380px]"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>

                </div>
              </MotionItem>

            </MotionStagger>
          </div>

        </MotionSection>


        {/* ── Emergency Support ── */}
<MotionSection
  id="emergency-helplines"
  className="section-pad w-full py-section"
>
  <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-4 sm:px-6 md:gap-8 lg:px-8">

    {/* Heading */}
    <MotionReveal>
      <h2 className="mb-3 text-headline-lg ui-heading">
        Disclaimer &amp; Emergency Helplines
      </h2>
    </MotionReveal>

    {/* Description + Helplines */}
    <div className="min-w-0 space-y-6 break-words text-body-md leading-relaxed text-[#176c78]">

      <p>
        <strong>Important:</strong> The services offered through
        Adore Life are not suitable for crisis situations or mental
        health emergencies.
      </p>

      <p>
        If you are experiencing emotional distress or are in an
        emergency, please seek immediate support from a nearby mental
        health center or contact a professional helpline.
      </p>

      <p>
        Here are some trusted resources you can reach out to:
      </p>

      <ul className="space-y-6 pl-6 marker:text-[#00646a]">
        {emergencyHelplines.map((helpline) => (
          <li key={helpline.name} className="min-w-0 pl-1">

            <p className="font-medium">
              {helpline.name}
            </p>

            <p className="break-words">
              <span aria-hidden="true">📞 </span>

              {helpline.phones ? (
                helpline.phones.map((phone, index) => (
                  <span key={phone}>
                    {index > 0 ? " | " : ""}
                    <a
                      className="underline"
                      href={`tel:${phone.replace(/\s/g, "")}`}
                    >
                      {phone}
                    </a>
                  </span>
                ))
              ) : (
                <a
                  className="underline"
                  href={`tel:${helpline.phone?.replace(/\s/g, "")}`}
                >
                  {helpline.phone}
                </a>
              )}

              {" "}({helpline.hours})
            </p>

            {helpline.whatsapp && (
              <p>
                <span aria-hidden="true">💬 </span>
                <a
                  className="underline"
                  href={`https://wa.me/${helpline.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp (24/7)
                </a>
              </p>
            )}

            <p className="break-all sm:break-words">
              <span aria-hidden="true">🌐 </span>
              <a
                className="underline"
                href={helpline.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {helpline.website
                  .replace(/^https:\/\//, "")
                  .replace(/\/$/, "")}
              </a>
            </p>

          </li>
        ))}
      </ul>

      <p>
        Please take care of yourself and reach out for immediate help
        if needed. You are not alone, and support is available.
      </p>

    </div>
  </div>
</MotionSection>
      </main>

      {/* Watermark */}
      <div className="page-watermark" aria-hidden="true">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTaG1PgzOhgrkF3uAHlyXW1-I5bvkvk7MQIuwTj9leoJ1AL2Cf7EARRgK784WdoEoHRCsNmwVe6drb1Lt-1BjFChyVgUC2GvcMCuq8hohqdUGgZnxaiYtPXNK024rKWbV__I5KC-MtSTBzlkT3BdexnIcX7gK3N7Y_HUkRfeT5cpl7KNUiAG36xdNrImLdblbEk0G-PQuPet7s4TrTxek2S0gATyNt88GND5yktmzFzjzoqznz3-Vjv0EktiCpabIIig"
          alt=""
          width={1600}
          height={900}
        />
      </div>
    </>
  );
}
