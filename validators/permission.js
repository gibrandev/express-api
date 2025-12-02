import { checkSchema } from 'express-validator';

export const permissionSchema = checkSchema({
    name: {
        in: ['body'],
        optional: false,
        trim: true,
        isLength: {
            options: { min: 2 },
            errorMessage: 'Nama minimal 2 karakter'
        }
    },
    description: {
        in: ['body'],
        optional: true,
        trim: true
    }
});
