import { registerAs } from '@nestjs/config';
import { IsInt, IsPositive } from 'class-validator';

export class HealthVariables {
    @IsInt()
    @IsPositive()
    SHUTDOWN_DELAY_MS!: number;
}

export default registerAs('health', () => ({
    shutDownDelayMs: process.env['SHUTDOWN_DELAY_MS'],
}));
