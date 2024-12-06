import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json(); // Parse the incoming request body
    const { name, message } = body;

    // Validate input
    if (!name || !message) {
      return new Response(
        JSON.stringify({ error: 'Name and message are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'sedrick.johnston86@ethereal.email',
          pass: 'wHuT9sqQKqx5DVyt5T'
      }
  });

    // Email options
    const mailOptions = {
      from: 'sedrick.johnston86@ethereal.email',
      to: 'muradnihad00@gmail.com',
      subject: 'Contact Form Submission',
      text: `Name: ${name}\nMessage: ${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: 'Message sent successfully!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send message.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
