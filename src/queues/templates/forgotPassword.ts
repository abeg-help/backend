export const forgotPassword = (data) => {
	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <title>AbegHelp - Forgot your Password!</title>
  </head>

  <body>
    <table align="center" width="100%" class="" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:24rem;width:100%;color:rgb(72,72,72);margin-left:auto;margin-right:auto">
      <tbody>
        <tr style="width:100%">
          <td>
            <style>
              @font-face {
                font-family: 'Manrope';
                font-style: normal;
                font-weight: 400;
                mso-font-alt: 'sans-serif';
                src: url(https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggexSg.woff2) format('woff2');
              }

              * {
                font-family: 'Manrope', sans-serif;
              }
            </style>
            <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">AbegHelp - Forgot your Password!</div>
          
                  </td>
                </tr>
              </tbody>
            </table>
            <h1 style="font-size:1.25rem;line-height:1.75rem;letter-spacing:0.025em;font-weight:700;text-align:center">AbegHelp - Forgot your password!</h1>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td>
                    <p class="" style="font-size:1.25rem;line-height:1.75rem;margin:16px 0">Hi, ${data.name}</p>
                    <p style="font-size:14px;line-height:24px;margin:16px 0">Seems you forgot your password, no worries. Click the button below to create a new password.<br /></p><a style="color:rgb(255,255,255);text-decoration:none;background-color:rgb(43,144,142);padding-left:1.75rem;padding-right:1.75rem;padding-top:0.5rem;padding-bottom:0.5rem;margin-top:0.75rem;margin-bottom:0.75rem;border-radius:0.375rem;text-align:center;margin-left:auto;margin-right:auto;cursor:pointer" target="_blank" href=${data.token}>Create new Password</a>
                    <p style="font-size:14px;line-height:24px;margin:16px 0">If you&#x27;re having trouble clicking the password reset button, copy and paste the URL below into your web browser:<a href="" style="color:rgb(43,144,142);text-decoration:none;text-decoration-line:underline" target="_blank" href=${data.token}>${data.token}</a></p>
                    <p style="font-size:14px;line-height:24px;margin:16px 0">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:14px;line-height:24px;margin:16px 0">Best Regards,<br />The team</p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" class="" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:100%;max-width:100px;margin-left:auto;margin-right:auto">
              <tbody>
                <tr>
                  <td>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column"><img alt="Abeg Help Logo" height="20" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811240/abeghelp%20assets/fb_icon_ysucrx.png" style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem" width="20" /></td>
                          <td data-id="__react-email-column"><img alt="Abeg Help Logo" height="20" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811241/abeghelp%20assets/linkdin_icn_wpfzka.png" style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem" width="20" /></td>
                          <td data-id="__react-email-column"><img alt="Abeg Help Logo" height="20" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811240/abeghelp%20assets/tw_icon_m3kszi.png" style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem" width="20" /></td>
                          <td data-id="__react-email-column"><img alt="Abeg Help Logo" height="20" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811240/abeghelp%20assets/insta_icn_r1nqj2.png" style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem" width="20" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" class="" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:100%;max-width:100px;margin-left:auto;margin-right:auto">
              <tbody>
                <tr>
                  <td>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column"><img alt="Abeg Help Logo" height="15" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704816639/abeghelp%20assets/abeg_logo_nfbolw.png" style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem" width="15" /></td>
                          <td data-id="__react-email-column">
                            <p style="font-size:0.75rem;line-height:1rem;margin:16px 0;font-weight:700;color:rgb(43,144,142)">AbegHelp.me</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center">Your journey into fundraising with ease</p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>`;
};
