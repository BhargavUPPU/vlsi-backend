import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsString()
  aboutEvent?: string;

  @IsOptional()
  @IsString()
  eventRegistrationLink?: string;

  @IsOptional()
  @IsString()
  eventPdfLink?: string;

  @IsOptional()
  @IsString()
  eventVideoLink?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  })
  @Type(() => Number)
  @IsInt()
  noOfParticipants?: number;

  @IsDateString()
  @IsNotEmpty()
  eventDate: string;

  @IsNotEmpty()
  eventHighlights: any; // JSON

  @IsNotEmpty()
  studentCoordinators: any; // JSON

  @IsNotEmpty()
  facultyCoordinators: any; // JSON

  @IsString()
  @IsNotEmpty()
  status: string; // "upcoming", "completed"

  @IsOptional()
  @IsString()
  speakerName?: string;

  @IsOptional()
  @IsString()
  speakerDescription?: string;

  @IsNotEmpty()
  speakerHighlights: any; // JSON
}
