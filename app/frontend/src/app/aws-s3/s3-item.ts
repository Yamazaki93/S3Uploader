export interface S3Item {
    type: string;
    name: string;
    size?: number;
    lastModified?: Date;
}