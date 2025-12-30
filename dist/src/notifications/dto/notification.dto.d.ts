export declare class CreateNotificationDto {
    title: string;
    message: string;
    link?: string;
    isActive?: boolean;
    priority?: number;
}
export declare class UpdateNotificationDto {
    title?: string;
    message?: string;
    link?: string;
    isActive?: boolean;
    priority?: number;
}
