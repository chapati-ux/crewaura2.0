import resend from "../config/resend.js";

export const sendEmail = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      eventType,
      preferredDate,
      guestCount,
      budgetRange,
      venuePreference,
      message,
    } = req.body;

    // Validation — only the fields that are required on the form
    if (!name || !email || !eventType) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and event type are required.",
      });
    }

    // Helper to render a row only if the value was actually provided
    const row = (label, value) =>
      value ? `<p><strong>${label}:</strong> ${value}</p>` : "";

    const adminHtml = `
      <h2>New Contact Form Submission</h2>
      ${row("Name", name)}
      ${row("Email", email)}
      ${row("Phone", phone)}
      ${row("Event Type", eventType)}
      ${row("Preferred Date", preferredDate)}
      ${row("Expected Guests", guestCount)}
      ${row("Budget Range", budgetRange)}
      ${row("Venue Preference", venuePreference)}
      <hr>
      <p><strong>Additional Details:</strong></p>
      <p>${message ? message.replace(/\n/g, "<br>") : "—"}</p>
    `;

    const clientHtml = `
      <h2>Hello ${name},</h2>
      <p>Thank you for reaching out to us.</p>
      <p>We've received your inquiry regarding your <strong>${eventType}</strong>${
        preferredDate ? ` on <strong>${preferredDate}</strong>` : ""
      }.</p>
      <p>Our team will review the details and get back to you within 24 hours.</p>
      <br>
      <p>Best Regards,</p>
      <h3>Crew Aura</h3>
    `;

    // Send both emails
    await Promise.all([
      resend.emails.send({
        from: "Website Contact Form <onboarding@resend.dev>", // see note below
        to: process.env.ADMIN_EMAIL,
        replyTo: email,
        subject: `New Inquiry: ${eventType}${preferredDate ? ` — ${preferredDate}` : ""}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: "Crew Aura <onboarding@resend.dev>",
        to: email,
        subject: "We've received your message",
        html: clientHtml,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};






