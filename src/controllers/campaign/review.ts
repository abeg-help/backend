import AppError from '@/common/utils/appError';
import { catchAsync } from '@/middlewares';
import { Response, Request } from 'express';
import { campaignModel } from '../../models/campaignModel';
import { AppResponse } from '../../common/utils';
import BadWords from 'bad-words';
import { FlaggedReasonTypeEnum, StatusEnum } from '../../common/constants';
import * as natural from 'natural';

const reviewCampaign = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const reasons: {
		type: FlaggedReasonTypeEnum;
		reason: string;
	}[] = [];

	const campaign = await campaignModel.findById(id);

	console.log({ campaign });

	if (!campaign) {
		throw new AppError('Campaign not found', 404);
	}

	// perform checks
	const [titleIsInAppropriate, storyIsInAppropriate, titleAndStoryAreSimilar, similarCampaignExist] = await Promise.all(
		[
			containsInappropriateContent(campaign.title),
			containsInappropriateContent(campaign.story),
			checkSimilarity(campaign.title, campaign.story),
			checkForSimilarCampaign(campaign.creator.toString(), campaign.title),
		]
	);

	if (titleIsInAppropriate || storyIsInAppropriate) {
		reasons.push({
			type: FlaggedReasonTypeEnum.INAPPROPRIATE_CONTENT,
			reason: `Campaign ${titleIsInAppropriate ? 'title' : 'story'} contains In-appropriate content`,
		});
	}

	if (!titleAndStoryAreSimilar) {
		reasons.push({
			type: FlaggedReasonTypeEnum.MISMATCH,
			reason: `Campaign story does not match with title`,
		});
	}

	if (similarCampaignExist) {
		reasons.push({
			type: FlaggedReasonTypeEnum.EXISTS,
			reason: `Similar campaign already exists in your account.`,
		});
	}

	campaign.flaggedReasons = reasons;
	campaign.isFlagged = reasons.length > 0 ? true : false;
	campaign.status = reasons.length > 0 ? StatusEnum.PENDING_APPROVAL : StatusEnum.SUCCESS;
	await campaign.save();

	return AppResponse(res, 200, campaign, '');
});

export default reviewCampaign;

function containsInappropriateContent(value: string): boolean {
	const filter = new BadWords();

	const result = filter.isProfane(value);

	return result;
}

function checkSimilarity(title: string, story: string): boolean {
	if (!title || !story) {
		return false;
	}

	const tokenizer = new natural.WordTokenizer();

	const titleTokens = tokenizer.tokenize(title.toLocaleLowerCase());
	const storyTokens = tokenizer.tokenize(story.toLowerCase());

	// calculate the Jac card similarity coefficient
	const intersection = titleTokens?.filter((token) => storyTokens?.includes(token));
	const union = [...new Set([...titleTokens!, ...storyTokens!])];
	const similarity = intersection!.length / union.length;

	const threshold = 0.5;

	if (similarity >= threshold) {
		return true;
	}

	return false;
}

async function checkForSimilarCampaign(creator: string, title: string): Promise<boolean> {
	const existingFundraiser = await campaignModel.find({
		creator,
		title: { $regex: new RegExp('^' + title + '$', 'i') },
	});

	if (existingFundraiser.length > 1) return true;

	return false;
}
