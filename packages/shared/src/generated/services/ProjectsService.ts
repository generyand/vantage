/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Project } from '../models/Project';
import type { ProjectCreate } from '../models/ProjectCreate';
import type { ProjectList } from '../models/ProjectList';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProjectsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get Projects
     * @returns ProjectList Successful Response
     * @throws ApiError
     */
    public getProjectsApiProjectsGet(): CancelablePromise<ProjectList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/projects',
        });
    }
    /**
     * Create Project
     * @returns Project Successful Response
     * @throws ApiError
     */
    public createProjectApiProjectsPost({
        requestBody,
    }: {
        requestBody: ProjectCreate,
    }): CancelablePromise<Project> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/projects',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
