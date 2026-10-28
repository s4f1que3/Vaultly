import { BadRequestException, ConflictException, ForbiddenException, HttpException, NotFoundException, InternalServerErrorException, ServiceUnavailableException } from "@nestjs/common";


const Error_Map: Record <string, () => HttpException> = {
    '23505': () => new ConflictException('Already exists'),
    '23514': () => new BadRequestException('Constraint Violated'),
    '23503': () => new BadRequestException('Invalid reference'),
    '23502': () => new BadRequestException('Missing required field'),
    '22001': () => new BadRequestException('Value too long'),
    '53300': () => new ServiceUnavailableException('Service unavailable'),
    '22P02': () => new BadRequestException('Invalid input'),
    '42501': () => new ForbiddenException(),
    'PGRST116': () => new NotFoundException(),
}

export const ToHttpException = (error: {code?: string, message: string}) => {
    return Error_Map[error.code ?? '']?.() ?? new InternalServerErrorException()
}