import express, { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma';
import { CreatePropertyDTO } from '../../types/dtos/CreateProperty.dto';
import propertyCreationValidate from '../../middlewares/property/propertyCreationValidate';
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
      squaremeters,
      description,
      additionalInfo,
      pictures,
    } = req.body;

    try {
      console.log('trying to create property with:', req.body);
    } catch (error) {
      console.error('error in propert creating', error);
    }
  },
);

export default propertyRouter;
