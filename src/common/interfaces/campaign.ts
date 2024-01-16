import { Category, Country } from '../constants';

interface ICampaign {
	category: Category;
	country: Country;
	tags: string[];
	goal: string;
	story: string;
	image: string;
	title: string;
	deadline: Date;
	campaignCreator: {
		type: string;
		ref: string;
	};
}

export { ICampaign };
