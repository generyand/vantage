/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse } from '../models/ApiResponse';
import type { AuthToken } from '../models/AuthToken';
import type { LoginRequest } from '../models/LoginRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Login
     * @returns AuthToken Successful Response
     * @throws ApiError
     */
    public loginApiAuthLoginPost({
        requestBody,
    }: {
        requestBody: LoginRequest,
    }): CancelablePromise<AuthToken> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Logout
     * @returns ApiResponse Successful Response
     * @throws ApiError
     */
    public logoutApiAuthLogoutPost(): CancelablePromise<ApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/logout',
        });
    }
}
