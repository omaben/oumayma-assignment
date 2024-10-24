import {
    IsAlphanumeric,
    IsEnum,
    IsLowercase,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from "class-validator";
import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { Role } from "../common/user.role.enum";
import { PaginationDto } from "src/common/pagination.dto";
import { Type } from "class-transformer";

export class FindUserDto {
    @IsString()
    @ApiProperty()
    @IsOptional()
    id?: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    username: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    role: Role;
}


export class UserListDto extends PaginationDto {
    @ValidateNested()
    @Type(() => FindUserDto)
    @ApiProperty()
    find: FindUserDto;
}

export class CreateUserDto {
    @IsString()
    @ApiProperty({ example: 'amanda' })
    @MinLength(4)
    @MaxLength(20)
    @IsNotEmpty()
    @IsAlphanumeric()
    @IsLowercase()
    username: string;

    @IsString()
    @ApiProperty({ example: '123456' })
    @MinLength(6)
    @MaxLength(20)
    @IsNotEmpty()
    password: string;

    @IsEnum(Role, { each: true })
    @ApiProperty({ enum: Role })
    role: Role;

    @IsString()
    @ApiProperty({ example: 'test.jpg' })
    avatar: string;
}

export class ChangeUserPasswordDto {
    @IsString()
    @ApiProperty({ example: '123456' })
    @MinLength(6)
    @MaxLength(20)
    @IsNotEmpty()
    password: string;
}

export class ChangeCurrentUserPasswordDto {
    @IsString()
    @ApiProperty({ example: '123456' })
    @MinLength(6)
    @MaxLength(20)
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @ApiProperty({ example: '123456' })
    @MinLength(6)
    @MaxLength(20)
    @IsNotEmpty()
    newPassword: string;
}
export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ['password'] as const) { }