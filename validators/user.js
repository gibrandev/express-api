import { checkSchema } from 'express-validator';

export const userSchema = checkSchema({
    name: {
        in: ['body'],
        optional: false,
        trim: true,
        isLength: {
            options: { min: 2 },
            errorMessage: 'Nama minimal 2 karakter'
        }
    },
    email: {
        in: ['body'],
        exists: { errorMessage: 'Email wajib diisi' },
        isEmail: { errorMessage: 'Format email tidak valid' },
        normalizeEmail: true,
        trim: true
    },
    userStatusId: {
        in: ['body'],
        exists: { errorMessage: 'Status wajib diisi' },
        trim: true,
    },
    password: {
        in: ['body'],
        exists: { errorMessage: 'Password wajib diisi' },
        isLength: { options: { min: 8 }, errorMessage: 'Password minimal 8 karakter' },
        matches: {
        options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        errorMessage:
            'Password harus mengandung huruf besar, huruf kecil, angka dan simbol'
        }
    },
    password_confirmation: {
        in: ['body'],
        exists: { errorMessage: 'Konfirmasi password wajib diisi' },
        custom: {
        options: (value, { req }) => value === req.body.password,
            errorMessage: 'Konfirmasi password tidak cocok'
        }
    }
});
