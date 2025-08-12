import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (Schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Schema.parseAsync({ body: req.body });
      next();
    } catch (err) {
      next(err);
    }
  };
