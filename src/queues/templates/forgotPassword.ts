export const forgotPassword = (data) => {
	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body style="background-color: #fff; font-family: Arial, sans-serif;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <tr>
            <td>
              <h1 style="color: #000; font-size: 24px; text-align: center; margin: 0;">
                Hello ${data.name}, reset your password.
              </h1>
              <p style="font-size: 14px; line-height: 24px; margin: 16px 0;">
                We received a request to reset your password. Please click the button below to choose a new password.
              </p>
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="text-align: center;">
                <tr>
                  <td>
                    <a href=${data.token}
                       target="_blank"
                       style="line-height: 100%; text-decoration: none; display: inline-block; padding: 12px 20px; background-color: #000; border-radius: 4px; color: #fff; font-size: 14px; font-weight: 600; text-align: center;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 14px; line-height: 24px; margin: 16px 0;">
                If you did not request a password reset, please ignore this email or contact support if you have questions.
              </p>
              <hr style="width: 100%; border: 1px solid #eaeaea; margin: 26px 0;" />
              <p style="font-size: 12px; line-height: 24px; margin: 16px 0; color: #666;">
                If you're having trouble clicking the password reset button, copy and paste the URL below into your web browser:
                <a href=${data.token} target="_blank" style="color: #2563eb; text-decoration: none;">
                  ${data.token}
                </a>
              </p>
              <p style="font-size: 12px; line-height: 24px; margin: 16px 0; color: #666;">
                This message was sent to ${data.name}. If you have questions or complaints, please contact us.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html> `;
};
