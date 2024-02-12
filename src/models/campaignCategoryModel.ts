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
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

// only pick categories that are not deleted or suspended
campaignCategorySchema.pre(/^find/, function (this: Model<ICampaignCategory>, next) {
	// pick deleted categories if the query has isDeleted
	if (Object.keys(this['_conditions']).includes('isDeleted')) {
		this.find({});
		return next();
	}

	// do not select campaigns that are deleted or suspended
	this.find({ isDeleted: { $ne: true } });
	next();
});

export const campaignCategoryModel =
	(mongoose.models.CampaignCategory as campaignCategoryModel) ||
	mongoose.model('CampaignCategory', campaignCategorySchema);
