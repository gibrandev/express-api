import { validationResult } from 'express-validator';

export const validate = (schema) => {
    const middlewares = Array.isArray(schema) ? schema : [schema];

    return [
        ...middlewares,
        (req, res, next) => {
            const result = validationResult(req);

            if (result.isEmpty()) return next();
            // Format error:
            // { fieldName: ["msg1", "msg2"] }
            const formatted = {};

            result.array().forEach(err => {
                if (!formatted[err.path]) {
                    formatted[err.path] = [];
                }
                formatted[err.path].push(err.msg);
            });

            return res.status(422).json({
                status: "error",
                message: "Validation failed",
                errors: formatted
            });
        }
    ];
};
