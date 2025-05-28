import express, { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma';
import { CreatePropertyDTO } from '../../types/dtos/CreateProperty.dto';
import propertyCreationValidate from '../../middlewares/property/propertyCreationValidate';
import {
  madDtoToPrismaEnumAddPropertyType,
  madDtoToPrismaEnumAddPropertyStatus,
} from '../../utils/mapDtoToPrismaEnumAddProperty';

const propertyRouter = express.Router();
const prisma = new PrismaClient();

propertyRouter.post(
  '/addProperty',
  propertyCreationValidate,
  async (req: Request<{}, {}, CreatePropertyDTO>, res: Response) => {
    const {
      street,
      city,
      state,
      postalCode,
      country,
      price,
      propertyType,
      propertyStatus,
      bedrooms,
      bathrooms,
      squareMeters,
      description,
      additionalInfo,
      pictures,
      coverPictureIndex,
    } = req.body;

    try {
      console.log('trying to create property with:', req.body);

      const createdProperty = await prisma.property.create({
        data: {
          userId: 2,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          additionalInfo: additionalInfo,
          propertyType: madDtoToPrismaEnumAddPropertyType(propertyType),
          description: description,
          city: city,
          country: country,
          postalCode: postalCode,
          price: price,
          propertyStatus: madDtoToPrismaEnumAddPropertyStatus(propertyStatus),
          squareMeters: squareMeters,
          state: state,
          street: street,
        },
      });
      console.log('Property created:', createdProperty);

      if (pictures && pictures.length > 0) {
        const pictureData = pictures.map(
          (pictureBase64: string, index: number) => ({
            propertyId: createdProperty.id,
            picture: Buffer.from(pictureBase64, 'base64'),
            useAsCoverPicture: index === coverPictureIndex,
          }),
        );

        await prisma.propertyPicture.createMany({
          data: pictureData,
        });

        console.log('Pictures created for property:', createdProperty.id);
      }

      res.status(201).json({
        message: 'Property and its pictures stored successfully',
        propertyId: createdProperty.id,
      });
    } catch (error) {
      console.error('error in property creating', error);
      res.status(500).json({ error: 'Failed to create property' });
    } finally {
      console.log('property creation has ended.');
    }
  },
);

export default propertyRouter;
