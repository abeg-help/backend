import mongoose, { Model } from 'mongoose';
import { ICampaign } from '@/common/interfaces/campaign';
import { Country } from '@/common/constants';

type campaignModel = Model<ICampaign>;

const campaignSchema = new mongoose.Schema<ICampaign>(
	{
		categoryId: {
			type: mongoose.Types.ObjectId,
			ref: 'CampaignCategory',
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
		},
		goal: {
			type: String,
		},
		deadline: {
			type: Date,
		},
		image: {
			type: String,
		},
		story: {
			type: String,
		},
		creator: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
		isComplete: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const campaignModel = mongoose.model('campaign', campaignSchema);
export { campaignModel };
