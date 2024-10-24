import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/user.role.enum';

export type UserDocument = User & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class User {
  @Prop({ type: String, index: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: Role, required: true })
  role: Role;

  @Prop({ type: String, index: true })
  avatar: string;

  @Prop({ type: Boolean, required: true })
  isDeleted: boolean;

  @Prop({ type: Date, index: true })
  createdAt?: Date;

  @Prop({ type: Date, index: true })
  updatedAt?: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
