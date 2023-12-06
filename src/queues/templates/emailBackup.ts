import { baseTemplate } from './baseTemplate';

export const emailBackupOTP = (data) => {
	return baseTemplate(
		`<h1>Hello, ${data.name}!</h1>
			<p>
				This is your OTP for 2FA
			</p>
			<table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td align="center">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td align="center">
									<table border="0" cellspacing="0" cellpadding="0">
										<tr>
											<td>
												<h1>${data.token}</h1>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
			<p>
				If you have any questions, feel free to <a href="mailto:{{support_email}}">email our customer success team</a>.
				<!-- (We're lightning quick at replying.) We also offer <a href="{{live_chat_url}}">live chat</a> during business
				hours. -->
			</p>
			<p>Thanks, <br />Abeghelp support Team</p>
			<p>
				<strong>P.S.</strong> Need immediate help getting started? Check out our
				<a href="{{help_url}}">Onboarding guide</a>.
			</p>
			</table> `
	);
};
