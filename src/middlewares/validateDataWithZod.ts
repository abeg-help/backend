import { NextFunction, Request, Response } from 'express';
import type { LoginSchemaType } from 'src/lib/zodSchema/loginSchema';
import type { SignUpSchemaType } from 'src/lib/zodSchema/signUpSchema';

const validateDataWithZod =
  (Schema: LoginSchemaType | SignUpSchemaType) =>
  (req: Request & { validatedBody: Request['body'] }, res: Response, next: NextFunction) => {
    const rawData = req.body;
    const result = Schema.safeParse(rawData);

    if (!result.success) {
      const zodErrors = { errors: result.error.flatten().fieldErrors };

      res.status(422).json(zodErrors);
      return;
    }

    req.validatedBody = result.data;
    next();
  };

export { validateDataWithZod };
