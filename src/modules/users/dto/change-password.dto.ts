import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6, { message: 'Пароль має містити не менше 6 символів' })
  password: string;
}
