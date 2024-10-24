import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ErrorFunction } from 'src/common/error';
import { TaskStatus } from 'src/common/task.status.enum';
import { UserDocument } from 'src/users/schemas/user.schema';
import { AssigneTaskDto } from './dto/assigne-task';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskListDto } from './dto/list-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksService {

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  async create(createTaskDto: CreateTaskDto, by: UserDocument,) {
    try {

      const createdTask = await this.taskModel.create({
        ...createTaskDto,
        status: createTaskDto.status ?? TaskStatus.NOT_STARTED,  // Set default status if not provided
        createdBy: new Types.ObjectId(by._id.toString()),
        isDeleted: false
      });

      this.logger.debug({
        type: 'TasksServices',
        title: 'addTask',
        message: `Add new task.`,
        tag: `task,addTask,add,`,
        meta: {
          createTaskDto
        }
      })
      return createdTask;
    } catch (err) {
      this.logger.error({
        type: 'TasksService',
        title: 'addTask',
        message: `Add new task.`,
        tag: `task,addTask,add,`,
        meta: {
          createTaskDto,
          errorMessage: err.message,
          stack: err.stack
        }
      })
      return ErrorFunction(err)
    }
  }


  async list(findTaskDto: TaskListDto): Promise<{
    count: number,
    tasks: Task[]
  }> {
    try {
      const { find, page, limit } = findTaskDto;
      const { id, date, description, title, status, assignee, updatedBy, createdBy } = find || {};
      const countTasks = await this.taskModel.countDocuments({
        isDeleted: false,
        ...(id && { _id: id }),
        ...(title && { title: title }),
        ...(status && { status: status }),
        ...(description && { description: description }),
        ...(date && { date: date }),
        ...(assignee && { assignee: new Types.ObjectId(assignee.toString()) }),
        ...(createdBy && { createdBy: new Types.ObjectId(createdBy.toString()) }),
        ...(updatedBy && { updatedBy: new Types.ObjectId(updatedBy.toString()) })

      });
      const tasks = await this.taskModel.find({
        isDeleted: false,
        ...(id && { _id: id }),
        ...(title && { title: title }),
        ...(status && { status: status }),
        ...(description && { description: description }),
        ...(date && { date: date }),
        ...(assignee && { assignee: new Types.ObjectId(assignee.toString()) }),
        ...(createdBy && { createdBy: new Types.ObjectId(createdBy.toString()) }),
        ...(updatedBy && { updatedBy: new Types.ObjectId(updatedBy.toString()) })
      }).select({
        __v: 0
      }).sort({ 'updatedAt': -1 })
        .skip(
          (page - 1) * limit
        ).limit(
          limit
        ).lean();
      if (tasks && countTasks) {
        this.logger.debug({
          type: 'TaskServices',
          title: 'task List',
          message: `Get list of tasks.`,
          tag: `task,listTask,list,`,
          meta: {
            findTaskDto
          }
        })
      }

      return {
        count: countTasks,
        tasks: tasks
      }
    } catch (error) {
      this.logger.error({
        type: 'TaskServices',
        title: 'task List',
        message: `Get list of tasks.`,
        tag: `task,listTask,list,`,
        meta: {
          findTaskDto,
          errorMessage: error.message,
          stack: error.stack
        }
      })
      throw new BadRequestException();
    }
  }

  async findOne(task_id: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findOne({
        ...(task_id && { _id: task_id }),
        isDeleted: false
      })
      .lean();
    this.logger.debug({
      type: 'TasksService',
      title: 'findTask',
      message: `Get task detail ${task_id}.`,
      tag: `task,details`,
      meta: {
        _id: task_id
      }
    })
    if (!task) {
      throw new BadRequestException('Task not found.');
    } else {
      return task as TaskDocument;
    }
  }

  async update(
    task_id: string,
    updateTaskDto: UpdateTaskDto,
    by: UserDocument,
  ): Promise<any> {
    try {
      const newTask = await this.taskModel
        .findOneAndUpdate(
          {
            _id: task_id,
            isDeleted: false
          },
          { $set: { ...updateTaskDto, updatedBy: new Types.ObjectId(by._id.toString()) } },
          { new: true })
        .lean();
      if (!newTask) {
        throw new BadRequestException('task not found.');
      } else {
        this.logger.debug({
          type: 'TasksServices',
          title: 'updateTask',
          message: `Edit task ${task_id} by ${by._id} (${by.username}).`,
          tag: `task, editTask`,
          meta: {
            _id: task_id,
            updateTaskDto
          }
        })
        return newTask;
      }
    } catch (err) {
      this.logger.error({
        type: 'TasksServices',
        title: 'updateTask',
        message: `Edit task ${task_id} by ${by._id} (${by.username}).`,
        tag: `task, editTask`,
        meta: {
          _id: task_id,
          updateTaskDto,
          errorMessage: err.message,
          stack: err.stack
        }
      })
      return ErrorFunction(err)
    }

  }

  async updateStatus(task_id: string, updateStatus: UpdateTaskStatusDto, user: UserDocument): Promise<Task> {
    const task = await this.taskModel.findOne({
      ...(task_id && { _id: task_id }),
      isDeleted: false
    });

    if (!task) {
      throw new BadRequestException('Task not found.');
    }

    task.status = updateStatus.status;
    task.updatedBy = new Types.ObjectId(user._id.toString()); // Convert user._id to ObjectId
    return task.save();
  }

  async assigneTask(task_id: string, assignTask: AssigneTaskDto, user: UserDocument): Promise<Task> {
    const task = await this.taskModel.findOne({
      ...(task_id && { _id: task_id }),
      isDeleted: false
    });

    if (!task) {
      throw new BadRequestException('Task not found.');
    }

    task.assignee = new Types.ObjectId(assignTask.assignee.toString());
    task.updatedBy = new Types.ObjectId(user._id.toString()); // Convert user._id to ObjectId
    return task.save();
  }

  async delete(task_id: string, by: UserDocument, req: any): Promise<Task> {
    const newTask = await this.taskModel
      .findOneAndUpdate(
        { _id: task_id, isDeleted: false },
        { $set: { isDeleted: true, updatedBy: new Types.ObjectId(by._id.toString()) } },
        { new: true }
      )
      .lean();
    if (!newTask) {
      throw new BadRequestException('Task not found.');
    } else {
      this.logger.debug({
        type: 'TasksServices',
        title: 'deleteTask',
        message: `Delete task ${task_id} by ${by._id} (${by.username}).`,
        tag: `task, deleteTask`,
        meta: {
          _id: task_id,
        }
      })
      return newTask
    }
  }
}
