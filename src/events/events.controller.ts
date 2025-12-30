import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 20 },
    { name: 'eventCertificateImage', maxCount: 1 },
  ]))
  create(
    @Body() createEventDto: any,
    @UploadedFiles() uploadedFiles: { files?: Express.Multer.File[], eventCertificateImage?: Express.Multer.File[] },
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
  ) {
    return this.eventsService.findAll({ status, eventType });
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
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 20 },
    { name: 'eventCertificateImage', maxCount: 1 },
  ]))
  update(
    @Param('id') id: string,
    @Body() updateEventDto: any,
    @UploadedFiles() uploadedFiles: { files?: Express.Multer.File[], eventCertificateImage?: Express.Multer.File[] },
  ) {
    console.log('Updating event with files:', uploadedFiles);
    const files = uploadedFiles?.files || [];
    const certificateFile = uploadedFiles?.eventCertificateImage?.[0];
    return this.eventsService.update(id, updateEventDto, files, certificateFile);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete('files/:fileId')
  removeFile(@Param('fileId') fileId: string) {
    return this.eventsService.removeFile(fileId);
  }
}
