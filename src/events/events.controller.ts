import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/superadmin.guard';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 20 },
        { name: 'eventCertificateImage', maxCount: 1 },
      ],
      {
        // allow large text fields in the multipart form, sometimes clients
        // accidentally send base64/JSON under a field named "files"; the
        // default 1MB limit causes a LIMIT_FIELD_VALUE error.  bumping the
        // limit here prevents the 400 seen on update operations.
        limits: {
          fieldSize: 50 * 1024 * 1024, // 50MB
          fileSize: 100 * 1024 * 1024, // 100MB per file
        },
      },
    ),
  )
  create(
    @Body() createEventDto: any,
    @UploadedFiles()
    uploadedFiles: {
      files?: Express.Multer.File[];
      eventCertificateImage?: Express.Multer.File[];
    },
  ) {
    console.log('Received event with files:', uploadedFiles);
    const files = uploadedFiles?.files || [];
    const certificateFile = uploadedFiles?.eventCertificateImage?.[0];
    return this.eventsService.create(createEventDto, files, certificateFile);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('eventType') eventType?: string,
    @Query('year') year?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('includeFiles') includeFiles?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 6;
    const inc = includeFiles === 'true';

    return this.eventsService.findAll({
      status,
      eventType,
      year,
      page: p,
      limit: l,
      includeFiles: inc,
    });
  }

  @Get('upcoming')
  getUpcoming() {
    return this.eventsService.getUpcomingEvents();
  }

  @Get('past')
  getPast() {
    return this.eventsService.getPastEvents();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 20 },
        { name: 'eventCertificateImage', maxCount: 1 },
      ],
      {
        limits: {
          fieldSize: 50 * 1024 * 1024,
          fileSize: 100 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
          // only accept actual files; if client sends a text field named
          // 'files' (e.g. base64 string) multer will treat it as a field not
          // a file, but we can't intercept that here.  fileFilter just ensures
          // we only process valid mimetypes for safety.
          if (!file.mimetype) return cb(null, false);
          cb(null, true);
        },
      },
    ),
  )
  update(
    @Param('id') id: string,
    @Body() updateEventDto: any,
    @UploadedFiles()
    uploadedFiles: {
      files?: Express.Multer.File[];
      eventCertificateImage?: Express.Multer.File[];
    },
  ) {
    console.log('Updating event with files:', uploadedFiles);
    const files = uploadedFiles?.files || [];
    const certificateFile = uploadedFiles?.eventCertificateImage?.[0];
    return this.eventsService.update(
      id,
      updateEventDto,
      files,
      certificateFile,
    );
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  // Certificate endpoints
  @UseGuards(JwtAuthGuard)
  @Post(':id/certificate')
  @UseInterceptors(FileInterceptor('certificate'))
  uploadCertificate(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventsService.uploadCertificate(id, file.buffer);
  }

  @Get(':id/certificate')
  async getCertificate(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const certificate = await this.eventsService.getCertificate(id);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(Buffer.from(certificate));
  }

  // File endpoints
  @UseGuards(JwtAuthGuard)
  @Post(':id/files')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventsService.addFile(id, file.buffer);
  }

  @Get('files/:fileId')
  async getFile(
    @Param('fileId') fileId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.eventsService.getFile(fileId);
    res.set({
      'Content-Type': 'application/pdf', // Adjust based on file type
      'Content-Disposition': 'attachment',
    });
    return new StreamableFile(Buffer.from(file.fileData));
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete('files/:fileId')
  removeFile(@Param('fileId') fileId: string) {
    return this.eventsService.removeFile(fileId);
  }

  // Optimized image endpoints
  @Get(':id/image/:fileIndex')
  async getEventImage(
    @Param('id') id: string,
    @Param('fileIndex') fileIndex: string,
    @Query('size') size?: string,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const index = parseInt(fileIndex, 10);
    const imageBuffer = await this.eventsService.getEventImageByIndex(id, index, size);
    
    if (res) {
      res.set({
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, immutable', // 24 hours
        'ETag': `"event-${id}-${index}-${size || 'original'}"`,
      });
    }
    
    return new StreamableFile(imageBuffer);
  }

  @Get(':id/thumbnail/:fileIndex')
  async getEventThumbnail(
    @Param('id') id: string,
    @Param('fileIndex') fileIndex: string,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const index = parseInt(fileIndex, 10);
    const imageBuffer = await this.eventsService.getEventImageByIndex(id, index, '300');
    
    if (res) {
      res.set({
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=604800, immutable', // 7 days
        'ETag': `"event-thumb-${id}-${index}"`,
      });
    }
    
    return new StreamableFile(imageBuffer);
  }
}
