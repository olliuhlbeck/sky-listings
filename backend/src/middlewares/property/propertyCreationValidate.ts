import { Request, Response, NextFunction } from 'express';

const propertyCreationValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
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
  } = req.body;

  console.log('Full req.body:', req.body);

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

  next();
};

export default propertyCreationValidate;
