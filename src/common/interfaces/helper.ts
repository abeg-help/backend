interface IHashData {
	id?: string;
	token?: string;
}

interface IGenerate2faRecoveryCode {
	recoveryCode: string;
	hashedRecoveryCode: string;
}

export { IHashData, IGenerate2faRecoveryCode };
