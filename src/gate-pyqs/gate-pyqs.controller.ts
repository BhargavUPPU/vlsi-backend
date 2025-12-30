import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { GatePyqsService } from './gate-pyqs.service';
import { CreateGatePyqDto } from './dto/create-gate-pyq.dto';
import { UpdateGatePyqDto } from './dto/update-gate-pyq.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gatePyqs')
export class GatePyqsController {
	constructor(private readonly gatePyqsService: GatePyqsService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Body() createGatePyqDto: CreateGatePyqDto) {
		return this.gatePyqsService.create(createGatePyqDto);
	}

	@Get()
	findAll() {
		return this.gatePyqsService.findAll();
	}

	@Get('year/:year')
	findByYear(@Param('year') year: string) {
		return this.gatePyqsService.findByYear(Number(year));
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.gatePyqsService.findOne(id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateGatePyqDto: UpdateGatePyqDto,
	) {
		return this.gatePyqsService.update(id, updateGatePyqDto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.gatePyqsService.remove(id);
	}
}
