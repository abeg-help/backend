import { startEmailQueue, stopEmailQueue } from './emailQueue';
import { startCampaignQueue, stopCampaignQueue } from './campaignQueue';

const startAllQueuesAndWorkers = async () => {
	await startEmailQueue();
	await startCampaignQueue();
};

const stopAllQueuesAndWorkers = async () => {
	await stopEmailQueue();
	await stopCampaignQueue();
};

export { startAllQueuesAndWorkers, stopAllQueuesAndWorkers };
