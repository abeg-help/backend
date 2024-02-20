export const recoveryKeysEmail = (data) => {
	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html dir="ltr" lang="en">
			<head>
				<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
			</head>
			<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
				Verify your Account
			</div>
			<body>
				<table
					align="center"
					width="100%"
					class=""
					border="0"
					cellpadding="0"
					cellspacing="0"
					role="presentation"
					style="max-width:24rem;width:100%;color:rgb(72,72,72);margin-left:auto;margin-right:auto"
				>
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
								<table
									align="center"
									width="100%"
									class=""
									border="0"
									cellpadding="0"
									cellspacing="0"
									role="presentation"
									style="width:100%;max-width:100px;margin-left:auto;margin-right:auto"
								>
									<tbody>
										<tr>
											<td>
												<table
													align="center"
													width="100%"
													border="0"
													cellpadding="0"
													cellspacing="0"
													role="presentation"
												>
													<tbody style="width:100%">
														<tr style="width:100%">
															<td data-id="__react-email-column">
																<img
																	alt="Abeg Help Logo"
																	height="30"
																	src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704816639/abeghelp%20assets/abeg_logo_nfbolw.png"
																	style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem"
																	width="30"
																/>
															</td>
															<td data-id="__react-email-column">
																<p
																	style="font-size:1.125rem;line-height:1.75rem;margin:16px 0;font-weight:700;color:rgb(43,144,142)"
																>
																	AbegHelp.me
																</p>
															</td>
														</tr>
													</tbody>
												</table>
											</td>
										</tr>
									</tbody>
								</table>
								<h1
									style="font-size:1.25rem;line-height:1.75rem;letter-spacing:0.025em;font-weight:700;text-align:center"
								>
									Verification Code
								</h1>
								<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
									<tbody>
										<tr>
											<td>
												<img
													alt="Abeg help Illustration"
													src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811249/abeghelp%20assets/6538623_1_rqlcxj.png"
													style="display:block;outline:none;border:none;text-decoration:none;max-width:24rem;height:13rem;width:100%;object-fit:cover"
												/>
											</td>
										</tr>
									</tbody>
								</table>
								<p style="font-size:1.25rem;line-height:1.75rem;margin:16px 0;text-align:center">Hi, ${data.name}</p>
								<p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center">
									This is the recovery code to your 2FA
								</p>
								<table
									align="center"
									width="100%"
									border="0"
									cellpadding="0"
									cellspacing="0"
									role="presentation"
									style="color:rgb(43,144,142);border-width:2px;border-style:dashed;border-color:rgb(43,144,142);text-align:center;letter-spacing:.5rem;width:100%;margin-left:auto;margin-right:auto;max-width:200px"
								>
							 <tbody>
										<tr>
											<td>
												<p style="font-size:1.125rem;line-height:1.75rem;margin:0.25rem;text-align:center">
													${data.recoveryCode}
												</p>
											</td>
										</tr>
									</tbody>
								</table>
								<p style="font-size:0.875rem;line-height:1.25rem;margin:16px 0;text-align:center">
									If you did not initiate this transaction, kindly disregard this email.
								</p>
								<table
									align="center"
									width="100%"
									class=""
									border="0"
									cellpadding="0"
									cellspacing="0"
									role="presentation"
									style="width:100%;max-width:100px;margin-left:auto;margin-right:auto"
								>
									<tbody>
										<tr>
											<td>
												<table
													align="center"
													width="100%"
													border="0"
													cellpadding="0"
													cellspacing="0"
													role="presentation"
												>
													<tbody style="width:100%">
														<tr style="width:100%">
															<td data-id="__react-email-column">
																<img
																	alt="Abeg Help Logo"
																	height="20"
																	src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811240/abeghelp%20assets/fb_icon_ysucrx.png"
																	style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem"
																	width="20"
																/>
															</td>
															<td data-id="__react-email-column">
																<img
																	alt="Abeg Help Logo"
																	height="20"
																	src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811241/abeghelp%20assets/linkdin_icn_wpfzka.png"
																	style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem"
																	width="20"
																/>
															</td>
															<td data-id="__react-email-column">
																<img
																	alt="Abeg Help Logo"
																	height="20"
																	src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811240/abeghelp%20assets/tw_icon_m3kszi.png"
																	style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem"
																	width="20"
																/>
															</td>
															<td data-id="__react-email-column">
																<img
																	alt="Abeg Help Logo"
																	height="20"
																	src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704811240/abeghelp%20assets/insta_icn_r1nqj2.png"
																	style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem"
																	width="20"
																/>
															</td>
														</tr>
													</tbody>
												</table>
											</td>
										</tr>
									</tbody>
								</table>
								<table
									align="center"
									width="100%"
									class=""
									border="0"
									cellpadding="0"
									cellspacing="0"
									role="presentation"
									style="width:100%;max-width:100px;margin-left:auto;margin-right:auto"
								>
									<tbody>
										<tr>
											<td>
												<table
													align="center"
													width="100%"
													border="0"
													cellpadding="0"
													cellspacing="0"
													role="presentation"
												>
													<tbody style="width:100%">
														<tr style="width:100%">
															<td data-id="__react-email-column">
																<img
																	alt="Abeg Help Logo"
																	height="15"
																	src="https://res.cloudinary.com/dsg6otcag/image/upload/v1704816639/abeghelp%20assets/abeg_logo_nfbolw.png"
																	style="display:block;outline:none;border:none;text-decoration:none;margin-right:0.5rem"
																	width="15"
																/>
															</td>
															<td data-id="__react-email-column">
																<p
																	style="font-size:0.75rem;line-height:1rem;margin:16px 0;font-weight:700;color:rgb(43,144,142)"
																>
																	AbegHelp.me
																</p>
															</td>
														</tr>
													</tbody>
												</table>
											</td>
										</tr>
									</tbody>
								</table>
								<p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center">
									Your journey into fundraising with ease
								</p>
							</td>
						</tr>
					</tbody>
				</table>
			</body>
		</html> `;
};
