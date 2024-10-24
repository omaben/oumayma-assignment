import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { TaskStatus } from 'src/common/task.status.enum';

export class AssigneTaskDto {
  @IsMongoId()
  @ApiProperty({ example: '614c1b6182f5a33c7cf14d23', description: 'User ID of the assignee' })
  assignee?: string;
}
