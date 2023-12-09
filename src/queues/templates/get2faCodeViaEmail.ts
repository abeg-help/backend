import { baseTemplate } from './baseTemplate';

export const get2faCodeViaEmailTemplate = (data) => {
	return baseTemplate(`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body style="background-color: #fff; font-family: Arial, sans-serif;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <tr>
        <td>
          <h1 style="color: #000; font-size: 24px; text-align: center; margin: 0;">
            2FA Code Notification
          </h1>
          <p style="font-size: 14px; line-height: 24px; margin: 16px 0;">
            Hello ${data.name}, here is your 2FA code:
          </p>
          <h2 style="color: #4CAF50; font-size: 32px; text-align: center; margin: 0;">
            ${data.twoFactorCode}
          </h2>
          <p style="font-size: 14px; line-height: 24px; margin: 16px 0;">
            This code will expire in ${data.expiryTime} minutes. Use it to complete your authentication.
          </p>
          <p style="font-size: 14px; line-height: 24px; margin: 16px 0;">
            If you didn't request this code, please contact support immediately.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`);
};
