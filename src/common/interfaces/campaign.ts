import { Schema } from 'mongoose';
import { Category, Country } from '../constants';
import { IUser } from '@/common/interfaces';

interface ICampaign {
	category: Category;
	country: Country;
	tags: string[];
	goal: string;
	story: string;
	image: string;
	title: string;
	deadline: Date;
	deletedDate: Date;
	isDeleted: boolean;
	creator: Schema.Types.ObjectId | IUser;
}

export { ICampaign };
