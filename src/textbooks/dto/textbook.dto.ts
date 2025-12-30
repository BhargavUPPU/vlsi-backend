import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTextbookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}

export class UpdateTextbookDto {
  name?: string;
  description?: string;
  subject?: string;
  author?: string;
  link?: string;
}
