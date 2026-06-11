export function generateEmailTemplate(
  orderId: string,
  productName: string,
  price: number,
  actionUrl: string,
  type: 'invoice' | 'receipt'
) {
  const isInvoice = type === 'invoice';
  const title = isInvoice ? 'Menunggu Pembayaran' : 'Pembayaran Berhasil!';
  const message = isInvoice 
    ? 'Pesanan Anda telah kami terima. Silakan selesaikan pembayaran untuk mendapatkan akses ke source code.'
    : 'Terima kasih! Pembayaran Anda telah kami verifikasi. Anda sekarang dapat mengunduh source code pesanan Anda.';
  const buttonText = isInvoice ? 'Selesaikan Pembayaran' : 'Download Source Code';
  const buttonColor = isInvoice ? '#1c1a17' : '#10b981'; // Black for pay, Green for download

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfbf9; margin: 0; padding: 40px 0; color: #1c1a17;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.04); overflow: hidden; border: 1px solid #eae8e3;">
      
      <!-- Header -->
      <tr>
        <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #eae8e3;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Premium Scripts</h1>
          <p style="margin: 10px 0 0; color: #78736a; font-size: 15px;">${title}</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding: 40px;">
          <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a453d;">
            Halo,<br><br>
            ${message}
          </p>

          <!-- Order Details Card -->
          <div style="background-color: #fcfbf9; border: 1px solid #eae8e3; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <p style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #959086;">Detail Pesanan #${orderId.substring(0, 8)}</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom: 10px; font-size: 16px; font-weight: 500;">${productName}</td>
                <td style="padding-bottom: 10px; font-size: 16px; font-weight: 600; text-align: right;">Rp ${price.toLocaleString('id-ID')}</td>
              </tr>
            </table>
          </div>

          <!-- Action Button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <a href="${actionUrl}" style="display: inline-block; background-color: ${buttonColor}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 500; font-size: 16px; letter-spacing: 0.5px; text-align: center;">
                  ${buttonText}
                </a>
              </td>
            </tr>
          </table>

          ${!isInvoice ? `
          <p style="margin: 30px 0 0; font-size: 13px; color: #959086; text-align: center;">
            Penting: Link download di atas adalah link 1x pakai (one-time link) yang di-generate khusus untuk Anda. Mohon jangan bagikan link ini kepada siapa pun.
          </p>
          ` : ''}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 24px 40px; background-color: #fcfbf9; text-align: center; border-top: 1px solid #eae8e3;">
          <p style="margin: 0; font-size: 13px; color: #959086;">
            &copy; ${new Date().getFullYear()} Premium Code Scripts. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
