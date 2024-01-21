export const welcomeEmail = (data) => {
	return;
	`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
		<html dir="ltr" lang="en">
		
		  <head>
		  	<meta charset="UTF-8" />
		  	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		  	<title>Email Template</title>
		  	<style>
				@font-face {
				font-family: 'Manrope';
			  	font-style: normal;
			  	font-weight: 400;
			  	mso-font-alt: 'sans-serif';
			  	src: url(https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggexSg.woff2)
				format('woff2');
			}
	  
			* {
			  	font-family: 'Manrope', sans-serif;
			  }
		  	</style>
	  
		  </head>
		  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0"><div></div>
		
		  <body style="background-color:rgb(255,255,255);margin-top:auto;margin-bottom:auto;margin-left:auto;margin-right:auto;font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">
			<table align="center" width="100%" class=" " border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin-left:auto;margin-right:auto;padding:20px">
			  <tbody>
				<tr style="width:100%">
				  <td>
					<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="display:flex;justify-content:center;align-items:center;margin-top:1rem;margin-left:195px">
					  <tbody style="width:100%">
						<tr style="width:100%">
						  <td data-id="__react-email-column"><img alt="Logo" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704816639/abeghelp%20assets/abeg_logo_nfbolw.png" class="" style="align-items:center;outline:2px solid transparent;outline-offset:2px;border-style:none;text-decoration-line:none;height:33px;margin-right:0.5rem" /></td>
						  <td data-id="__react-email-column">
							<p style="font-size:24px;line-height:24px;margin:16px 0;color:rgb(0,128,128);font-weight:700;text-align:center;margin-top:0.75rem">AbegHelp.me</p>
						  </td>
						</tr>
					  </tbody>
					</table>
					<h1 style="color:rgb(72,72,72);font-size:24px;font-weight:600;text-align:center;padding:0px;margin-top:30px;margin-bottom:30px;margin-left:0px;margin-right:0px">You are almost there!🎉</h1>
					<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-left:auto;margin-right:auto;display:flex;align-items:center;justify-content:center;margin-bottom:0.5rem">
					  <tbody>
						<tr>
						  <td><img src="https://res.cloudinary.com/dbpybyx2l/image/upload/v1704887801/3d_cartoon_style_paper_with_green_tick_in_envelope_icon_1_zxvpqk.png" alt="envelope" class="" style="align-items:center;outline:2px solid transparent;outline-offset:2px;border-style:none;text-decoration-line:none;height:258px" /></td>
						</tr>
					  </tbody>
					</table>
					<p class="line-height-[32.78px]" style="font-size:24px;line-height:24px;margin:16px 0;color:rgb(72,72,72);font-weight:600;text-align:center;padding:0px;margin-top:35px;margin-bottom:35px;margin-left:0px;margin-right:0px">Verify your email</p>
					<p style="font-size:20px;line-height:24px;margin:16px 0;color:rgb(72,72,72);font-weight:600;text-align:center;padding:0px;margin-top:3.5rem;margin-bottom:30px;margin-left:0px;margin-right:0px">${data.name},</p>
					<p style="font-size:20px;line-height:24px;margin:16px 0;color:rgb(0,0,0);font-weight:400;text-align:center">Thank you for choosing AbegHelp.me. To complete your<br /> registration and secure your account, please use the email<br /> verification link below;</p>
					<table align="center" width="100%" class="" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center;margin-top:4rem;margin-bottom:3.5rem">
					  <tbody>
						<tr>
						  <td><a href=${data.verificationLink} style="background-color:rgb(0,128,128);color:rgb(255,255,255);font-size:16px;font-weight:700;text-align:center;padding-top:0.75rem;padding-bottom:0.75rem;padding-left:5rem;padding-right:5rem;border-radius:7px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 80px 12px 80px" target="_blank"><span><!--[if mso]><i style="letter-spacing: 80px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Verify your email</span><span><!--[if mso]><i style="letter-spacing: 80px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
						</tr>
					  </tbody>
					</table>
					<p style="font-size:16px;line-height:24px;margin:16px 0;color:rgb(72,72,72);font-weight:400;text-align:center;margin-top:1.5rem;margin-bottom:4rem">If you did not initiate this action, kindly disregard this email.</p>
					<table align="center" width="100%" class="" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="display:flex;justify-content:center;align-items:center;margin-left:195px">
					  <tbody style="width:100%">
						<tr style="width:100%">
						  <td data-id="__react-email-column"><img alt="Logo" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811240/abeghelp%20assets/fb_icon_ysucrx.png" style="display:block;outline:2px solid transparent;outline-offset:2px;border-style:none;text-decoration-line:none;width:30px;height:30px;margin-right:1.5rem" /></td>
						  <td data-id="__react-email-column"><img alt="Logo" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811240/abeghelp%20assets/tw_icon_m3kszi.png" style="display:block;outline:2px solid transparent;outline-offset:2px;border-style:none;text-decoration-line:none;width:30px;height:30px;margin-right:1.5rem" /></td>
						  <td data-id="__react-email-column"><img alt="Logo" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811240/abeghelp%20assets/insta_icn_r1nqj2.png" style="display:block;outline:2px solid transparent;outline-offset:2px;border-style:none;text-decoration-line:none;width:30px;height:30px;margin-right:1.5rem" /></td>
						  <td data-id="__react-email-column"><img alt="Logo" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811241/abeghelp%20assets/linkdin_icn_wpfzka.png" style="display:block;outline:2px solid transparent;outline-offset:2px;border-style:none;text-decoration-line:none;width:30px;height:30px;margin-right:1.5rem" /></td>
						</tr>
					  </tbody>
					</table>
					<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="display:flex;justify-content:center;align-items:center;margin-top:1rem;margin-left:235px">
					  <tbody style="width:100%">
						<tr style="width:100%">
						  <td data-id="__react-email-column"><img alt="Logo" src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704816639/abeghelp%20assets/abeg_logo_nfbolw.png" style="outline:2px solid transparent;outline-offset:2px;border-style:none;text-decoration-line:none;height:20px;margin-right:0.5rem" /></td>
						  <td data-id="__react-email-column">
							<p style="font-size:14px;line-height:24px;margin:0px;color:rgb(0,128,128);font-weight:700;text-align:center">AbegHelp.me</p>
						  </td>
						</tr>
					  </tbody>
					</table>
					<p class="mt-" style="font-size:16px;line-height:24px;margin:16px 0;color:rgb(72,72,72);font-weight:400;text-align:center">Your journey into fundraising with ease</p>
				  </td>
				</tr>
			  </tbody>
			</table>
		  </body>
		
		</html>`;
};
