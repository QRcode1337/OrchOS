import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const activeAgents = [
    {
       name: 'OMEGA-7',
       role: 'SYSTEM_ARCHITECT',
       status: 'RUNNING',
       version: '4.2.1',
       message: 'Optimizing Neural Pathways',
       imageUrl: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=omega',
       color: 'blue'
    },
    {
       name: 'ZETA-9',
       role: 'SECURITY_PROTOCOL',
       status: 'IDLE',
       version: '2.0.5',
       message: 'Firewall Active. Scanning ports...',
       imageUrl: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=zeta',
       color: 'red'
    },
    {
       name: 'ALPHA-CORE',
       role: 'DATA_PROCESSOR',
       status: 'RUNNING',
       version: '1.2.0',
       message: 'Ingesting dataset: batch_992',
       imageUrl: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=alpha',
       color: 'yellow'
    }
  ];

  for (const agent of activeAgents) {
    await prisma.agent.create({
      data: agent
    });
    console.log(`Created agent: ${agent.name}`);
  }

  // Seed some logs
  await prisma.logEntry.create({
      data: {
          level: 'SYS',
          source: 'BOOTSTRAP',
          message: 'System Initialization Complete. DB Seeded.'
      }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
