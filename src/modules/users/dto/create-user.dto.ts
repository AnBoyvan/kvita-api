import { IsString, Matches, MinLength } from 'class-validator';
import { emailRegexp, phoneRegexp } from 'src/constants/user.constants';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(emailRegexp, { message: 'Невірно вказано пошту' })
  email: string;

  @IsString()
  @Matches(phoneRegexp, { message: 'Невірно вказано телефон' })
  phone: string;

  @IsString()
  @MinLength(6, { message: 'Пароль має містити не менше 6 символів' })
  password: string;

  @IsString()
  accessToken: string;
}
