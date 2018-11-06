import { JobStatus } from "./job-status";
import { JobType } from "./job-type";

export interface Job {
    id: string;
    type: JobType;
    status: JobStatus;
    percentage: number;
    from: string;
    to: string;
    localFile?: string;
    message?: string;
}
