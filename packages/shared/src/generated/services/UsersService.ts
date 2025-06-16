/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UsersService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get Current User
     * @returns User Successful Response
     * @throws ApiError
     */
    public getCurrentUserApiUsersMeGet(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/users/me',
        });
    }
}
