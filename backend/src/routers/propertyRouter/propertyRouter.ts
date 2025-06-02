import express, { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma';
import {
  CreatePropertyDTO,
  CreatePropertyResponse,
} from '../../types/dtos/CreateProperty.dto';
import propertyCreationValidate from '../../middlewares/property/propertyCreationValidate';
import {
  madDtoToPrismaEnumAddPropertyType,
  madDtoToPrismaEnumAddPropertyStatus,
} from '../../utils/mapDtoToPrismaEnumAddProperty';
import multer from 'multer';
import { GetPropertiesQuery } from '../../types/dtos/GetPropertiesQuery.dto';
import { GetPropertiesResponse } from '../../types/dtos/GetPropertiesResponse.dto';
import { GeneralErrorResponse } from '../../types/general-error';

const propertyRouter = express.Router();
const prisma = new PrismaClient();
const multerUpload = multer();

/*
 * Add property route
 * -Creates new property
 * -Adds given pictures to database and relation to correct property
 */
propertyRouter.post(
  '/addProperty',
  multerUpload.array('pictures'),
  propertyCreationValidate,
  async (
    req: Request<{}, {}, CreatePropertyDTO>,
    res: Response<CreatePropertyResponse | GeneralErrorResponse>,
  ) => {
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

      if (pictures && pictures.length > 0) {
        const pictureData = pictures.map((file, index) => ({
          propertyId: createdProperty.id,
          picture: file.buffer,
          useAsCoverPicture: index === Number(coverPictureIndex),
        }));

        await prisma.propertyPicture.createMany({
          data: pictureData,
        });
      }

      res.status(201).json({
        message: 'Property and its pictures stored successfully',
        propertyId: createdProperty.id,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create property' });
    }
  },
);

/*
 * Property fetch route
 * -Fetches all properties
 * -Fetches and converts cover pictures
 */
propertyRouter.get(
  '/getPropertiesByPage',
  async (
    req: Request<{}, {}, GetPropertiesQuery>,
    res: Response<GetPropertiesResponse | GeneralErrorResponse>,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 6;
      const skip = (page - 1) * pageSize;

      const totalCount = await prisma.property.count();

      const properties = await prisma.property.findMany({
        skip,
        take: pageSize,
        include: {
          pictures: {
            where: { useAsCoverPicture: true },
            take: 1,
          },
        },
      });

      // Convert pictures(bytes from database) to base64 for frontend rendering
      const propertiesWithBase64 = properties.map((property) => {
        const coverPicture = property.pictures[0];
        const base64Image = coverPicture
          ? Buffer.from(coverPicture.picture).toString('base64')
          : null;

        return {
          id: property.id,
          street: property.street,
          city: property.city,
          state: property.state,
          country: property.country,
          postalCode: property.postalCode,
          price: property.price,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          squareMeters: property.squareMeters,
          propertyType: property.propertyType,
          propertyStatus: property.propertyStatus,
          description: property.description,
          additionalInfo: property.additionalInfo,
          createdAt: property.createdAt,
          coverPicture: base64Image,
        };
      });

      res.status(200).json({
        totalCount,
        properties: propertiesWithBase64,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to load properties.' });
    }
  },
);

export default propertyRouter;
