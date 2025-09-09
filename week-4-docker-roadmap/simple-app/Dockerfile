# --------------------------
# 1. Use official Node.js base image
# --------------------------
FROM node:18

# --------------------------
# 2. Set working directory inside container
# All commands run inside /usr/src/app
# --------------------------
WORKDIR /usr/src/app/dist

# --------------------------
# 3. Copy only package.json + package-lock.json first
# This helps Docker cache dependencies if code changes but package.json does not
# --------------------------
COPY . .

# --------------------------
# 4. Install dependencies
# Example: installs express, etc.
# --------------------------
RUN npm install

# --------------------------
# 5. Copy the rest of the application files
# --------------------------
COPY . .

# --------------------------
# 6. Expose application port
# Example: Node app runs on port 3000
# --------------------------
EXPOSE 3000

# --------------------------
# 7. Start the app
# --------------------------
CMD ["node", "index.js"]
