import { ENVIRONMENT } from '@/common/config';
import { EmailJobData } from '@/common/interfaces/emailQueue';
import { logger } from '@/common/utils';
import { Resend } from 'resend';
import { passwordResetComplete, welcomeEmail } from '../templates';
import { passwordResetRequest } from '../templates/passwordResetRequest';

const resend = new Resend(ENVIRONMENT.EMAIL.API_KEY);

const TEMPLATES = {
	passwordResetSuccessful: {
		subject: 'Password Reset Complete',
		from: 'AbegHelp Customer Support <donotreply@abeghelp.me>',
		template: passwordResetComplete,
	},
	resetPassword: {
		subject: 'Reset Password',
		from: 'AbegHelp Customer Support <donotreply@abeghelp.me>',
		template: passwordResetRequest,
	},
	welcomeEmail: {
		subject: 'Welcome to AbegHelp',
		from: 'AbegHelp Customer Support <donotreply@abeghelp.me>',
		template: welcomeEmail,
	},
};

export const sendEmail = async (job: EmailJobData) => {
	const { data, type } = job as EmailJobData;
	const options = TEMPLATES[type];

	console.log('job send email', job);
	console.log('options', options);
	try {
		const dispatch = await resend.emails.send({
			from: options.from,
			to: data.to,
			subject: options.subject,
			html: options.template(data),
		});
		console.log(dispatch);
		logger.info(`Resend api successfully delivered ${type} email to ${data.to}`);
	} catch (error) {
		console.error(error);
		logger.error(`Resend api failed to deliver ${type} email to ${data.to}` + error);
	}
};
