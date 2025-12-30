import { IsString, IsNotEmpty } from 'class-validator';

export class CreateQuestionBankDto {
  @IsString()
  @IsNotEmpty()
  topicName: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}
