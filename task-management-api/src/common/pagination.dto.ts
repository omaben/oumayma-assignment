import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, Max, Min } from 'class-validator';
export class PaginationDto {
    @ApiProperty({ example: 20, description: 'Maximums is 50.' })
    @IsPositive()
    @Min(1)
    @Max(50)
    limit: number = 20;

    @ApiProperty({ example: 1, description: 'Start from 1.' })
    @IsPositive()
    @Min(1)
    @Max(50)
    page: number = 1;
}
