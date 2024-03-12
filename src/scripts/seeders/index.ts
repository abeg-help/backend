import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { Country, FundraiserEnum, StatusEnum } from '../../common/constants';
import { campaignModel } from '../../models';
import { ENVIRONMENT } from '../../common/config';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ', 6);

async function seedCampaigns(size?: number) {
	// Seed data
	try {
		const campaignsToSeed: unknown[] = [];

		for (let i = 0; i < size! ?? 100; i++) {
			const newCampaign = {
				url: `${ENVIRONMENT.FRONTEND_URL}/c/${nanoid()}`,
				category: new mongoose.Types.ObjectId(), // Generate a fake ObjectId
				country: faker.helpers.arrayElement(Object.values(Country)),
				tags: [faker.lorem.word(), faker.lorem.word()], // Generate random tags
				title: faker.lorem.words(5),
				fundraiser: faker.helpers.arrayElement(Object.values(FundraiserEnum)),
				goal: faker.number.int({ min: 5000, max: 100000 }),
				amountRaised: faker.number.int({ min: 5000, max: 100000 }),
				deadline: faker.date.future(),
				images: [
					{
						secureUrl: faker.image.url(),
						blurHash: faker.image.urlPlaceholder(),
					},
				],
				story: faker.lorem.paragraph(),
				storyHtml: faker.lorem.paragraphs(),
				creator: new mongoose.Types.ObjectId(),
				status: faker.helpers.arrayElement(Object.values(StatusEnum)),
				isFlagged: faker.datatype.boolean(),
				flaggedReasons: [],
				isDeleted: false,
				featured: faker.datatype.boolean(),
				isPublished: true,
			};

			campaignsToSeed.push(newCampaign);
		}

		// Insert data into MongoDB
		await campaignModel.insertMany(campaignsToSeed);

		console.log('Campaigns seeded successfully.');
	} catch (error) {
		console.error('Error seeding campaigns:', error);
	} finally {
		// Disconnect from MongoDB
		await mongoose.disconnect();
	}
}

export async function runSeeders() {
	try {
		// Seed the campaigns
		seedCampaigns(5);
	} catch (error) {
		console.log('Error seeding campaigns:', error);
	}
}
