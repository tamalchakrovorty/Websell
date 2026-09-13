import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function scheduleExpiryReminders(pool) {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  const target = date.toISOString().split('T')[0];
  setInterval(async () => {
    try {
      const { rows } = await pool.query("SELECT * FROM orders WHERE expires_at = $1 AND status != 'cancelled'", [target]);
      for (const order of rows) {
        if (!process.env.SENDGRID_API_KEY) continue;
        try {
          await sgMail.send({ to: order.contact_email, from: process.env.CLIENT_FROM_EMAIL || 'hello@agency.com', subject: 'Hosting renewal reminder', text: `Hi ${order.contact_name}, your hosting expires soon on ${order.expires_at}. Renew to keep your site live!` });
        } catch (e) { console.log('Reminder email skipped'); }
      }
    } catch (e) { console.log(e.message); }
  }, 60000);
}
