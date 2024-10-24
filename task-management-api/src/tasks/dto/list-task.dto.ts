import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsMongoId, IsOptional, IsString, ValidateNested } from "class-validator";
import { PaginationDto } from "src/common/pagination.dto";
import { TaskStatus } from "src/common/task.status.enum";

export class FindTaskDto {
    @IsString()
    @ApiProperty()
    @IsOptional()
    id?: string;

    @IsString()
    @ApiProperty({ example: 'test' })
    @IsOptional()
    title?: string;

    @IsString()
    @ApiProperty({ example: 'test' })
    @IsOptional()
    description?: string;

    @IsDate()
    @ApiProperty({ example: '2024-10-23T10:00:00.000Z' })
    @IsOptional()
    date?: Date;

    @IsEnum(TaskStatus)
    @ApiProperty({ 
        example: TaskStatus.NOT_STARTED, 
        enum: TaskStatus, 
        description: 'Status of the task' 
    })
    @IsOptional()  // Optional by default is NOT_STARTED
    status?: TaskStatus;

    @IsMongoId()
    @ApiProperty({ example: '671a0649ee70eaf8364216c7', description: 'User ID of the assignee' })
    @IsOptional()
    assignee?: string;

    @IsMongoId()
    @ApiProperty({ example: '671a0649ee70eaf8364216c7', description: 'User ID of the created by' })
    @IsOptional()
    createdBy?: string;

    @IsMongoId()
    @ApiProperty({ example: '671a0649ee70eaf8364216c7', description: 'User ID of the updated by' })
    @IsOptional()
    updatedBy?: string;
}

export class TaskListDto extends PaginationDto {
    @ValidateNested()
    @Type(() => FindTaskDto)
    @ApiProperty()
    find: FindTaskDto;
}