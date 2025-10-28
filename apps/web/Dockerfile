# Multi-stage Dockerfile for Next.js Frontend
# Optimized for development with pnpm

# Stage 1: Base image with pnpm
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@latest

# Set working directory
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps

# Copy root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy dependency files for all workspaces
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Stage 3: Development
FROM deps AS development

# Copy all source code
COPY . .

# Set working directory to web app for development
WORKDIR /app/apps/web

# Development command with hot reload
CMD ["pnpm", "dev", "--turbopack"]

