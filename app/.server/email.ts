import { json } from '@remix-run/node';
import React from 'react';
import { Resend } from 'resend';

interface Email {
  from: 'Notely <no-reply@notely.ca>';
  to: string[];
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail({ from, to, subject, react }: Email) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await resend.emails.send({
      from,
      to,
      subject,
      react,
    });

    return json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ message: 'An error occured' }, { status: 500 });
  }
}
