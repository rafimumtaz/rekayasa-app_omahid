const { prisma } = require('./lib/prisma');

async function testPrisma() {
  try {
    const products = await prisma.product.findMany({
      take: 1
    });
    console.log('Successfully fetched products. Sample product keys:', Object.keys(products[0] || {}));
    if (products[0]) {
      console.log('Stock value:', products[0].stock);
    }
  } catch (err) {
    console.error('Prisma test error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
