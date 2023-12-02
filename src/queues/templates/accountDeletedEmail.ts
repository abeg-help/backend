import { baseTemplate } from './baseTemplate';

export const accountDeletedEmailTemplate = (data) => {
	return baseTemplate(
		`<!DOCTYPE html>
<html>
<head>
    <title>Account Deletion</title>
</head>
<body>
    <p>Dear ${data.name},</p>

    <p>We have processed your request and successfully deleted your account. If this was a mistake or if you change your mind, you have ${data.days} to restore your account.</p>

    <p>To restore your account, please click the button below:</p>

    <a href="${data.restoreLink}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block;">Restore My Account</a>

    <p>If you did not request this deletion, please contact our support team immediately at donotreply@abeghelp.me.</p>

    <p>Best regards,<br>Abeghelp</p>
</body>
</html>`
	);
};
