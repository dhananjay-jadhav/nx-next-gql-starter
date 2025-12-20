import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { EnvironmentValidationError } from '../errors/errors';

export function createValidator<T extends object>(EnvironmentVariables: new () => T) {
    return (config: Record<string, unknown>): T => {
        const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
        const errors = validateSync(validatedConfig, { skipMissingProperties: false });

        if (errors.length > 0) {
            throw new EnvironmentValidationError(errors.toString());
        }
        return validatedConfig;
    };
}
