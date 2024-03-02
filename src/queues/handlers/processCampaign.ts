import { FlaggedReasonTypeEnum, StatusEnum } from '@/common/constants';
import { AppError } from '@/common/utils';
import { campaignModel } from '@/models';
import BadWords from 'bad-words';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { ENVIRONMENT } from '@/common/config';
import { CampaignJobEnum, campaignQueue } from '../campaignQueue';
const genAI = new GoogleGenerativeAI(ENVIRONMENT.GEMINI.API_KEY);

export const processCampaign = async (id: string) => {
	try {
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
		const [titleIsInAppropriate, storyIsInAppropriate, titleAndStoryAreSimilar, similarCampaignExist] =
			await Promise.all([
				containsInappropriateContent(campaign.title),
				containsInappropriateContent(campaign.story),
				checkSimilarity(campaign.title, campaign.story),
				checkForSimilarCampaign(campaign.creator, campaign.title),
			]);

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
		campaign.isFlagged = reasons.length > 0;
		campaign.status = reasons.length > 0 ? StatusEnum.IN_REVIEW : StatusEnum.APPROVED;
		await campaign.save();

		return campaign;
	} catch (e) {
		await campaignQueue.add(CampaignJobEnum.PROCESS_CAMPAIGN_REVIEW, { id });
		console.log('processCampaign error : ', e);
	}
};

function containsInappropriateContent(value: string): boolean {
	const filter = new BadWords();

	const result = filter.isProfane(value);

	return result;
}

// async function checkSimilarity(title: string, story: string): Promise<boolean> {
// 	if (!title || !story) {
// 		return false;
// 	}

// 	const PROMPT = `"Given a title and a story for a fundraising website, please provide a relevance score between 1 and 10, where:

// 1 indicates very little to no relevance to fundraising or the given domain.
// 5 indicates moderate relevance, with some connections to fundraising but lacking clear focus.
// 10 indicates a very strong and direct relevance to fundraising, with both the title and story closely aligned to the given domain.
// Consider the following:

// Both the title and the story should be related to fundraising, charity, or philanthropic endeavors.
// Ensure that the content is not spam or irrelevant to the fundraising domain.
// Ensure that the context of the title matches the story, providing a cohesive message.
// A score of 10 should be given when both the title and the story closely align with the theme of fundraising, conveying a clear and relevant message. This includes titles and stories that promote charitable causes, community initiatives, or donation drives in a cohesive manner.
// Conversely, a score of 1 should be given when either the title or the story has no apparent connection to fundraising, charity, or philanthropy, and does not serve the purpose of the fundraising website.
// Please return only the relevance score as a whole number, without explanations or context."

// title: ${title}
// story: ${story}`;
// 	const model = genAI.getGenerativeModel({
// 		model: 'gemini-1.0-pro-latest',

// 		generationConfig: {
// 			stopSequences: ['red'],
// 			maxOutputTokens: 200,
// 			temperature: 0.9,
// 			topP: 0.1,
// 			topK: 16,
// 		},
// 		safetySettings: [
// 			{
// 				category: HarmCategory.HARM_CATEGORY_HARASSMENT,
// 				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
// 			},
// 			{
// 				category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
// 				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
// 			},
// 			{
// 				category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
// 				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
// 			},
// 			{
// 				category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
// 				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
// 			},
// 			{
// 				category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
// 				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
// 			},
// 		],
// 	});
// 	const result = await model.generateContent(PROMPT);
// 	const response = await result.response;
// 	const text = response.text();
// 	console.log('similarity check complete', text);

// 	// const tokenizer = new natural.WordTokenizer();

// 	// const titleTokens = tokenizer.tokenize(title.toLocaleLowerCase());
// 	// const storyTokens = tokenizer.tokenize(story.toLowerCase());

// 	// console.log(titleTokens, storyTokens);

// 	// calculate the Jac card similarity coefficient
// 	// const intersection = titleTokens?.filter((token) => storyTokens?.includes(token));
// 	// console.log('intersection  started');
// 	// console.log(intersection);
// 	// const union = [...new Set([...titleTokens!, ...storyTokens!])];
// 	// console.log(union);

// 	// const similarity = intersection!.length / union.length;
// 	// console.log(similarity);

// 	const threshold = 5;

// 	if (Number(text) >= threshold) {
// 		return true;
// 	}

// 	return false;
// }
async function checkSimilarity(title: string, story: string): Promise<boolean> {
	if (!title || !story) {
		return false;
	}

	const PROMPT = `"Given a title and a story for a fundraising website, please rate their relevance on a scale of 1 (very low) to 10 (very high), considering how well they align with the theme of fundraising, charity, or philanthropy. Explain your rating briefly."

  title: ${title}
  story: ${story}`;

	const model = genAI.getGenerativeModel({
		model: 'gemini-1.0-pro-latest',
		generationConfig: {
			stopSequences: ['red'],
			maxOutputTokens: 200,
			temperature: 0.9,
			topP: 0.1,
			topK: 16,
		},
		safetySettings: [
			{
				category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
			},
		],
	});

	const result = await model.generateContent(PROMPT);
	const response = await result.response;
	const text = response.text();
	console.log('Relevance rating:', text);

	// Extract the numerical score from the response
	const regex = /rated (\d+)/;
	const match = regex.exec(text);

	if (match) {
		const score = Number(match[1]);
		return score >= 5; // Adjust the threshold as needed
	} else {
		console.error('Failed to extract score from LLM response.');
		return false;
	}
}

async function checkForSimilarCampaign(creator, title: string): Promise<boolean> {
	const existingFundraiser = await campaignModel.find({
		creator: creator._id ? creator._id : creator,
		title: { $regex: new RegExp('^' + title + '$', 'i') },
	});

	if (existingFundraiser.length > 1) return true;

	return false;
}
