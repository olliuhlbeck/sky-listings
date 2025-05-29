import express, { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma';
import { CreatePropertyDTO } from '../../types/dtos/CreateProperty.dto';
import propertyCreationValidate from '../../middlewares/property/propertyCreationValidate';
import {
  madDtoToPrismaEnumAddPropertyType,
  madDtoToPrismaEnumAddPropertyStatus,
} from '../../utils/mapDtoToPrismaEnumAddProperty';
import multer from 'multer';

const propertyRouter = express.Router();
const prisma = new PrismaClient();
const multerUpload = multer();

propertyRouter.post(
  '/addProperty',
  multerUpload.array('pictures'),
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
      coverPictureIndex,
    } = req.body;

    const pictures = req.files as Express.Multer.File[];

    try {
      console.log('trying to create property with:', req.body);

      const createdProperty = await prisma.property.create({
        data: {
          userId: 2,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          additionalInfo: additionalInfo,
          propertyType: madDtoToPrismaEnumAddPropertyType(propertyType),
          description: description,
          city: city,
          country: country,
          postalCode: postalCode,
          price: Number(price),
          propertyStatus: madDtoToPrismaEnumAddPropertyStatus(propertyStatus),
          squareMeters: Number(squareMeters),
          state: state,
          street: street,
        },
      });
      console.log('Property created:', createdProperty);

      if (pictures && pictures.length > 0) {
        const pictureData = pictures.map((file, index) => ({
          propertyId: createdProperty.id,
          picture: file.buffer,
          useAsCoverPicture: index === Number(coverPictureIndex),
        }));

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
