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
    pictures,
  } = req.body;

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

  const numberFields = {
    price,
    bedrooms,
    bathrooms,
    squareMeters,
  };
  for (const [key, value] of Object.entries(numberFields)) {
    if (typeof value !== 'number') {
      res
        .status(400)
        .json({ error: `${key} must be a number. Please check entry input.` });
      return;
    }
    if (value < 0) {
      res
        .status(400)
        .json({ error: `${key} cannot be under 0. Please check entry input.` });
      return;
    }
  }

  if (pictures !== undefined) {
    if (!Array.isArray(pictures) || pictures.length === 0) {
      res.status(400).json({ error: 'please provide at least one picture.' });
      return;
    }
  } else {
    res.status(400).json({ error: 'please provide at least one picture.' });
    return;
  }

  next();
};

export default propertyCreationValidate;
