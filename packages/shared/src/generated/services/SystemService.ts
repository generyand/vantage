/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse } from '../models/ApiResponse';
import type { HealthCheck } from '../models/HealthCheck';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SystemService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Root
     * @returns ApiResponse Successful Response
     * @throws ApiError
     */
    public rootGet(): CancelablePromise<ApiResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Health Check
     * @returns HealthCheck Successful Response
     * @throws ApiError
     */
    public healthCheckHealthGet(): CancelablePromise<HealthCheck> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Hello
     * @returns ApiResponse Successful Response
     * @throws ApiError
     */
    public helloApiHelloGet(): CancelablePromise<ApiResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/hello',
        });
    }
}
