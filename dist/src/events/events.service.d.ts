import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEventDto: any, files?: Array<Express.Multer.File>, certificateFile?: Express.Multer.File): Promise<({
        files: {
            id: number;
            fileData: Prisma.Bytes;
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
        eventHighlights: Prisma.JsonValue;
        studentCoordinators: Prisma.JsonValue;
        facultyCoordinators: Prisma.JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: Prisma.JsonValue;
        eventCertificateImage: Prisma.Bytes | null;
    }) | null>;
    findAll(filters?: {
        status?: string;
        eventType?: string;
    }): Promise<({
        files: {
            id: number;
            fileData: Prisma.Bytes;
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
        eventHighlights: Prisma.JsonValue;
        studentCoordinators: Prisma.JsonValue;
        facultyCoordinators: Prisma.JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: Prisma.JsonValue;
        eventCertificateImage: Prisma.Bytes | null;
    })[]>;
    findOne(id: number): Promise<{
        files: {
            id: number;
            fileData: Prisma.Bytes;
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
        eventHighlights: Prisma.JsonValue;
        studentCoordinators: Prisma.JsonValue;
        facultyCoordinators: Prisma.JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: Prisma.JsonValue;
        eventCertificateImage: Prisma.Bytes | null;
    }>;
    update(id: number, updateEventDto: any, files?: Array<Express.Multer.File>, certificateFile?: Express.Multer.File): Promise<({
        files: {
            id: number;
            fileData: Prisma.Bytes;
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
        eventHighlights: Prisma.JsonValue;
        studentCoordinators: Prisma.JsonValue;
        facultyCoordinators: Prisma.JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: Prisma.JsonValue;
        eventCertificateImage: Prisma.Bytes | null;
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
        eventHighlights: Prisma.JsonValue;
        studentCoordinators: Prisma.JsonValue;
        facultyCoordinators: Prisma.JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: Prisma.JsonValue;
        eventCertificateImage: Prisma.Bytes | null;
    }>;
    uploadCertificate(eventId: number, certificateBuffer: Buffer): Promise<{
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
        eventHighlights: Prisma.JsonValue;
        studentCoordinators: Prisma.JsonValue;
        facultyCoordinators: Prisma.JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: Prisma.JsonValue;
        eventCertificateImage: Prisma.Bytes | null;
    }>;
    getCertificate(eventId: number): Promise<Uint8Array<ArrayBuffer>>;
    addFile(eventId: number, fileBuffer: Buffer): Promise<{
        id: number;
        fileData: Prisma.Bytes;
        eventId: number;
    }>;
    getFile(fileId: number): Promise<{
        id: number;
        fileData: Prisma.Bytes;
        eventId: number;
    }>;
    removeFile(fileId: number): Promise<{
        id: number;
        fileData: Prisma.Bytes;
        eventId: number;
    }>;
    getUpcomingEvents(): Promise<({
        files: {
            id: number;
            fileData: Prisma.Bytes;
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
        eventHighlights: Prisma.JsonValue;
        studentCoordinators: Prisma.JsonValue;
        facultyCoordinators: Prisma.JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: Prisma.JsonValue;
        eventCertificateImage: Prisma.Bytes | null;
    })[]>;
    getPastEvents(): Promise<({
        files: {
            id: number;
            fileData: Prisma.Bytes;
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
        eventHighlights: Prisma.JsonValue;
        studentCoordinators: Prisma.JsonValue;
        facultyCoordinators: Prisma.JsonValue;
        speakerName: string | null;
        speakerDescription: string | null;
        speakerHighlights: Prisma.JsonValue;
        eventCertificateImage: Prisma.Bytes | null;
    })[]>;
}
