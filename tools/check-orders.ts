import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOrders() {
  try {
    console.log('🔍 Checking orders in database...\n');
    
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            username: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📦 Total orders: ${orders.length}\n`);
    
    if (orders.length === 0) {
      console.log('⚠️  No orders found in database!');
    } else {
      orders.forEach((order, index) => {
        console.log(`\n--- Order ${index + 1} ---`);
        console.log(`Order Number: ${order.orderNumber}`);
        console.log(`ID: ${order.id}`);
        console.log(`Kegiatan: ${order.kegiatan}`);
        console.log(`Status: ${order.status}`);
        console.log(`Created by: ${order.user.name} (${order.user.username})`);
        console.log(`Created at: ${order.createdAt.toLocaleString()}`);
        console.log(`Items: ${order.items.length} items`);
        
        if (order.items.length > 0) {
          order.items.forEach((item, idx) => {
            console.log(`  ${idx + 1}. ${item.jenisKonsumsi} - ${item.qty} ${item.satuan}`);
          });
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrders();
