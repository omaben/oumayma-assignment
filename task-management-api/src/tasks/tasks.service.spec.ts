import { BadRequestException, Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TaskStatus } from 'src/common/task.status.enum';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskDocument } from './schemas/task.schema';
import { TasksService } from './tasks.service';
import { Role } from 'src/common/user.role.enum';

jest.setTimeout(30000); // Increase timeout

describe('TasksService', () => {
  let service: TasksService;
  let taskModel: Model<TaskDocument>;
  let logger: Logger;

  const mockTaskModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue([]), // Mock the final call to return an array or the expected result
            }),
          }),
        }),
      }),
    }),
  };

  const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
  };

  const mockUser: UserDocument = {
    _id: new Types.ObjectId(),
    role: Role.ADMIN,
    username: 'adminUser',
  } as UserDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task.name), useValue: mockTaskModel },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskModel = module.get<Model<TaskDocument>>(getModelToken(Task.name));
    logger = module.get<Logger>(WINSTON_MODULE_PROVIDER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test the create new task Method
  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        status: TaskStatus.NOT_STARTED,
        date: new Date(),
      };

      const createdTask = { _id: new Types.ObjectId(), ...createTaskDto, createdBy: mockUser._id, isDeleted: false };
      mockTaskModel.create.mockResolvedValue(createdTask);

      const result = await service.create(createTaskDto, mockUser);

      expect(result).toEqual(createdTask);
      expect(mockTaskModel.create).toHaveBeenCalledWith({
        ...createTaskDto,
        createdBy: mockUser._id,
        isDeleted: false,
      });
      expect(logger.debug).toHaveBeenCalled();
    });

    it('should handle errors during task creation', async () => {
      // Mock taskModel.create to throw an error
      jest.spyOn(taskModel, 'create').mockImplementationOnce(() => {
        throw new Error('Database Error');
      });

      const createTaskDto: CreateTaskDto = { title: 'New Task', status: TaskStatus.NOT_STARTED };

      await expect(service.create(createTaskDto, mockUser)).rejects.toThrow('Database Error');
      expect(logger.error).toHaveBeenCalled(); // Ensure the error log is also checked
    });

  });

  // Test the list tasks Method
  describe('list', () => {
    it('should return a list of tasks with count', async () => {
      const taskListDto = { find: { title: 'Task' }, page: 1, limit: 5 };
      const tasks = [{ _id: new Types.ObjectId(), title: 'Task' }];

      // Set up countDocuments to return the expected count
      mockTaskModel.countDocuments.mockResolvedValue(1);

      // Make sure the mock structure is correctly set
      const findMock = mockTaskModel.find();
      findMock.select().sort().skip().limit().lean.mockResolvedValue(tasks);

      const result = await service.list(taskListDto, mockUser);

      expect(result).toEqual({ count: 1, tasks });
      expect(mockTaskModel.find).toHaveBeenCalled();
      expect(logger.debug).toHaveBeenCalled();
    });

    it('should handle errors during task listing', async () => {
      // Mock taskModel.create to throw an error
      jest.spyOn(mockTaskModel, 'find').mockImplementationOnce(() => {
        throw new Error('Database Error');
      });
      await expect(service.list({ find: {}, limit: 25, page: 1 }, mockUser)).rejects.toThrow(BadRequestException);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  // TODO (oumayma): add more tests for other methods
});
