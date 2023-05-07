import { QueueBase } from './queue-base';
import { Job } from './job';
import { JobState, JobType } from '../types';
import { Metrics } from '../interfaces';
/**
 *
 * @class QueueGetters
 * @extends QueueBase
 *
 * @description Provides different getters for different aspects of a queue.
 */
export declare class QueueGetters<DataType, ResultType, NameType extends string> extends QueueBase {
    getJob(jobId: string): Promise<Job<DataType, ResultType, NameType> | undefined>;
    private commandByType;
    /**
     * Helper to easily extend Job class calls.
     */
    protected get Job(): typeof Job;
    private sanitizeJobTypes;
    /**
      Returns the number of jobs waiting to be processed. This includes jobs that are "waiting" or "delayed".
    */
    count(): Promise<number>;
    /**
     * Job counts by type
     *
     * Queue#getJobCountByTypes('completed') => completed count
     * Queue#getJobCountByTypes('completed,failed') => completed + failed count
     * Queue#getJobCountByTypes('completed', 'failed') => completed + failed count
     * Queue#getJobCountByTypes('completed', 'waiting', 'failed') => completed + waiting + failed count
     */
    getJobCountByTypes(...types: JobType[]): Promise<number>;
    /**
     * Returns the job counts for each type specified or every list/set in the queue by default.
     *
     * @returns An object, key (type) and value (count)
     */
    getJobCounts(...types: JobType[]): Promise<{
        [index: string]: number;
    }>;
    /**
     * Get current job state.
     *
     * @returns Returns one of these values:
     * 'completed', 'failed', 'delayed', 'active', 'waiting', 'waiting-children', 'unknown'.
     */
    getJobState(jobId: string): Promise<JobState | 'unknown'>;
    /**
     * Returns the number of jobs in completed status.
     */
    getCompletedCount(): Promise<number>;
    /**
     * Returns the number of jobs in failed status.
     */
    getFailedCount(): Promise<number>;
    /**
     * Returns the number of jobs in delayed status.
     */
    getDelayedCount(): Promise<number>;
    /**
     * Returns the number of jobs in active status.
     */
    getActiveCount(): Promise<number>;
    /**
     * Returns the number of jobs in waiting or paused statuses.
     */
    getWaitingCount(): Promise<number>;
    /**
     * Returns the number of jobs in waiting-children status.
     */
    getWaitingChildrenCount(): Promise<number>;
    /**
     * Returns the jobs that are in the "waiting" status.
     * @param start - zero based index from where to start returning jobs.
     * @param end - zero based index where to stop returning jobs.
     */
    getWaiting(start?: number, end?: number): Promise<Job<DataType, ResultType, NameType>[]>;
    /**
     * Returns the jobs that are in the "waiting" status.
     * @param start - zero based index from where to start returning jobs.
     * @param end - zero based index where to stop returning jobs.
     */
    getWaitingChildren(start?: number, end?: number): Promise<Job<DataType, ResultType, NameType>[]>;
    /**
     * Returns the jobs that are in the "active" status.
     * @param start - zero based index from where to start returning jobs.
     * @param end - zero based index where to stop returning jobs.
     */
    getActive(start?: number, end?: number): Promise<Job<DataType, ResultType, NameType>[]>;
    /**
     * Returns the jobs that are in the "delayed" status.
     * @param start - zero based index from where to start returning jobs.
     * @param end - zero based index where to stop returning jobs.
     */
    getDelayed(start?: number, end?: number): Promise<Job<DataType, ResultType, NameType>[]>;
    /**
     * Returns the jobs that are in the "completed" status.
     * @param start - zero based index from where to start returning jobs.
     * @param end - zero based index where to stop returning jobs.
     */
    getCompleted(start?: number, end?: number): Promise<Job<DataType, ResultType, NameType>[]>;
    /**
     * Returns the jobs that are in the "failed" status.
     * @param start - zero based index from where to start returning jobs.
     * @param end - zero based index where to stop returning jobs.
     */
    getFailed(start?: number, end?: number): Promise<Job<DataType, ResultType, NameType>[]>;
    getRanges(types: JobType[], start?: number, end?: number, asc?: boolean): Promise<string[]>;
    /**
     * Returns the jobs that are on the given statuses (note that JobType is synonym for job status)
     * @param types - the statuses of the jobs to return.
     * @param start - zero based index from where to start returning jobs.
     * @param end - zero based index where to stop returning jobs.
     * @param asc - if true, the jobs will be returned in ascending order.
     */
    getJobs(types?: JobType[] | JobType, start?: number, end?: number, asc?: boolean): Promise<Job<DataType, ResultType, NameType>[]>;
    /**
     * Returns the logs for a given Job.
     * @param jobId - the id of the job to get the logs for.
     * @param start - zero based index from where to start returning jobs.
     * @param end - zero based index where to stop returning jobs.
     * @param asc - if true, the jobs will be returned in ascending order.
     */
    getJobLogs(jobId: string, start?: number, end?: number, asc?: boolean): Promise<{
        logs: string[];
        count: number;
    }>;
    private baseGetClients;
    /**
     * Get the worker list related to the queue. i.e. all the known
     * workers that are available to process jobs for this queue.
     * Note: GCP does not support SETNAME, so this call will not work
     *
     * @returns - Returns an array with workers info.
     */
    getWorkers(): Promise<{
        [index: string]: string;
    }[]>;
    /**
     * Get queue events list related to the queue.
     * Note: GCP does not support SETNAME, so this call will not work
     *
     * @returns - Returns an array with queue events info.
     */
    getQueueEvents(): Promise<{
        [index: string]: string;
    }[]>;
    /**
     * Get queue metrics related to the queue.
     *
     * This method returns the gathered metrics for the queue.
     * The metrics are represented as an array of job counts
     * per unit of time (1 minute).
     *
     * @param start - Start point of the metrics, where 0
     * is the newest point to be returned.
     * @param end - End point of the metrics, where -1 is the
     * oldest point to be returned.
     *
     * @returns - Returns an object with queue metrics.
     */
    getMetrics(type: 'completed' | 'failed', start?: number, end?: number): Promise<Metrics>;
    private parseClientList;
}
