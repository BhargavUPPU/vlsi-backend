"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createEventDto, files, certificateFile) {
        console.log('========== CREATE EVENT DEBUG ==========');
        console.log('1. Received createEventDto:', JSON.stringify(createEventDto, null, 2));
        console.log('2. Files received:', files?.length, 'files');
        console.log('2a. Certificate file:', certificateFile ? 'YES' : 'NO');
        console.log('3. Raw eventHighlights:', createEventDto.eventHighlights);
        console.log('4. Raw studentCoordinators:', createEventDto.studentCoordinators);
        const arrayFields = {};
        if (createEventDto.eventHighlights) {
            try {
                arrayFields.eventHighlights = JSON.parse(createEventDto.eventHighlights);
                console.log('5. Parsed eventHighlights:', arrayFields.eventHighlights);
            }
            catch (e) {
                console.log('5. Failed to parse eventHighlights:', e);
                arrayFields.eventHighlights = [];
            }
        }
        if (createEventDto.studentCoordinators) {
            try {
                arrayFields.studentCoordinators = JSON.parse(createEventDto.studentCoordinators);
                console.log('6. Parsed studentCoordinators:', arrayFields.studentCoordinators);
            }
            catch (e) {
                console.log('6. Failed to parse studentCoordinators:', e);
                arrayFields.studentCoordinators = [];
            }
        }
        if (createEventDto.facultyCoordinators) {
            try {
                arrayFields.facultyCoordinators = JSON.parse(createEventDto.facultyCoordinators);
                console.log('7. Parsed facultyCoordinators:', arrayFields.facultyCoordinators);
            }
            catch (e) {
                console.log('7. Failed to parse facultyCoordinators:', e);
                arrayFields.facultyCoordinators = [];
            }
        }
        if (createEventDto.speakerHighlights) {
            try {
                arrayFields.speakerHighlights = JSON.parse(createEventDto.speakerHighlights);
                console.log('8. Parsed speakerHighlights:', arrayFields.speakerHighlights);
            }
            catch (e) {
                console.log('8. Failed to parse speakerHighlights:', e);
                arrayFields.speakerHighlights = [];
            }
        }
        const { files: _files, eventCertificateImage, ...eventData } = createEventDto;
        console.log('9. After filtering files/certificate:', Object.keys(eventData));
        if (eventData.noOfParticipants) {
            eventData.noOfParticipants = parseInt(eventData.noOfParticipants);
            console.log('10. Parsed noOfParticipants:', eventData.noOfParticipants);
        }
        console.log('11. Final data to create:', { ...eventData, ...arrayFields });
        return await this.prisma.$transaction(async (tx) => {
            console.log('12. Starting transaction...');
            const event = await tx.event.create({
                data: {
                    ...eventData,
                    ...arrayFields,
                    eventDate: new Date(createEventDto.eventDate),
                    ...(certificateFile && {
                        eventCertificateImage: new Uint8Array(certificateFile.buffer)
                    }),
                },
            });
            console.log('12a. Event created with ID:', event.id);
            console.log('12b. Certificate saved:', certificateFile ? 'YES' : 'NO');
            if (files && files.length > 0) {
                console.log('13. Starting to save', files.length, 'files...');
                try {
                    const filePromises = files.map((file, index) => {
                        console.log(`  - File ${index + 1}: size=${file.size}, mimetype=${file.mimetype}`);
                        console.log(`  - Buffer length: ${file.buffer.length}`);
                        return tx.eventFile.create({
                            data: {
                                eventId: event.id,
                                fileData: new Uint8Array(file.buffer),
                            },
                        }).then(savedFile => {
                            console.log(`  - Saved file ${index + 1} with ID: ${savedFile.id}`);
                            return savedFile;
                        }).catch(err => {
                            console.error(`  - ERROR saving file ${index + 1}:`, err);
                            throw err;
                        });
                    });
                    const savedFiles = await Promise.all(filePromises);
                    console.log(`14. Successfully saved ${savedFiles.length} files for event ${event.id}`);
                    console.log('14a. Saved file IDs:', savedFiles.map(f => f.id));
                }
                catch (error) {
                    console.error('ERROR saving files:', error);
                    throw error;
                }
            }
            else {
                console.log('13. No files to save');
            }
            const finalEvent = await tx.event.findUnique({
                where: { id: event.id },
                include: { files: true },
            });
            console.log('15. Final event with', finalEvent?.files?.length, 'files');
            console.log('16. Transaction will commit now...');
            console.log('========== END CREATE EVENT DEBUG ==========');
            return finalEvent;
        });
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.eventType)
            where.eventType = filters.eventType;
        return this.prisma.event.findMany({
            where,
            include: {
                files: true,
            },
            orderBy: {
                eventDate: 'desc',
            },
        });
    }
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                files: true,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }
    async update(id, updateEventDto, files, certificateFile) {
        await this.findOne(id);
        console.log('Updating event', id, 'files:', files?.length);
        const arrayFields = {};
        if (updateEventDto.eventHighlights) {
            try {
                arrayFields.eventHighlights = JSON.parse(updateEventDto.eventHighlights);
            }
            catch (e) {
            }
        }
        if (updateEventDto.studentCoordinators) {
            try {
                arrayFields.studentCoordinators = JSON.parse(updateEventDto.studentCoordinators);
            }
            catch (e) { }
        }
        if (updateEventDto.facultyCoordinators) {
            try {
                arrayFields.facultyCoordinators = JSON.parse(updateEventDto.facultyCoordinators);
            }
            catch (e) { }
        }
        if (updateEventDto.speakerHighlights) {
            try {
                arrayFields.speakerHighlights = JSON.parse(updateEventDto.speakerHighlights);
            }
            catch (e) { }
        }
        const { files: _files, eventCertificateImage, ...eventData } = updateEventDto;
        if (eventData.noOfParticipants) {
            eventData.noOfParticipants = parseInt(eventData.noOfParticipants);
        }
        const data = { ...eventData, ...arrayFields };
        if (updateEventDto.eventDate) {
            data.eventDate = new Date(updateEventDto.eventDate);
        }
        await this.prisma.event.update({
            where: { id },
            data: data,
        });
        if (files && files.length > 0) {
            console.log('Adding new event files...');
            const filePromises = files.map(file => this.prisma.eventFile.create({
                data: {
                    eventId: id,
                    fileData: new Uint8Array(file.buffer),
                },
            }));
            await Promise.all(filePromises);
            console.log(`Added ${files.length} new files for event ${id}`);
        }
        return this.prisma.event.findUnique({
            where: { id },
            include: {
                files: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.event.delete({
            where: { id },
        });
    }
    async uploadCertificate(eventId, certificateBuffer) {
        await this.findOne(eventId);
        return this.prisma.event.update({
            where: { id: eventId },
            data: {
                eventCertificateImage: new Uint8Array(certificateBuffer),
            },
        });
    }
    async getCertificate(eventId) {
        const event = await this.findOne(eventId);
        if (!event.eventCertificateImage) {
            throw new common_1.NotFoundException(`Certificate not found for event ${eventId}`);
        }
        return event.eventCertificateImage;
    }
    async addFile(eventId, fileBuffer) {
        await this.findOne(eventId);
        return this.prisma.eventFile.create({
            data: {
                eventId,
                fileData: new Uint8Array(fileBuffer),
            },
        });
    }
    async getFile(fileId) {
        const file = await this.prisma.eventFile.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new common_1.NotFoundException(`File with ID ${fileId} not found`);
        }
        return file;
    }
    async removeFile(fileId) {
        const file = await this.prisma.eventFile.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new common_1.NotFoundException(`File with ID ${fileId} not found`);
        }
        return this.prisma.eventFile.delete({
            where: { id: fileId },
        });
    }
    async getUpcomingEvents() {
        const now = new Date();
        return this.prisma.event.findMany({
            where: {
                eventDate: {
                    gte: now,
                },
                status: 'upcoming',
            },
            include: {
                files: true,
            },
            orderBy: {
                eventDate: 'asc',
            },
        });
    }
    async getPastEvents() {
        const now = new Date();
        return this.prisma.event.findMany({
            where: {
                eventDate: {
                    lt: now,
                },
                status: 'completed',
            },
            include: {
                files: true,
            },
            orderBy: {
                eventDate: 'desc',
            },
        });
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map