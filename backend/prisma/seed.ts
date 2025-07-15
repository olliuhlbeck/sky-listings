import { PrismaClient } from '../generated/prisma';
import argon2 from 'argon2';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const readImageForSeed = (filename: string) => {
  const fullPath = path.join(__dirname, '../seedPhotos', filename);
  return fs.readFileSync(fullPath);
};

const main = async () => {
  const hashedPassword = await argon2.hash('password');

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'user1@example.com',
        username: 'user1',
        password: hashedPassword,
        info: {
          create: {
            phone: '+358401234567',
            address: 'Hämeenkatu 10, Tampere',
            preferredContactDetails: 'Email',
          },
        },
        properties: {
          create: [
            {
              street: 'Aleksanterinkatu 5',
              city: 'Helsinki',
              state: 'Uusimaa',
              postalCode: '00100',
              country: 'Finland',
              price: 320000,
              propertyStatus: 'AVAILABLE',
              bedrooms: 3,
              bathrooms: 2,
              squareMeters: 95,
              propertyType: 'HOUSE',
              description: 'Modern detached house near city center.',
              pictures: {
                create: [
                  {
                    picture: readImageForSeed('house1-pic1.jpg'),
                    useAsCoverPicture: true,
                  },
                  { picture: readImageForSeed('house1-pic2.jpg') },
                  { picture: readImageForSeed('house1-pic3.jpg') },
                ],
              },
            },
            {
              street: 'Itäinen Pitkäkatu 12',
              city: 'Turku',
              state: 'Varsinais-Suomi',
              postalCode: '20700',
              country: 'Finland',
              price: 210000,
              propertyStatus: 'AVAILABLE',
              bedrooms: 2,
              bathrooms: 1,
              squareMeters: 70,
              propertyType: 'HOUSE',
              description: 'Bright 2-bedroom apartment in Turku.',
              pictures: {
                create: [
                  {
                    picture: readImageForSeed('house2-pic1.jpg'),
                    useAsCoverPicture: true,
                  },
                ],
              },
            },
          ],
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'user2@example.com',
        username: 'user2',
        password: hashedPassword,
        properties: {
          create: [
            {
              street: 'Rautatienkatu 21',
              city: 'Oulu',
              state: 'Pohjois-Pohjanmaa',
              postalCode: '90100',
              country: 'Finland',
              price: 270000,
              propertyStatus: 'AVAILABLE',
              bedrooms: 2,
              bathrooms: 1,
              squareMeters: 110,
              propertyType: 'HOUSE',
              description: 'Family home in quiet neighborhood.',
              pictures: {
                create: [
                  {
                    picture: readImageForSeed('house3-pic1.jpg'),
                    useAsCoverPicture: true,
                  },
                ],
              },
            },
            {
              street: 'Satamakatu 8',
              city: 'Kuopio',
              state: 'Pohjois-Savo',
              postalCode: '70100',
              country: 'Finland',
              price: 95000,
              propertyStatus: 'AVAILABLE',
              bedrooms: 1,
              bathrooms: 1,
              squareMeters: 45,
              propertyType: 'APARTMENT',
              description: 'Land parcel by the lake.',
              pictures: {
                create: [
                  {
                    picture: readImageForSeed('house4-pic1.jpg'),
                    useAsCoverPicture: true,
                  },
                ],
              },
            },
          ],
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'user3@example.com',
        username: 'user3',
        password: hashedPassword,
        properties: {
          create: [
            {
              street: 'Linnankatu 34',
              city: 'Porvoo',
              state: 'Uusimaa',
              postalCode: '06100',
              country: 'Finland',
              price: 450000,
              propertyStatus: 'AVAILABLE',
              bedrooms: 5,
              bathrooms: 3,
              squareMeters: 150,
              propertyType: 'APARTMENT',
              description: 'Office building in old town Porvoo.',
              pictures: {
                create: [
                  {
                    picture: readImageForSeed('house5-pic1.jpg'),
                    useAsCoverPicture: true,
                  },
                ],
              },
            },
            {
              street: 'Puijonkatu 15',
              city: 'Jyväskylä',
              state: 'Keski-Suomi',
              postalCode: '40100',
              country: 'Finland',
              price: 340000,
              propertyStatus: 'AVAILABLE',
              bedrooms: 3,
              bathrooms: 2,
              squareMeters: 100,
              propertyType: 'HOUSE',
              description: 'Warehouse in business district.',
              pictures: {
                create: [
                  {
                    picture: readImageForSeed('house6-pic1.jpg'),
                    useAsCoverPicture: true,
                  },
                ],
              },
            },
            {
              street: 'Kirkkokatu 3',
              city: 'Lahti',
              state: 'Päijät-Häme',
              postalCode: '15110',
              country: 'Finland',
              price: 265000,
              propertyStatus: 'AVAILABLE',
              bedrooms: 4,
              bathrooms: 2,
              squareMeters: 100,
              propertyType: 'MISCELLANOUS',
              description: 'Mixed-use property close to central square.',
              pictures: {
                create: [
                  {
                    picture: readImageForSeed('house7-pic1.jpg'),
                    useAsCoverPicture: true,
                  },
                ],
              },
            },
          ],
        },
      },
    }),
  ]);

  console.log(
    'Seeded users:',
    users.map((user) => user.username),
  );
};

main()
  .catch((error) => {
    console.error('Seeding error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
