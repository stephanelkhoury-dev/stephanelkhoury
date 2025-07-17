// Re-export types from Prisma for convenience
export * from './generated/prisma';

// Export the Prisma client instance
export { prisma } from './';

// Export shared database utilities (to be added as needed)
export const DatabaseError = class extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
};
