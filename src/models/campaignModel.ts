import { Country, FlaggedReasonTypeEnum, FundraiserEnum, StatusEnum } from '@/common/constants';
import type { ICampaign } from '@/common/interfaces';
import mongoose, { Model } from 'mongoose';

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
		fundraiser: {
			type: String,
			enum: [...Object.values(FundraiserEnum)],
		},
		goal: {
			type: Number,
		},
		deadline: {
			type: Date,
		},
		images: [
			{
				type: String,
			},
		],
		story: {
			type: String,
		},
		storyHtml: {
			type: String,
		},
		creator: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
		status: {
			type: String,
			enum: [...Object.values(StatusEnum)],
			default: StatusEnum.DRAFT,
		},
		isFlagged: {
			type: Boolean,
			default: false,
		},
		flaggedReasons: [
			{
				type: {
					type: String,
					enum: [...Object.values(FlaggedReasonTypeEnum)],
				},
				reason: String,
			},
		],
	},
	{ timestamps: true }
);

campaignSchema.index({ title: 'text' });
campaignSchema.index({ creator: 1 });

export const campaignModel = (mongoose.models.Campaign as campaignModel) || mongoose.model('Campaign', campaignSchema);
