import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Validazione
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Tutti i campi sono obbligatori' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Configurazione SMTP Brevo
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(import.meta.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
    });

    // Mappa soggetti
    const subjectLabels: Record<string, string> = {
      'info-eventi': 'Informazioni eventi',
      'biglietti': 'Biglietti e rimborsi',
      'collaborazioni': 'Collaborazioni e sponsorship',
      'stampa': 'Stampa e media',
      'altro': 'Altro'
    };

    // Email da inviare
    const mailOptions = {
      from: `"Live Arena Website" <${import.meta.env.SMTP_USER}>`,
      to: import.meta.env.CONTACT_EMAIL || import.meta.env.SMTP_USER,
      replyTo: email,
      subject: `[Live Arena] ${subjectLabels[subject] || subject} - da ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a0a0a; padding: 20px; text-align: center;">
            <h1 style="color: #DC2626; margin: 0;">LIVE ARENA</h1>
          </div>
          <div style="padding: 30px; background: #f5f5f5;">
            <h2 style="color: #333; margin-top: 0;">Nuovo messaggio dal sito</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Nome:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Oggetto:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${subjectLabels[subject] || subject}</td>
              </tr>
            </table>
            <div style="margin-top: 20px;">
              <strong>Messaggio:</strong>
              <p style="background: white; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="background: #333; padding: 15px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">Messaggio inviato dal form di contatto di livearena.it</p>
          </div>
        </div>
      `,
      text: `
Nuovo messaggio dal sito Live Arena

Nome: ${name}
Email: ${email}
Oggetto: ${subjectLabels[subject] || subject}

Messaggio:
${message}
      `
    };

    // Invia email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Errore invio email:', error);
    return new Response(JSON.stringify({ error: 'Errore durante l\'invio del messaggio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
