import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  nom: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  motDePasse: string;

  @IsNotEmpty()
  role: string;

  poste?: string;
}
