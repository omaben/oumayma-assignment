import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from 'src/common/task.status.enum';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Role } from 'src/common/user.role.enum';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  const mockCreateTaskDto: CreateTaskDto = {
    title: 'Test Task',
    description: 'This is a test task',
    date: new Date('2024-10-23T10:00:00.000Z'),
    status: TaskStatus.NOT_STARTED,
    assignee: '614c1b6182f5a33c7cf14d23',
  };

  const mockUser: UserDocument = {
    _id: '614c1b6182f5a33c7cf14d22',
    username: 'testUser',
    role: Role.ADMIN,
    // ...other user properties
  } as UserDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn().mockResolvedValue({ ...mockCreateTaskDto, id: 'task1' }),
            list: jest.fn().mockResolvedValue([mockCreateTaskDto]),
            findOne: jest.fn().mockResolvedValue(mockCreateTaskDto),
            update: jest.fn().mockResolvedValue({ ...mockCreateTaskDto, title: 'Updated Title' }),
            updateStatus: jest.fn().mockResolvedValue({ ...mockCreateTaskDto, status: TaskStatus.IN_PROGRESS }),
            assigneTask: jest.fn().mockResolvedValue({ ...mockCreateTaskDto, assignee: 'newAssigneeId' }),
            delete: jest.fn().mockResolvedValue({ ...mockCreateTaskDto, isDeleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call TasksService.create with correct parameters', async () => {
      const result = await controller.create(mockCreateTaskDto, mockUser);
      expect(tasksService.create).toHaveBeenCalledWith(mockCreateTaskDto, mockUser);
      expect(result).toEqual({ ...mockCreateTaskDto, id: 'task1' });
    });
  });

  describe('list', () => {
    it('should return a list of tasks', async () => {
      const result = await controller.list({ find: {}, limit: 25, page: 1 }, mockUser);
      expect(tasksService.list).toHaveBeenCalled();
      expect(result).toEqual([mockCreateTaskDto]);
    });
  });

  describe('get', () => {
    it('should return task details', async () => {
      const result = await controller.get({ id: 'task1' });
      expect(tasksService.findOne).toHaveBeenCalledWith('task1');
      expect(result).toEqual(mockCreateTaskDto);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateDto = { title: 'Updated Title' };
      const result = await controller.update({ id: 'task1' }, updateDto, {}, mockUser);
      expect(tasksService.update).toHaveBeenCalledWith('task1', updateDto, mockUser);
      expect(result).toEqual({ ...mockCreateTaskDto, title: 'Updated Title' });
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      const statusDto = { status: TaskStatus.IN_PROGRESS };
      const result = await controller.updateStatus({ id: 'task1' }, statusDto, mockUser);
      expect(tasksService.updateStatus).toHaveBeenCalledWith('task1', statusDto, mockUser);
      expect(result).toEqual({ ...mockCreateTaskDto, status: TaskStatus.IN_PROGRESS });
    });
  });

  describe('assigneTask', () => {
    it('should assign a task', async () => {
      const assigneeDto = { assignee: 'newAssigneeId' };
      const result = await controller.assigneTask({ id: 'task1' }, assigneeDto, mockUser);
      expect(tasksService.assigneTask).toHaveBeenCalledWith('task1', assigneeDto, mockUser);
      expect(result).toEqual({ ...mockCreateTaskDto, assignee: 'newAssigneeId' });
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const result = await controller.delete({ id: 'task1' }, {}, mockUser);
      expect(tasksService.delete).toHaveBeenCalledWith('task1', mockUser, {});
      expect(result).toEqual({ ...mockCreateTaskDto, isDeleted: true });
    });
  });
});
