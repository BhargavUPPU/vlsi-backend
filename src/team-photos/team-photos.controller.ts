import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TeamPhotosService } from './team-photos.service';
import { CreateTeamPhotoDto } from './dto/create-team-photo.dto';
import { UpdateTeamPhotoDto } from './dto/update-team-photo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teamPhotos')
export class TeamPhotosController {
	constructor(private readonly teamPhotosService: TeamPhotosService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	@UseInterceptors(FileInterceptor('image'))
	create(
		@Body() createTeamPhotoDto: CreateTeamPhotoDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (!file) throw new Error('Image file is required');
		return this.teamPhotosService.create(createTeamPhotoDto.academicYear, file.buffer);
	}

	@Get()
	findAll() {
		return this.teamPhotosService.findAll();
	}

	@Get('year/:year')
	findByYear(@Param('year') year: string) {
		return this.teamPhotosService.findByYear(year);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.teamPhotosService.findOne(id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	@UseInterceptors(FileInterceptor('image'))
	update(
		@Param('id') id: string,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (!file) throw new Error('Image file is required');
		return this.teamPhotosService.update(id, file.buffer);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.teamPhotosService.remove(id);
	}

	@Get(':id/image')
	async getImage(@Param('id') id: string) {
		const imageData = await this.teamPhotosService.getImage(id);
		return Buffer.from(imageData);
	}
}
