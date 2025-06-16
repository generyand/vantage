/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectList = {
    description: `Schema for project list response`,
    properties: {
        projects: {
            type: 'array',
            contains: {
                type: 'Project',
            },
            isRequired: true,
        },
        total: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
