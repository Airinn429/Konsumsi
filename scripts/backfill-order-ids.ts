import { PrismaClient } from '@prisma/client';
import { generatePrefixedId } from '../src/lib/id-generator';

const prisma = new PrismaClient();

async function backfillOrderIds() {
  console.log('🔄 Menyesuaikan ID order lama menjadi format ORD-XXX...');

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
    },
  });

  let updatedCount = 0;

  for (const order of orders) {
    if (order.id.startsWith('ORD-')) {
      continue;
    }

    const newId = await generatePrefixedId(prisma, 'order');

    await prisma.$transaction(async (tx) => {
      await tx.consumptionItem.updateMany({
        where: { orderId: order.id },
        data: { orderId: newId },
      });

      await tx.order.update({
        where: { id: order.id },
        data: { id: newId },
      });
    });

    updatedCount += 1;
    console.log(`✅ Order ${order.id} diperbarui menjadi ${newId}`);
  }

  if (updatedCount === 0) {
    console.log('👍 Semua order sudah menggunakan format ID baru.');
  } else {
    console.log(`🎯 Total order diperbarui: ${updatedCount}`);
  }
}

backfillOrderIds()
  .catch((error) => {
    console.error('❌ Gagal memperbarui ID order:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
