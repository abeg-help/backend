import { ENVIRONMENT } from '@/common/config';

export enum Role {
	SuperUser = 'superuser',
	User = 'user',
	Guest = 'guest',
}

export enum Provider {
	Local = 'local',
	Google = 'google',
}

export enum IDType {
	NIN = 'nin',
	BVN = 'bvn',
	IntlPassport = 'intl-passport',
}

export enum Gender {
	Male = 'male',
	Female = 'female',
	Other = 'other',
	None = 'none',
}

export enum JWTExpiresIn {
	Access = 15 * 60 * 1000,
	Refresh = 24 * 60 * 60 * 1000,
}

export const TOTPBaseConfig = {
	issuer: `${ENVIRONMENT.APP.NAME}`,
	label: `${ENVIRONMENT.APP.NAME}`,
	algorithm: 'SHA1',
	digits: 6,
};

export enum VerifyTimeBased2faTypeEnum {
	CODE = 'CODE',
	EMAIL_CODE = 'EMAIL_CODE',
	DISABLE_2FA = 'DISABLE_2FA',
}

export enum twoFactorTypeEnum {
	EMAIL = 'EMAIL',
	APP = 'APP',
}

export enum Country {
	NIGERIA = 'NIGERIA',
	GHANA = 'GHANA',
	MALI = 'MALI',
	LIBERIA = 'LIBERIA',
	GAMBIA = ' CAMEROON ',
	CAMEROON = 'CAMEROON',
}

// add categories
export enum Category {
	some = 'some',
}
