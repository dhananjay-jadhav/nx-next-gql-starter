import axios from 'axios';

describe('Health Endpoints', () => {
    describe('GET /health/liveness', () => {
        it('should return 200 status code', async () => {
            const res = await axios.get('/health/liveness');

            expect(res.status).toBe(200);
        });

        it('should return ok status in response body', async () => {
            const res = await axios.get('/health/liveness');

            expect(res.data.status).toBe('ok');
        });

        it('should return proper health check structure', async () => {
            const res = await axios.get('/health/liveness');

            expect(res.data).toEqual({
                status: 'ok',
                info: {},
                error: {},
                details: {},
            });
        });

        it('should have correct content-type header', async () => {
            const res = await axios.get('/health/liveness');

            expect(res.headers['content-type']).toContain('application/json');
        });
    });

    describe('GET /health/readiness', () => {
        it('should return 200 status code when application is ready', async () => {
            const res = await axios.get('/health/readiness');

            expect(res.status).toBe(200);
        });

        it('should return ok status in response body', async () => {
            const res = await axios.get('/health/readiness');

            expect(res.data.status).toBe('ok');
        });

        it('should include application_status in health check details', async () => {
            const res = await axios.get('/health/readiness');

            expect(res.data.details).toHaveProperty('application_status');
            expect(res.data.details.application_status.status).toBe('up');
        });

        it('should include application_status in info when healthy', async () => {
            const res = await axios.get('/health/readiness');

            expect(res.data.info).toHaveProperty('application_status');
            expect(res.data.info.application_status.status).toBe('up');
        });

        it('should return proper health check structure', async () => {
            const res = await axios.get('/health/readiness');

            expect(res.data).toEqual({
                status: 'ok',
                info: {
                    application_status: { status: 'up' },
                },
                error: {},
                details: {
                    application_status: { status: 'up' },
                },
            });
        });

        it('should have correct content-type header', async () => {
            const res = await axios.get('/health/readiness');

            expect(res.headers['content-type']).toContain('application/json');
        });
    });

    describe('Health endpoints error handling', () => {
        it('should return 404 for non-existent health endpoint', async () => {
            try {
                await axios.get('/health/nonexistent');
                fail('Expected request to fail with 404');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    expect(error.response?.status).toBe(404);
                } else {
                    throw error;
                }
            }
        });

        it('should return 404 for root health endpoint', async () => {
            try {
                await axios.get('/health');
                fail('Expected request to fail with 404');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    expect(error.response?.status).toBe(404);
                } else {
                    throw error;
                }
            }
        });
    });
});
