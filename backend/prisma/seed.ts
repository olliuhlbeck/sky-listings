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
        email: 'user@example.com',
        username: 'user',
        password: hashedPassword,
        info: {
          create: {
            firstName: 'Axel',
            lastName: 'Koskinen',
            phone: '+358401234567',
            address: 'Hämeenkatu 10, Tampere',
            preferredContactDetails: 'TEXTMESSAGE',
            profilePicture: readImageForSeed('profile-picture-seed-photo.jpg'),
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
              description: 'Rustic cottage style house with big outer yard.',
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
              description:
                'Compact one bedroom house with only forest as neighbour.',
              additionalInfo:
                'It takes 30 minutes by car to nearest food market.',
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
        info: {
          create: {
            firstName: 'Peter',
            lastName: 'Jackson',
            phone: '+358401234568',
            address: 'Keskuskatu 21, Helsinki',
            preferredContactDetails: 'EMAIL',
          },
        },
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
              additionalInfo: 'Freshly remodeled indoors.',
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
              description: 'Modern layout, decorated with classic touch.',
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
        info: {
          create: {
            firstName: 'Janet',
            lastName: 'Michaels',
            phone: '+358401234569',
            address: 'Koulukatu 12, Pori',
            preferredContactDetails: 'PHONECALL',
          },
        },
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
              additionalInfo: 'The housing company provides internet.',
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
              description:
                'Three bedrooms arranged compactly but with a spacious floor plan.',
              additionalInfo: 'Separate two car carage right next to house.',
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
              propertyType: 'HOUSE',
              description:
                'Almost villa like house for a large family to live in.',
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
