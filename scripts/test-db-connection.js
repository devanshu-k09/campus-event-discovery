const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🔌 Connecting to MySQL database...');
        console.log(`   URL: ${process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@')}`);
        await prisma.$connect();
        console.log('✅ Successfully connected to MySQL database.');

        const userCount = await prisma.user.count();
        console.log(`   Users:         ${userCount}`);

        const eventCount = await prisma.event.count();
        console.log(`   Events:        ${eventCount}`);

        const draftCount = await prisma.event.count({ where: { status: 'draft' } });
        console.log(`   Drafts:        ${draftCount}`);

        const publishedCount = await prisma.event.count({ where: { status: 'published' } });
        console.log(`   Published:     ${publishedCount}`);

        const featuredCount = await prisma.event.count({ where: { isFeatured: true } });
        console.log(`   Featured:      ${featuredCount}`);

        // Verify price is stored correctly in INR
        const events = await prisma.event.findMany({
            select: { title: true, price: true, status: true, isFeatured: true }
        });
        console.log('\n📋 Events:');
        events.forEach(e => {
            console.log(`   ${e.status === 'published' ? '🟢' : '🟡'} ${e.title} — ₹${Number(e.price).toFixed(2)}${e.isFeatured ? ' ⭐ Featured' : ''}`);
        });

    } catch (e) {
        console.error('❌ Error connecting to database:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
