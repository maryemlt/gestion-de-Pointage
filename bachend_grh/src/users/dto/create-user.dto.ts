import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsEnum(['admin', 'employe', 'stagiaire'])
  role?: string;

  @IsOptional()
  @IsString()
  poste?: string;

  @IsOptional()
  qrCode?: string;

  @IsOptional()
  faceData?: string;

  @IsOptional()
  localisationAutorisee?: {
    lat: number;
    lng: number;
  };
}
