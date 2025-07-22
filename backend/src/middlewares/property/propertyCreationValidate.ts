import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserIdRequest } from '../../types/user-id-request';

const propertyCreationValidate = (
  req: UserIdRequest,
  res: Response,
  next: NextFunction,
) => {
  // Extract user id from token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET!) as {
      userId: number;
    };
    req.userId = decoded.userId;
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
    return;
  }
  // Access values from body
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

  // Validate pictures are given in an non empty array
  const pictures = req.files;
  if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
    res.status(400).json({ error: 'Please provide at least one picture.' });
    return;
  }

  // Validate required string fields
  const requiredStringFields = {
    street,
    city,
    state,
    country,
    propertyType,
    propertyStatus,
    description,
  };
  for (const [key, value] of Object.entries(requiredStringFields)) {
    if (typeof value !== 'string' || value.trim() === '') {
      res
        .status(400)
        .json({ error: `${key} must be a string. Please check entry input.` });
      return;
    }
  }

  // Validate optional string fields
  const optionalStringFields = {
    additionalInfo,
    postalCode,
  };
  for (const [key, value] of Object.entries(optionalStringFields)) {
    if (
      value !== undefined &&
      (typeof value !== 'string' || value.trim() === '')
    ) {
      res
        .status(400)
        .json({ error: `${key} must be a string(not empty) if provided.` });
      return;
    }
  }

  // Try to convert numbers and validate them
  const priceNum = Number(price);
  const bedroomsNum = Number(bedrooms);
  const bathroomsNum = Number(bathrooms);
  const squareMetersNum = Number(squareMeters);

  const numberFields = {
    price: priceNum,
    bedrooms: bedroomsNum,
    bathrooms: bathroomsNum,
    squareMeters: squareMetersNum,
  };

  for (const [key, value] of Object.entries(numberFields)) {
    if (isNaN(value)) {
      res.status(400).json({ error: `${key} must be a number.` });
      return;
    }
    if (value < 0) {
      res.status(400).json({ error: `${key} cannot be under 0.` });
      return;
    }
  }

  // Limit lengths for safety
  const MAX_LENGTHS: Record<string, number> = {
    additionalInfo: 3000,
    description: 2000,
    street: 200,
    city: 100,
    state: 100,
    country: 100,
    postalCode: 40,
  };

  for (const [field, maxLength] of Object.entries(MAX_LENGTHS)) {
    const value = req.body[field];
    if (value && typeof value === 'string' && value.trim().length > maxLength) {
      res.status(400).json({
        error: `${field} is too long (max ${maxLength} characters).`,
      });
      return;
    }
  }

  next();
};

export default propertyCreationValidate;
