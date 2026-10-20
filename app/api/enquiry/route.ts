import { NextRequest, NextResponse } from "next/server";

/* ── Simple in-memory rate limiter (per IP, per hour) ─── */
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5;
const store = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_PER_WINDOW) return true;
  entry.count++;
  return false;
}

const phoneRe = /^[+]?[\d\s\-]{10,15}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  /* IP for rate limiting */
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  /* Honeypot check */
  if (body.honeypot) {
    // Silently accept to confuse bots
    return NextResponse.json({ ok: true });
  }

  /* Validation */
  const { fullName, phone, email, area } = body;
  if (!fullName?.trim()) {
    return NextResponse.json({ error: "Full name is required." }, { status: 422 });
  }
  if (!phone?.trim() || !phoneRe.test(phone.trim())) {
    return NextResponse.json({ error: "Valid phone required." }, { status: 422 });
  }
  if (email && !emailRe.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email." }, { status: 422 });
  }
  if (!area?.trim()) {
    return NextResponse.json({ error: "Area is required." }, { status: 422 });
  }

  /* Build email body */
  const text = `
New Enquiry – Hetav Group Website
===================================
Name:          ${fullName}
Business:      ${body.businessName || "—"}
Phone:         ${phone}
Email:         ${email || "—"}
Business type: ${body.businessType || "—"}
Area / city:   ${area}

What they need:
${body.need || "Not specified"}

---
Submitted at ${new Date().toISOString()} from IP ${ip}
  `.trim();

  /* Send via Resend if API key is set */
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (RESEND_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_KEY);
      await resend.emails.send({
        from: "noreply@hetavgroup.com",
        to: "hetavgroup@gmail.com",
        replyTo: email || undefined,
        subject: `New enquiry from ${fullName} – Hetav Group`,
        text,
      });
    } catch (err) {
      console.error("Resend error:", err);
      // Don't fail the request — WhatsApp fallback still works
    }
  } else {
    // Log to console in dev
    console.log("[Enquiry]\n" + text);
  }

  return NextResponse.json({ ok: true });
}
