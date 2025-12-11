# Use Bun official image (includes Node-compatible runtime)
FROM oven/bun:1.1.22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package.json ./

# Install dependencies with Bun (super fast)
RUN bun install

# Copy all source files
COPY . .

# Build the Vite project
RUN bun run build

# Expose the Vite preview port
EXPOSE 5174

# Start the built app
CMD ["bun", "run", "preview"]
