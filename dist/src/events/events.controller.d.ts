import { StreamableFile } from '@nestjs/common';
import { EventsService } from './events.service';
import { Response } from 'express';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: any, uploadedFiles: {
        files?: Express.Multer.File[];
        eventCertificateImage?: Express.Multer.File[];
    }): Promise<({
        files: {
            id: number;
            fileData: import("@prisma/client/runtime/library").Bytes;
            eventId: number;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        description: string;
        eventType: string | null;
        aboutEvent: string | null;
        eventRegistrationLink: string | null;
        eventPdfLink: string | null;
        eventVideoLink: string | null;
        noOfParticipants: number | null;
        eventDate: Date;
        eventHighlights: import("@prisma/client/runtime/library").JsonValue;
        studentCoordinators: import("@prisma/client/runtime/library").JsonValue;
        facultyCoordinators: import("@prisma/client/runtime/library").JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: import("@prisma/client/runtime/library").JsonValue;
        eventCertificateImage: import("@prisma/client/runtime/library").Bytes | null;
    }) | null>;
    findAll(status?: string, eventType?: string): Promise<({
        files: {
            id: number;
            fileData: import("@prisma/client/runtime/library").Bytes;
            eventId: number;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        description: string;
        eventType: string | null;
        aboutEvent: string | null;
        eventRegistrationLink: string | null;
        eventPdfLink: string | null;
        eventVideoLink: string | null;
        noOfParticipants: number | null;
        eventDate: Date;
        eventHighlights: import("@prisma/client/runtime/library").JsonValue;
        studentCoordinators: import("@prisma/client/runtime/library").JsonValue;
        facultyCoordinators: import("@prisma/client/runtime/library").JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: import("@prisma/client/runtime/library").JsonValue;
        eventCertificateImage: import("@prisma/client/runtime/library").Bytes | null;
    })[]>;
    getUpcoming(): Promise<({
        files: {
            id: number;
            fileData: import("@prisma/client/runtime/library").Bytes;
            eventId: number;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        description: string;
        eventType: string | null;
        aboutEvent: string | null;
        eventRegistrationLink: string | null;
        eventPdfLink: string | null;
        eventVideoLink: string | null;
        noOfParticipants: number | null;
        eventDate: Date;
        eventHighlights: import("@prisma/client/runtime/library").JsonValue;
        studentCoordinators: import("@prisma/client/runtime/library").JsonValue;
        facultyCoordinators: import("@prisma/client/runtime/library").JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: import("@prisma/client/runtime/library").JsonValue;
        eventCertificateImage: import("@prisma/client/runtime/library").Bytes | null;
    })[]>;
    getPast(): Promise<({
        files: {
            id: number;
            fileData: import("@prisma/client/runtime/library").Bytes;
            eventId: number;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        description: string;
        eventType: string | null;
        aboutEvent: string | null;
        eventRegistrationLink: string | null;
        eventPdfLink: string | null;
        eventVideoLink: string | null;
        noOfParticipants: number | null;
        eventDate: Date;
        eventHighlights: import("@prisma/client/runtime/library").JsonValue;
        studentCoordinators: import("@prisma/client/runtime/library").JsonValue;
        facultyCoordinators: import("@prisma/client/runtime/library").JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: import("@prisma/client/runtime/library").JsonValue;
        eventCertificateImage: import("@prisma/client/runtime/library").Bytes | null;
    })[]>;
    findOne(id: number): Promise<{
        files: {
            id: number;
            fileData: import("@prisma/client/runtime/library").Bytes;
            eventId: number;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        description: string;
        eventType: string | null;
        aboutEvent: string | null;
        eventRegistrationLink: string | null;
        eventPdfLink: string | null;
        eventVideoLink: string | null;
        noOfParticipants: number | null;
        eventDate: Date;
        eventHighlights: import("@prisma/client/runtime/library").JsonValue;
        studentCoordinators: import("@prisma/client/runtime/library").JsonValue;
        facultyCoordinators: import("@prisma/client/runtime/library").JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: import("@prisma/client/runtime/library").JsonValue;
        eventCertificateImage: import("@prisma/client/runtime/library").Bytes | null;
    }>;
    update(id: number, updateEventDto: any, uploadedFiles: {
        files?: Express.Multer.File[];
        eventCertificateImage?: Express.Multer.File[];
    }): Promise<({
        files: {
            id: number;
            fileData: import("@prisma/client/runtime/library").Bytes;
            eventId: number;
        }[];
    } & {
        id: number;
        title: string;
        status: string;
        description: string;
        eventType: string | null;
        aboutEvent: string | null;
        eventRegistrationLink: string | null;
        eventPdfLink: string | null;
        eventVideoLink: string | null;
        noOfParticipants: number | null;
        eventDate: Date;
        eventHighlights: import("@prisma/client/runtime/library").JsonValue;
        studentCoordinators: import("@prisma/client/runtime/library").JsonValue;
        facultyCoordinators: import("@prisma/client/runtime/library").JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: import("@prisma/client/runtime/library").JsonValue;
        eventCertificateImage: import("@prisma/client/runtime/library").Bytes | null;
    }) | null>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        status: string;
        description: string;
        eventType: string | null;
        aboutEvent: string | null;
        eventRegistrationLink: string | null;
        eventPdfLink: string | null;
        eventVideoLink: string | null;
        noOfParticipants: number | null;
        eventDate: Date;
        eventHighlights: import("@prisma/client/runtime/library").JsonValue;
        studentCoordinators: import("@prisma/client/runtime/library").JsonValue;
        facultyCoordinators: import("@prisma/client/runtime/library").JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: import("@prisma/client/runtime/library").JsonValue;
        eventCertificateImage: import("@prisma/client/runtime/library").Bytes | null;
    }>;
    uploadCertificate(id: number, file: Express.Multer.File): Promise<{
        id: number;
        title: string;
        status: string;
        description: string;
        eventType: string | null;
        aboutEvent: string | null;
        eventRegistrationLink: string | null;
        eventPdfLink: string | null;
        eventVideoLink: string | null;
        noOfParticipants: number | null;
        eventDate: Date;
        eventHighlights: import("@prisma/client/runtime/library").JsonValue;
        studentCoordinators: import("@prisma/client/runtime/library").JsonValue;
        facultyCoordinators: import("@prisma/client/runtime/library").JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: import("@prisma/client/runtime/library").JsonValue;
        eventCertificateImage: import("@prisma/client/runtime/library").Bytes | null;
    }>;
    getCertificate(id: number, res: Response): Promise<StreamableFile>;
    uploadFile(id: number, file: Express.Multer.File): Promise<{
        id: number;
        fileData: import("@prisma/client/runtime/library").Bytes;
        eventId: number;
    }>;
    getFile(fileId: number, res: Response): Promise<StreamableFile>;
    removeFile(fileId: number): Promise<{
        id: number;
        fileData: import("@prisma/client/runtime/library").Bytes;
        eventId: number;
    }>;
}
