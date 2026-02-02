
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    // Log the database URL being used (if accessbile via env transparently)
    console.log('Env DATABASE_URL:', process.env.DATABASE_URL);
    
    const count = await prisma.agent.count();
    console.log(`Agent count: ${count}`);
    
    const agents = await prisma.agent.findMany();
    console.log('Agents:', JSON.stringify(agents, null, 2));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
