import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '../../../generated/prisma';
import {
  CreatePropertyDTO,
  CreatePropertyResponse,
} from '../../types/dtos/CreateProperty.dto';
import propertyCreationValidate from '../../middlewares/property/propertyCreationValidate';
import {
  mapDtoToPrismaEnumAddPropertyType,
  mapDtoToPrismaEnumAddPropertyStatus,
} from '../../utils/mapDtoToPrismaEnumAddProperty';
import multer from 'multer';
import { GetPropertiesQuery } from '../../types/dtos/GetPropertiesQuery.dto';
import { GetPropertiesResponse } from '../../types/dtos/GetPropertiesResponse.dto';
import { GeneralErrorResponse } from '../../types/general-error';
import { SearchConditions } from '../../types/search-conditions';
import AuthenticateRequest from '../../middlewares/authentication/authenticateRequest';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

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
  AuthenticateRequest,
  multerUpload.array('pictures'),
  propertyCreationValidate,
  async (
    req: AuthenticatedRequest<{}, {}, CreatePropertyDTO>,
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

    const userId = req.user?.userId;
    const pictures = req.files as Express.Multer.File[];

    try {
      const createdProperty = await prisma.property.create({
        data: {
          userId: Number(userId),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          additionalInfo: additionalInfo,
          propertyType: mapDtoToPrismaEnumAddPropertyType(propertyType),
          description: description,
          city: city,
          country: country,
          postalCode: postalCode,
          price: Number(price),
          propertyStatus: mapDtoToPrismaEnumAddPropertyStatus(propertyStatus),
          squareMeters: Number(squareMeters),
          state: state,
          street: street,
        },
      });

      for (const [index, file] of pictures.entries()) {
        await prisma.propertyPicture.create({
          data: {
            propertyId: createdProperty.id,
            picture: file.buffer,
            useAsCoverPicture: index === Number(coverPictureIndex),
          },
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
 * -Fetches properties for browsing page at a time
 * -Fetches and converts cover pictures
 */
propertyRouter.get(
  '/getPropertiesByPage',
  async (
    req: Request<{}, {}, GetPropertiesQuery>,
    res: Response<GetPropertiesResponse | GeneralErrorResponse>,
  ) => {
    try {
      // Protection from query injection and dynamic where conditions
      const validSearchConditions: SearchConditions['searchCondition'][] = [
        'city',
        'country',
        'street',
      ];
      const { searchCondition, searchTerm } = req.query as Partial<
        SearchConditions & { searchTerm?: string }
      >;
      if (searchCondition && !validSearchConditions.includes(searchCondition)) {
        res.status(400).json({ error: 'Invalid search condition' });
        return;
      }
      const whereConditions =
        searchCondition && searchTerm
          ? { [searchCondition]: { contains: searchTerm, mode: 'insensitive' } }
          : {};

      // Pagination options
      const page = Number(req.query.page as string) || 1;
      const pageSize = Number(req.query.pageSize as string) || 6;
      const skip = (page - 1) * pageSize;

      const totalCount = await prisma.property.count({
        where: whereConditions,
      });

      const properties = await prisma.property.findMany({
        where: whereConditions,
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
          userId: property.userId,
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
    } catch {
      res
        .status(500)
        .json({ error: 'Failed to load properties. Please try again.' });
      return;
    }
  },
);

/*
 * Users properties fetch route
 * -Fetches users own properties
 */
propertyRouter.get(
  '/getPropertiesByUserId',
  async (req: Request, res: Response) => {
    const userId = parseInt(req.query.userId as string);
    try {
      const fetchUsersProperties = await prisma.property.findMany({
        where: {
          userId: userId,
        },
      });
      res.status(200).json({ usersProperties: fetchUsersProperties });
    } catch {
      res
        .status(500)
        .json({ error: 'Failed to load your properties. Please try again.' });
      return;
    }
  },
);

/**
 * Edit property information route
 * - Edits property details (not including pictures)
 */
propertyRouter.put(
  '/editPropertyInformation/:propertyId',
  AuthenticateRequest,
  async (
    req: Request<{ propertyId: string }, {}, Partial<CreatePropertyDTO>>,
    res: Response,
  ) => {
    const { propertyId } = req.params;
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
    } = req.body;

    const parsedPropertyId = Number(propertyId);
    if (isNaN(parsedPropertyId)) {
      res.status(400).json({ error: 'Invalid property ID provided' });
      return;
    }

    try {
      const updatedProperty = await prisma.property.update({
        where: { id: Number(parsedPropertyId) },
        data: {
          ...(street && { street }),
          ...(city && { city }),
          ...(state && { state }),
          ...(postalCode && { postalCode }),
          ...(country && { country }),
          ...(price && { price: Number(price) }),
          ...(propertyType && {
            propertyType: mapDtoToPrismaEnumAddPropertyType(propertyType),
          }),
          ...(propertyStatus && {
            propertyStatus: mapDtoToPrismaEnumAddPropertyStatus(propertyStatus),
          }),
          ...(bedrooms && { bedrooms: Number(bedrooms) }),
          ...(bathrooms && { bathrooms: Number(bathrooms) }),
          ...(squareMeters && { squareMeters: Number(squareMeters) }),
          ...(description && { description }),
          ...(additionalInfo && { additionalInfo }),
        },
      });

      res.status(200).json({
        updatedProperty: updatedProperty,
        message: 'Property information updated successfully',
      });
    } catch {
      res.status(500).json({ error: 'Failed to update property information' });
    }
  },
);

/*
 * Fetch all images for property route
 * -Fetches and converts all images for property using propertyId
 */
propertyRouter.get(
  '/getAllImagesForProperty',
  async (
    req: Request<{}, {}, {}, { propertyId: string }>,
    res: Response<{ pictures: string[] } | GeneralErrorResponse>,
  ) => {
    try {
      const propertyId = parseInt(req.query.propertyId);

      if (isNaN(propertyId)) {
        res.status(400).json({ error: 'Invalid propertyId given.' });
        return;
      }

      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { pictures: true },
      });

      if (!property || !property.pictures || property.pictures.length === 0) {
        res.status(404).json({ error: 'No pictures found for this property' });
        return;
      }

      const base64Pictures = property.pictures.map((pic) =>
        Buffer.from(pic.picture).toString('base64'),
      );

      res.status(200).json({ pictures: base64Pictures });
      return;
    } catch {
      res
        .status(500)
        .json({ error: 'Failed to fetch images. Please try again.' });
      return;
    }
  },
);

/*
 * Property deletion route
 * -Deletes property using property id
 */
propertyRouter.delete(
  '/delete/:propertyId',
  AuthenticateRequest,
  async (req: Request<{ propertyId: string }>, res: Response) => {
    const { propertyId } = req.params;
    const parsedPropertyId = Number(propertyId);

    if (isNaN(parsedPropertyId)) {
      res.status(400).json({ error: 'Invalid property ID provided' });
      return;
    }

    try {
      // Delete property pictures to maintain databases referential integrity
      await prisma.propertyPicture.deleteMany({
        where: { propertyId: parsedPropertyId },
      });

      // Delete property itself
      await prisma.property.delete({
        where: { id: parsedPropertyId },
      });

      res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025' // Prisma error code if property to delete does not exist
      ) {
        res.status(404).json({ error: 'Property not found' });
        return;
      } else {
        res.status(500).json({ error: 'Failed to delete property' });
        return;
      }
    }
  },
);

export default propertyRouter;
