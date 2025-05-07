import { Request, Response, NextFunction } from "express";

const unknownEndpoint = (req: Request, res: Response, next: NextFunction) => {
  res
    .status(404)
    .json({
      error: "Nothing came up with this search. Please check given URL.",
    });
};

export default unknownEndpoint;
