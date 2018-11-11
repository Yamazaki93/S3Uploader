export interface S3Item {
    type: string;
    name: string;
    size?: number;
    Etag?: string,
    LastModified?: Date;
    Metadata?: any,
    ContentType?: string,
    StorageClass?: string,
}