/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ApiResponse = {
    description: `Standard API response format`,
    properties: {
        message: {
            type: 'string',
            isRequired: true,
        },
        status: {
            type: 'string',
        },
        data: {
            type: 'any-of',
            contains: [{
                type: 'dictionary',
                contains: {
                    properties: {
                    },
                },
            }, {
                type: 'null',
            }],
        },
    },
} as const;
