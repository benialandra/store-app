import nodemailer from 'nodemailer';
import { generateEmailTemplate } from './emailTemplate';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // e.g. you@gmail.com
    pass: process.env.EMAIL_PASS  // Gmail App Password
  }
});

export async function sendEmail(
  to: string, 
  orderId: string, 
  productName: string, 
  price: number, 
  actionUrl: string, 
  type: 'invoice' | 'receipt'
) {
  const html = generateEmailTemplate(orderId, productName, price, actionUrl, type);
  
  const mailOptions = {
    from: `"DevStore Premium" <${process.env.EMAIL_USER}>`,
    to,
    subject: type === 'invoice' ? 'Menunggu Pembayaran - DevStore' : 'Pembayaran Berhasil! - DevStore',
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
