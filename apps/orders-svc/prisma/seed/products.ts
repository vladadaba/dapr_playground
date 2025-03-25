import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient();

const seedDB = async (): Promise<void> => {
  console.time('Seeding');
  try {
    await prisma.product.createMany({
      data: [
        {
          name: 'Headphones',
          cost: 100,
          quantity: 100,
        },
        {
          name: 'Mouse',
          cost: 10,
          quantity: 100,
        },
        {
          name: 'Keyboard',
          cost: 20,
          quantity: 100,
        },
        {
          name: 'Speaker',
          cost: 30,
          quantity: 100,
        },
        {
          name: 'Monitor',
          cost: 40,
          quantity: 100,
        },
        {
          name: 'Laptop',
          cost: 50,
          quantity: 100,
        },
        {
          name: 'Tablet',
          cost: 60,
          quantity: 100,
        },
        {
          name: 'Smartphone',
          cost: 70,
          quantity: 100,
        },
        {
          name: 'Printer',
          cost: 80,
          quantity: 100,
        },
        {
          name: 'Camera',
          cost: 90,
          quantity: 100,
        },
        {
          name: 'Speaker',
          cost: 100,
          quantity: 100,
        },
      ],
    });
  } catch (e) {
    console.error('Error:\n', e);
  } finally {
    await prisma.$disconnect();
  }
};

seedDB();
