import { ENVIRONMENT } from '@/common/config';
import { Job, Queue, Worker, WorkerOptions, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { processCampaign } from '@/queues/handlers/processCampaign';
import { logger } from '@/common/utils';

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
			delay: 500,
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
		try {
			if (job.name === CampaignJobEnum.PROCESS_CAMPAIGN_REVIEW) {
				await processCampaign(job.data.id);
			}
		} catch (e) {
			console.log('Error processing job', e);
		}
	},
	workerOptions
);
// EVENT LISTENERS
// create a queue event listener
const campaignQueueEvents = new QueueEvents('emailQueue', { connection });

campaignQueueEvents.on('failed', ({ jobId, failedReason }) => {
	console.log(`Job ${jobId} failed with error ${failedReason}`);
	logger.error(`Job ${jobId} failed with error ${failedReason}`);
	// Do something with the return value of failed job
});

campaignQueueEvents.on('waiting', ({ jobId }) => {
	console.log(`A job with ID ${jobId} is waiting`);
});

campaignQueueEvents.on('completed', ({ jobId, returnvalue }) => {
	console.log(`Job ${jobId} completed`, returnvalue);
	logger.info(`Job ${jobId} completed`, returnvalue);
	// Called every time a job is completed in any worker
});

campaignWorker.on('error', (err) => {
	// log the error
	console.error(err);
	logger.error(`Error processing email job: ${err}`);
});

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
