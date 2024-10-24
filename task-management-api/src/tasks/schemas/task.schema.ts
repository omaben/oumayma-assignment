import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Schema as MongooseSchema, Types } from 'mongoose';
import { TaskStatus } from 'src/common/task.status.enum';

export type TaskDocument = Task & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Task {
  @Prop({ required: true, index: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  due_date: Date;

  @Prop({ type: Boolean, required: true })
  isDeleted: boolean;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.NOT_STARTED })
  status: TaskStatus;
  
  // Add assignee field referencing User
  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignee: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId; // Use Types.ObjectId for type safety

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId; // Use Types.ObjectId for type safety

}

const TaskSchema = SchemaFactory.createForClass(Task);

export { TaskSchema };

