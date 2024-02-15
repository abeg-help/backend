import { Country, FlaggedReasonTypeEnum, FundraiserEnum, StatusEnum } from '@/common/constants';
import type { ICampaign } from '@/common/interfaces';
import mongoose, { Model } from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';

type campaignModel = Model<ICampaign>;

const campaignSchema = new mongoose.Schema<ICampaign>(
	{
		category: {
			type: mongoose.Types.ObjectId,
			ref: 'CampaignCategory',
			autopopulate: true,
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
				secureUrl: {
					type: String,
					required: true,
				},
				blurHash: {
					type: String,
				},
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
		isDeleted: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{ timestamps: true }
);

campaignSchema.plugin(mongooseAutopopulate);

campaignSchema.index({ title: 'text' });
campaignSchema.index({ creator: 1 });

// Add a virtual populate field for 'donations'
campaignSchema.virtual('donations', {
	ref: 'Donation', // The model to use
	localField: '_id', // Find donations where 'localField'
	foreignField: 'campaignId', // is equal to 'foreignField'
	justOne: false, // And only get the first one found,
	options: {
		sort: { createdAt: -1 },
		limit: 10,
	},
});

// only pick campaigns that are not deleted or suspended
campaignSchema.pre(/^find/, function (this: Model<ICampaign>, next) {
	// pick deleted campaigns if the query has isDeleted
	if (Object.keys(this['_conditions']).includes('isDeleted')) {
		this.find({});
		return next();
	}

	// do not select campaigns that are deleted or suspended
	this.find({ isDeleted: { $ne: true } });
	next();
});

// only pick campaigns that are not deleted or suspended
campaignSchema.pre(/^find/, function (this: Model<ICampaign>, next) {
	// pick deleted campaigns if the query has isDeleted
	if (Object.keys(this['_conditions']).includes('isDeleted')) {
		this.find({});
		return next();
	}

	// do not select campaigns that are deleted or suspended
	this.find({ isDeleted: { $ne: true } });
	next();
});

export const campaignModel = (mongoose.models.Campaign as campaignModel) || mongoose.model('Campaign', campaignSchema);
