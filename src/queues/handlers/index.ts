import { ENVIRONMENT } from '@/common/config';
import { EmailJobData } from '@/common/interfaces/emailQueue';
import { logger } from '@/common/utils';
import { Resend } from 'resend';
import { passwordResetComplete } from '../templates/passwordResetComplete';

const resend = new Resend(ENVIRONMENT.EMAIL.API_KEY);

const TEMPLATES = {
	passwordResetSuccessful: {
		subject: 'Password Reset Complete',
		from: 'AbegHelp Customer Support <donotreply@abeghelp.me>',
		template: passwordResetComplete,
	},
};

export const sendEmail = async (job: EmailJobData) => {
	const { data, type } = job as EmailJobData;
	const options = TEMPLATES[type];
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
