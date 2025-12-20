export class EnvironmentValidationError extends Error {
    constructor(message: string) {
        super(`Environment Validation Error: ${message}`);
    }
}
