import mongoose, { Model } from 'mongoose';
import { ICampaignCategory } from '@/common/interfaces/campaign';

type campaignCategoryModel = Model<ICampaignCategory>;

const campaignCategorySchema = new mongoose.Schema<ICampaignCategory>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

const campaignCategoryModel = mongoose.model('campaignCategory', campaignCategorySchema);
export { campaignCategoryModel };
