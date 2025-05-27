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
    squaremeters,
    description,
    additionalInfo,
    pictures,
  } = req.body;

  const stringFields = {
    street,
    city,
    state,
    country,
    propertyType,
    propertyStatus,
    description,
    additionalInfo,
  };

  if (description !== undefined) {
    stringFields.description = description;
  }
  if (postalCode !== undefined) {
    stringFields.description = postalCode;
  }

  for (const [key, value] of Object.entries(stringFields)) {
    if (typeof value !== 'string') {
      res
        .status(400)
        .json({ error: `${key} must be a string. Please check entry input.` });
      return;
    }
  }

  const numberFields = {
    price,
    bedrooms,
    bathrooms,
    squaremeters,
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

  next();
};

export default propertyCreationValidate;
