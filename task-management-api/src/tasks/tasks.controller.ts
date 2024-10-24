import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { IpGuard } from 'src/auth/ip.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { IdParamDto } from 'src/common/id-param.dto';
import { Role } from 'src/common/user.role.enum';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskListDto } from './dto/list-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schemas/task.schema';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @ApiOperation({
    summary: 'Create task',
    description: 'Create task by <b>admin</b> role.'
  })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: UserDocument) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @ApiOperation({
    summary: 'List of tasks',
    description: 'Get a list of tasks by <b>admin</b> role.'
  })
  list(
    @Body() findTaskDto: TaskListDto,
  ) {
    return this.tasksService.list(findTaskDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get task details',
    description: 'Get the task details by <b>admin</b> role.'
  })
  async get(
    @Param() params: IdParamDto,
  ): Promise<Task> {
    return await this.tasksService.findOne(params.id as string);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({
    summary: 'Edit task',
    description: 'Edit task by <b>admin</b> role.'
  })
  async update(
    @Param() params: IdParamDto,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
    @GetUser() user: UserDocument
  ): Promise<User> {
    return await this.tasksService.update(params.id, updateTaskDto, user);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update task status',
    description: 'Update the status of a task by <b>admin</b> role.',
  })
  async updateStatus(
    @Param() params: IdParamDto,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: UserDocument
  ): Promise<Task> {
    return await this.tasksService.updateStatus(params.id, updateTaskStatusDto.status, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({
    summary: 'Delete task',
    description: 'Soft delete task by <b>admin</b> role.'
  })
  async delete(
    @Param() params: IdParamDto,
    @Req() req,
    @GetUser() user: UserDocument
  ): Promise<Task> {
    return await this.tasksService.delete(params.id, user, req);
  }
}
