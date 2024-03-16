import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { TaskStatus } from '../interfaces/tasks.interface';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret, options) => {
      delete ret.__v;
    },
  },
})
export class Task {
  @Prop({ type: String, required: true, index: 1 })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    index: 1,
    ref: User.name.toLowerCase(),
  })
  assignedUser: string;

  @Prop({
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Prop({ type: Date })
  dueDate?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
