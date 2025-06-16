/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AuthToken = {
    description: `Authentication token response`,
    properties: {
        access_token: {
            type: 'string',
            isRequired: true,
        },
        token_type: {
            type: 'string',
        },
        expires_in: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
