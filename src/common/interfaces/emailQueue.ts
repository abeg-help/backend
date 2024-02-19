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

export interface DeleteAccountData extends CommonDataFields {
	name: string;
	days: string;
	restoreLink: string;
}

export interface RestoreAccountData extends CommonDataFields {
	name: string;
	loginLink: string;
}
export interface FallbackOTPEmailData extends CommonDataFields {
	name: string;
	token: string;
}

export interface Get2faCodeViaEmailData extends CommonDataFields {
	name: string;
	twoFactorCode: string;
	expiryTime: string;
}
export interface RecoveryKeysEmailData extends CommonDataFields {
	name: string;
	recoveryCode: string;
}
export interface LoginNotificationData extends CommonDataFields {
	name: string;
	location: string;
	ip: string;
	device: string;
}

export type EmailJobData =
	| { type: 'welcomeEmail'; data: WelcomeEmailData }
	| { type: 'resetPassword'; data: ResetPasswordData }
	| { type: 'forgotPassword'; data: ForgotPasswordData }
	| { type: 'deleteAccount'; data: DeleteAccountData }
	| { type: 'restoreAccount'; data: RestoreAccountData }
	| { type: 'fallbackOTP'; data: FallbackOTPEmailData }
	| { type: 'get2faCodeViaEmail'; data: Get2faCodeViaEmailData }
	| { type: 'recoveryKeysEmail'; data: RecoveryKeysEmailData }
	| { type: 'loginNotification'; data: LoginNotificationData };
