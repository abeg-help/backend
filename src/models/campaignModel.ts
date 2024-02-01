import mongoose, { Model } from 'mongoose';
import { ICampaign } from '@/common/interfaces/campaign';
import { Country, FlaggedReasonTypeEnum, FundraiserEnum, StatusEnum } from '@/common/constants';

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
		isComplete: {
			type: Boolean,
			default: false,
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
		status: {
			type: String,
			enum: [...Object.values(StatusEnum)],
			default: StatusEnum.PENDING_APPROVAL,
		},
		isFlagged: {
			type: Boolean,
			default: false,
		},
		flaggedReasons: {
			type: {
				type: String,
				enum: [...Object.values(FlaggedReasonTypeEnum)],
			},
			reason: String,
		},
	},
	{ timestamps: true }
);

const campaignModel = mongoose.model('campaign', campaignSchema);
export { campaignModel };
