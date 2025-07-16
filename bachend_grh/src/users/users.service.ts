import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
  const saltOrRounds = 10;
  const hashedPassword = await bcrypt.hash(createUserDto.motDePasse, saltOrRounds);

  const newUser = new this.userModel({
    ...createUserDto,
    motDePasse: hashedPassword,
  });
  

  return newUser.save();
}


  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findByEmail(email: string): Promise<User | null> {
  return this.userModel.findOne({ email }).lean();
}

}
