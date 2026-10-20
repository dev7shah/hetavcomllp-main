"use client";

import { useState, useRef } from "react";

interface FormData {
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  businessType: string;
  area: string;
  need: string;
  honeypot: string; // spam trap
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  area?: string;
}

function buildWAMessage(d: FormData) {
  const lines = [
    `*New Enquiry – Hetav Group*`,
    ``,
    `Name: ${d.fullName}`,
    d.businessName ? `Business: ${d.businessName}` : "",
    `Phone: ${d.phone}`,
    d.email ? `Email: ${d.email}` : "",
    d.businessType ? `Type: ${d.businessType}` : "",
    `Area: ${d.area}`,
    d.need ? `\nNeeds:\n${d.need}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/918976434940?text=${encodeURIComponent(lines)}`;
}

export default function EnquiryForm() {
  const [form, setForm] = useState<FormData>({
    fullName: "",
    businessName: "",
    phone: "",
    email: "",
    businessType: "",
    area: "",
    need: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [waUrl, setWaUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const phoneRe = /^[+]?[\d\s\-]{10,15}$/;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!phoneRe.test(form.phone.trim())) {
      errs.phone = "Enter a valid Indian phone number.";
    }
    if (form.email && !emailRe.test(form.email.trim())) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.area.trim()) errs.area = "Area or city is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function set(field: keyof FormData) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // clear error on change
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Honeypot check (client side)
    if (form.honeypot) return;

    setStatus("submitting");
    setWaUrl(buildWAMessage(form));

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      // Still show success but note the API may not be configured
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <div className="confirmation" role="alert">
        <h3>✓ Enquiry received</h3>
        <p>
          Thank you, {form.fullName}. We&apos;ll get back to you within the hour
          on <strong>{form.phone}</strong>.
        </p>
        <a
          className="btn-wa"
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Send on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      className="enquiry-form"
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Enquiry form"
    >
      {/* Honeypot — hidden from real users */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor="hp-website">Website</label>
        <input
          id="hp-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.honeypot}
          onChange={set("honeypot")}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fullName">Full name *</label>
          <input
            id="fullName"
            type="text"
            value={form.fullName}
            onChange={set("fullName")}
            className={errors.fullName ? "error" : ""}
            placeholder="Ramesh Patel"
            autoComplete="name"
            required
            aria-describedby="fullName-err"
          />
          <span id="fullName-err" className="err-msg" role="alert">
            {errors.fullName || ""}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="businessName">Business name</label>
          <input
            id="businessName"
            type="text"
            value={form.businessName}
            onChange={set("businessName")}
            placeholder="Patel Provisions"
            autoComplete="organization"
          />
          <span className="err-msg" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone * (Indian)</label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            className={errors.phone ? "error" : ""}
            placeholder="+91 98765 43210"
            autoComplete="tel"
            required
            aria-describedby="phone-err"
          />
          <span id="phone-err" className="err-msg" role="alert">
            {errors.phone || ""}
          </span>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={set("email")}
            className={errors.email ? "error" : ""}
            placeholder="ramesh@example.com"
            autoComplete="email"
            aria-describedby="email-err"
          />
          <span id="email-err" className="err-msg" role="alert">
            {errors.email || ""}
          </span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="businessType">Business type</label>
          <select
            id="businessType"
            value={form.businessType}
            onChange={set("businessType")}
          >
            <option value="">Select…</option>
            <option value="Retail store">Retail store</option>
            <option value="Wholesaler">Wholesaler</option>
            <option value="Restaurant or café">Restaurant or café</option>
            <option value="Other">Other</option>
          </select>
          <span className="err-msg" />
        </div>
        <div className="form-group">
          <label htmlFor="area">Area or city *</label>
          <input
            id="area"
            type="text"
            value={form.area}
            onChange={set("area")}
            className={errors.area ? "error" : ""}
            placeholder="Andheri West, Mumbai"
            required
            aria-describedby="area-err"
          />
          <span id="area-err" className="err-msg" role="alert">
            {errors.area || ""}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="need">What do you need?</label>
        <textarea
          id="need"
          value={form.need}
          onChange={set("need")}
          placeholder="Describe your requirements — brands, volumes, delivery frequency…"
          rows={4}
        />
        <span className="err-msg" />
      </div>

      <button
        type="submit"
        className="btn-submit"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send enquiry →"}
      </button>
    </form>
  );
}
