import { Country } from '../constants';

interface ICampaign {
	categoryId: {
		type: string;
		ref: string;
	};
	country: Country;
	tags: string[];
	goal: string;
	story: string;
	image: string;
	title: string;
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
