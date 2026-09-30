import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from './index.js';
import { laboratories, users, samples } from './schema.js';

async function seed() {
    console.log('Seeding database...');

    const existingLabs = await db.select().from(laboratories);

    if (existingLabs.length === 0) {
        await db.insert(laboratories).values([
            { name: 'Laboratory A' },
            { name: 'Laboratory B' },
        ]);
    }

    const labs = await db.select().from(laboratories);

    const passwordHash = await bcrypt.hash('password123', 10);

    const existingUsers = await db.select().from(users);

    if (existingUsers.length === 0) {
        await db.insert(users).values([
            {
                username: 'admin',
                passwordHash,
                role: 'admin',
                laboratoryId: null,
            },
            {
                username: 'lab_user',
                passwordHash,
                role: 'user',
                laboratoryId: labs[0].id,
            },
        ]);
    }

    const existingSamples = await db.select().from(samples);

    if (existingSamples.length === 0) {
        const statuses = ['received', 'processing', 'completed'] as const;
        const sampleData = [];

        for (let i = 1; i <= 10000; i++) {
            sampleData.push({
                patientName: `Patient ${i}`,
                status: statuses[i % statuses.length],
                receivedAt: new Date(Date.now() - i * 60 * 60 * 1000),
                laboratoryId: labs[i % labs.length].id,
            });
        }

        for (let i = 0; i < sampleData.length; i += 500) {
            await db.insert(samples).values(sampleData.slice(i, i + 500));
        }
    }

    console.log('Seed completed.');
    process.exit(0);
}

seed().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});