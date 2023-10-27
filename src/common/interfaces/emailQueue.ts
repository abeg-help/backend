export interface CommonDataFields {
	to: string;
	priority: string;
}

export interface WelcomeEmailData extends CommonDataFields {
	// Add other specific fields for the welcome email
}

export interface ResetPasswordData extends CommonDataFields {
	token: string;
	name: string;
}

export interface PasswordResetSuccessfulData extends CommonDataFields {
	// Add other specific fields for the password reset successful data
}

export type EmailJobData =
	| { type: 'welcomeEmail'; data: WelcomeEmailData }
	| { type: 'resetPassword'; data: ResetPasswordData }
	| { type: 'passwordResetSuccessful'; data: PasswordResetSuccessfulData };
