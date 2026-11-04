import sql from '@/app/api/utils/sql';
import { sendEmail } from '@/app/api/utils/send-email.js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      full_name,
      name,
      phone,
      email,
      booking_date,
      date,
      preferred_time,
      adults,
      guests,
      kids,
      additional_notes,
      message: _message,
      yacht_id,
      yacht_name,
      num_people,
      hours,
      occasion,
    } = body;

    // Support both old (name) and new (full_name) formats
    const resolvedName = full_name || name;
    const resolvedDate = booking_date || date || null;
    const resolvedAdults = parseInt(adults ?? guests ?? num_people ?? '0') || null;
    const resolvedOccasion = occasion ?? null;
    const resolvedHours = hours ?? null;
    const resolvedNumPeople = num_people ? parseInt(num_people) : null;

    if (!resolvedName || !phone) {
      return Response.json({ error: 'Full name and phone are required' }, { status: 400 });
    }

    // Fetch notification email and WhatsApp from site config
    const configRows =
      await sql`SELECT key, value FROM site_config WHERE key IN ('notification_email', 'whatsapp_number')`;
    const config: Record<string, string> = {};
    for (const row of configRows) config[row.key] = row.value;
    const notificationEmail = config['notification_email'] || 'Goayachtworld@gmail.com';

    // Save to DB
    await sql`
      INSERT INTO inquiries (name, phone, email, date, guests, occasion, yacht_id, message, preferred_time, adults, kids, additional_notes, hours, num_people)
      VALUES (
        ${resolvedName}, ${phone}, ${email ?? null},
        ${resolvedDate ?? null}, ${resolvedAdults || null},
        ${resolvedOccasion ?? yacht_name ?? null}, ${yacht_id ?? null},
        ${additional_notes ?? null}, ${preferred_time ?? null},
        ${resolvedAdults || null}, ${kids || 0},
        ${additional_notes ?? null}, ${resolvedHours}, ${resolvedNumPeople}
      )
    `;

    // Send email notification
    const yachtLabel = yacht_name ? `for <strong>${yacht_name}</strong>` : '';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A3C35; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Goaboatworld — New Inquiry</h1>
        </div>
        <div style="padding: 32px; background: #f9f9f9; border: 1px solid #e5e5e5;">
          <p style="color: #333; font-size: 16px;">You have received a new booking inquiry ${yachtLabel}.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888; width: 40%;">Name</td><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${resolvedName}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">Phone / WhatsApp</td><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${phone}</td></tr>
            ${email ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">Email</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td></tr>` : ''}
            ${yacht_name ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">Yacht</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${yacht_name}</td></tr>` : ''}
            ${resolvedOccasion ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">Package</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${resolvedOccasion}</td></tr>` : ''}
            ${resolvedDate ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">Date</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${resolvedDate}</td></tr>` : ''}
            ${preferred_time ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">Preferred Time</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${preferred_time}</td></tr>` : ''}
            ${resolvedHours ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">Hours Requested</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${resolvedHours} hour(s)</td></tr>` : ''}
            ${resolvedNumPeople ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">No. of People</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${resolvedNumPeople}</td></tr>` : ''}
            ${resolvedAdults ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">Adults</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${resolvedAdults}</td></tr>` : ''}
            ${kids ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">Kids</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${kids}</td></tr>` : ''}
            ${additional_notes ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #888;">Notes</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${additional_notes}</td></tr>` : ''}
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #3D9B7D20; border-left: 4px solid #3D9B7D; border-radius: 4px;">
            <p style="margin: 0; color: #1A3C35; font-weight: bold;">Reply to this customer promptly on WhatsApp: <a href="https://wa.me/${phone.replace(/\D/g, '')}" style="color: #3D9B7D;">${phone}</a></p>
          </div>
        </div>
        <div style="padding: 16px; text-align: center; color: #aaa; font-size: 12px;">Goaboatworld — Private Yacht Experiences in Goa</div>
      </div>
    `;

    try {
      await sendEmail({
        to: notificationEmail,
        from: 'onboarding@resend.dev',
        subject: `New Yacht Inquiry${yacht_name ? ` — ${yacht_name}` : ''} from ${resolvedName}`,
        html,
        text: `New inquiry from ${resolvedName} (${phone})${yacht_name ? ` for ${yacht_name}` : ''}. Date: ${resolvedDate ?? 'TBD'}. Adults: ${resolvedAdults ?? 0}, Kids: ${kids ?? 0}.`,
      });
    } catch (emailErr) {
      // Don't fail the whole request if email fails
      console.error('Email notification failed:', emailErr);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM inquiries WHERE is_deleted = false ORDER BY created_at DESC LIMIT 100`;
    return Response.json(rows);
  } catch (e) {
    console.error(e);
    return Response.json([], { status: 500 });
  }
}
