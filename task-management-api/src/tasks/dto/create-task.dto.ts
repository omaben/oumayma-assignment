import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsEnum } from "class-validator";
import { TaskStatus } from "src/common/task.status.enum";

export class CreateTaskDto {
    @IsString()
    @ApiProperty({ example: 'test' })
    @MinLength(4)
    @MaxLength(20)
    @IsNotEmpty()
    title: string;

    @IsString()
    @ApiProperty({ example: 'test' })
    @IsOptional()
    description?: string;

    @IsDate()
    @ApiProperty({ example: '2024-10-23T10:00:00.000Z' })
    @IsOptional()
    date?: Date;

    // Add status field with enum validation
    @IsEnum(TaskStatus)
    @ApiProperty({ 
        example: TaskStatus.NOT_STARTED, 
        enum: TaskStatus, 
        description: 'Status of the task' 
    })
    @IsOptional()  // Optional by default is NOT_STARTED
    status?: TaskStatus;
}
