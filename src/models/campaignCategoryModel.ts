import type { ICampaignCategory } from '@/common/interfaces';
import mongoose, { Model } from 'mongoose';

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

export const campaignCategoryModel =
	(mongoose.models.CampaignCategory as campaignCategoryModel) ||
	mongoose.model('CampaignCategory', campaignCategorySchema);
