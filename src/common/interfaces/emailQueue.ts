export interface CommonDataFields {
	to: string;
	priority?: string;
}

export interface WelcomeEmailData extends CommonDataFields {
	name: string;
	verificationLink: string;
}

export interface ForgotPasswordData extends CommonDataFields {
	token: string;
	name: string;
}

export interface ResetPasswordData extends CommonDataFields {
	// Add other specific fields for the password reset successful data
}

export type EmailJobData =
	| { type: 'welcomeEmail'; data: WelcomeEmailData }
	| { type: 'resetPassword'; data: ResetPasswordData }
	| { type: 'forgotPassword'; data: ForgotPasswordData };
