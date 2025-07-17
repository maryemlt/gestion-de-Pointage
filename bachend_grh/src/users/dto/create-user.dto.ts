import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  motDePasse: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsString()
  poste?: string;
}
