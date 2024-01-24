import { Country, FundraiserEnum } from '../constants';

interface ICampaign {
	categoryId: {
		type: string;
		ref: string;
	};
	country: Country;
	tags: string[];
	goal: number;
	story: string;
	image: string;
	title: string;
	fundraiser: FundraiserEnum;
	deadline: Date;
	creator: {
		type: string;
		ref: string;
	};
	isComplete: boolean;
}

interface ICampaignCategory {
	name: string;
}

export { ICampaign, ICampaignCategory };
