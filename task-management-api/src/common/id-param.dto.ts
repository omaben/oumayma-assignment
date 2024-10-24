import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsMongoId, IsString } from "class-validator";
import mongoose from "mongoose";
import { ApiProperty } from '@nestjs/swagger';

export const SafeMongoIdTransform = ({ value }) => {
    try {
        if (
            mongoose.Types.ObjectId.isValid(value) &&
            new mongoose.Types.ObjectId(value).toString() === value
        ) {
            return value;
        }
        throw new BadRequestException('Id validation fail');
    } catch (error) {
        throw new BadRequestException('Id validation fail');
    }
};

export class IdParamDto {
    @IsMongoId()
    @IsString()
    @ApiProperty({ example: '6346bce4f8d2f058006aa9f1' })
    @Transform((value) => SafeMongoIdTransform(value))
    id: string;
}