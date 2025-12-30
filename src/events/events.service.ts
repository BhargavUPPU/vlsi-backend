
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: any, files?: Array<Express.Multer.File>, certificateFile?: Express.Multer.File) {
    console.log('========== CREATE EVENT DEBUG ==========');
    console.log('1. Received createEventDto:', JSON.stringify(createEventDto, null, 2));
    console.log('2. Files received:', files?.length, 'files');
    console.log('2a. Certificate file:', certificateFile ? 'YES' : 'NO');
    console.log('3. Raw eventHighlights:', createEventDto.eventHighlights);
    console.log('4. Raw studentCoordinators:', createEventDto.studentCoordinators);
    
    // Parse array fields (they come as JSON strings from FormData)
    const arrayFields: any = {};
    if (createEventDto.eventHighlights) {
      try {
        arrayFields.eventHighlights = JSON.parse(createEventDto.eventHighlights);
        console.log('5. Parsed eventHighlights:', arrayFields.eventHighlights);
      } catch (e) {
        console.log('5. Failed to parse eventHighlights:', e);
        arrayFields.eventHighlights = [];
      }
    }
    if (createEventDto.studentCoordinators) {
      try {
        arrayFields.studentCoordinators = JSON.parse(createEventDto.studentCoordinators);
        console.log('6. Parsed studentCoordinators:', arrayFields.studentCoordinators);
      } catch (e) {
        console.log('6. Failed to parse studentCoordinators:', e);
        arrayFields.studentCoordinators = [];
      }
    }
    if (createEventDto.facultyCoordinators) {
      try {
        arrayFields.facultyCoordinators = JSON.parse(createEventDto.facultyCoordinators);
        console.log('7. Parsed facultyCoordinators:', arrayFields.facultyCoordinators);
      } catch (e) {
        console.log('7. Failed to parse facultyCoordinators:', e);
        arrayFields.facultyCoordinators = [];
      }
    }
    if (createEventDto.speakerHighlights) {
      try {
        arrayFields.speakerHighlights = JSON.parse(createEventDto.speakerHighlights);
        console.log('8. Parsed speakerHighlights:', arrayFields.speakerHighlights);
      } catch (e) {
        console.log('8. Failed to parse speakerHighlights:', e);
        arrayFields.speakerHighlights = [];
      }
    }

    // Remove file-related fields and parse numbers
    const { files: _files, eventCertificateImage, ...eventData } = createEventDto;
    console.log('9. After filtering files/certificate:', Object.keys(eventData));
    
    // Parse number fields
    if (eventData.noOfParticipants) {
      eventData.noOfParticipants = parseInt(eventData.noOfParticipants);
      console.log('10. Parsed noOfParticipants:', eventData.noOfParticipants);
    }

    console.log('11. Final data to create:', { ...eventData, ...arrayFields });

    // Use transaction to ensure atomicity
    return await this.prisma.$transaction(async (tx) => {
      console.log('12. Starting transaction...');
      
      const event = await tx.event.create({
        data: {
          ...eventData,
          ...arrayFields,
          eventDate: new Date(createEventDto.eventDate),
          // Save certificate image if provided
          ...(certificateFile && {
            eventCertificateImage: new Uint8Array(certificateFile.buffer)
          }),
        },
      });

      console.log('12a. Event created with ID:', event.id);
      console.log('12b. Certificate saved:', certificateFile ? 'YES' : 'NO');

      // Save multiple files to EventFile table
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
        } catch (error) {
          console.error('ERROR saving files:', error);
          throw error;
        }
      } else {
        console.log('13. No files to save');
      }

      // Return event with files - within same transaction
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

  async findAll(filters?: { status?: string; eventType?: string }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.eventType) where.eventType = filters.eventType;

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

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        files: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: any, files?: Array<Express.Multer.File>, certificateFile?: Express.Multer.File) {
    await this.findOne(id);
    console.log('Updating event', id, 'files:', files?.length);

    // Parse array fields
    const arrayFields: any = {};
    if (updateEventDto.eventHighlights) {
      try {
        arrayFields.eventHighlights = JSON.parse(updateEventDto.eventHighlights);
      } catch (e) {
        // Already parsed or invalid
      }
    }
    if (updateEventDto.studentCoordinators) {
      try {
        arrayFields.studentCoordinators = JSON.parse(updateEventDto.studentCoordinators);
      } catch (e) {}
    }
    if (updateEventDto.facultyCoordinators) {
      try {
        arrayFields.facultyCoordinators = JSON.parse(updateEventDto.facultyCoordinators);
      } catch (e) {}
    }
    if (updateEventDto.speakerHighlights) {
      try {
        arrayFields.speakerHighlights = JSON.parse(updateEventDto.speakerHighlights);
      } catch (e) {}
    }

    // Remove file-related fields
    const { files: _files, eventCertificateImage, ...eventData } = updateEventDto;
    
    // Parse number fields
    if (eventData.noOfParticipants) {
      eventData.noOfParticipants = parseInt(eventData.noOfParticipants);
    }

    const data: any = { ...eventData, ...arrayFields };
    if (updateEventDto.eventDate) {
      data.eventDate = new Date(updateEventDto.eventDate);
    }

    await this.prisma.event.update({
      where: { id },
      data: data,
    });

    // Add new files if provided
    if (files && files.length > 0) {
      console.log('Adding new event files...');
      const filePromises = files.map(file =>
        this.prisma.eventFile.create({
          data: {
            eventId: id,
            fileData: new Uint8Array(file.buffer),
          },
        })
      );
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

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.event.delete({
      where: { id },
    });
  }

  // Certificate handling
  async uploadCertificate(eventId: string, certificateBuffer: Buffer) {
    await this.findOne(eventId);

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        eventCertificateImage: new Uint8Array(certificateBuffer),
      },
    });
  }

  async getCertificate(eventId: string) {
    const event = await this.findOne(eventId);

    if (!event.eventCertificateImage) {
      throw new NotFoundException(`Certificate not found for event ${eventId}`);
    }

    return event.eventCertificateImage;
  }

  // Event files handling
  async addFile(eventId: string, fileBuffer: Buffer) {
    await this.findOne(eventId);

    return this.prisma.eventFile.create({
      data: {
        eventId,
        fileData: new Uint8Array(fileBuffer),
      },
    });
  }

  async getFile(fileId: string) {
    const file = await this.prisma.eventFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    return file;
  }

  async removeFile(fileId: string) {
    const file = await this.prisma.eventFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    return this.prisma.eventFile.delete({
      where: { id: fileId },
    });
  }

  // Query by date range
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
}
