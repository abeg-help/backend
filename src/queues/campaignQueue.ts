import { ENVIRONMENT } from '@/common/config';
import { Job, Queue, Worker, WorkerOptions } from 'bullmq';
import IORedis from 'ioredis';
import { processCampaign } from './handlers/processCampaign';

export enum CampaignJobEnum {
	PROCESS_CAMPAIGN_REVIEW = 'PROCESS_CAMPAIGN_REVIEW',
}

const connection = new IORedis({
	port: ENVIRONMENT.REDIS.PORT,
	host: ENVIRONMENT.REDIS.URL,
	password: ENVIRONMENT.REDIS.PASSWORD,
	maxRetriesPerRequest: null,
	enableOfflineQueue: false,
	offlineQueue: false,
});

// Create a new connection in every node instance
const campaignQueue = new Queue('campaignQueue', {
	connection,
	defaultJobOptions: {
		attempts: 3,
		backoff: {
			type: 'exponential',
			delay: 1000,
		},
	},
});

const workerOptions: WorkerOptions = {
	connection,
	limiter: { max: 1, duration: 1000 }, // process 1 email every second due to rate limiting of email sender
	lockDuration: 5000, // 5 seconds to process the job before it can be picked up by another worker
	removeOnComplete: {
		age: 3600, // keep up to 1 hour
		count: 1000, // keep up to 1000 jobs
	},
	removeOnFail: {
		age: 24 * 3600, // keep up to 24 hours
	},
	// concurrency: 5, // process 5 jobs concurrently
};

const campaignWorker = new Worker(
	'campaignQueue',
	async (job: Job) => {
		if (job.name === CampaignJobEnum.PROCESS_CAMPAIGN_REVIEW) {
			await processCampaign(job.data.id);
		}
	},
	workerOptions
);

const startCampaignQueue = async () => {
	await campaignQueue.waitUntilReady();
	await campaignWorker.waitUntilReady();
};

const stopCampaignQueue = async () => {
	await campaignQueue.close();
	await campaignWorker.close();
	console.info('campaign queue closed!');
};

export { campaignQueue, campaignWorker, startCampaignQueue, stopCampaignQueue };
