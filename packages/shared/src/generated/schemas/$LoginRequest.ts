/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LoginRequest = {
    description: `Schema for user login request`,
    properties: {
        email: {
            type: 'string',
            isRequired: true,
        },
        password: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
