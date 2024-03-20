export interface IInitializeTransaction {
	amount: number;
	email: string;
	callback_url?: string;
	reference: string;
	metadata: {
		campaignId: string;
	};
}
