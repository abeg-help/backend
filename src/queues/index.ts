import { startCampaignQueue, stopCampaignQueue } from './campaignQueue';
import { startEmailQueue, stopEmailQueue } from './emailQueue';

const startAllQueuesAndWorkers = async () => {
	await startEmailQueue();
	await startCampaignQueue();
};

const stopAllQueuesAndWorkers = async () => {
	await stopEmailQueue();
	await stopCampaignQueue();
};

export * from './campaignQueue';
export * from './emailQueue';
export { startAllQueuesAndWorkers, stopAllQueuesAndWorkers };
