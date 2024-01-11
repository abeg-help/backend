import mongoose, { Model } from 'mongoose';
import { ICampaign } from '@/common/interfaces/campaign';
import { Category, Country } from '@/common/constants';

type campaignModel = Model<ICampaign>;
const campaignSchema = new mongoose.Schema<ICampaign>({
	category: {
		type: String,
		enum: Object.values(Category),
	},
	country: {
		type: String,
		enum: Object.values(Country),
	},
	tags: {
		type: [String],
		default: [],
	},
	title: {
		type: String,
		required: true,
	},
	goal: {
		type: String,
		required: true,
	},
	deadline: {
		type: Date,
	},
	image: {
		type: String,
	},
	story: {
		type: String,
		required: true,
	},
});

const campaignModel = mongoose.model('campaign', campaignSchema);
export { campaignModel };
