import joi from 'joi'

const registerSchema = joi.object({
    name: joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters"
        }),

    email: joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Invalid email format",
            "string.empty": "Email is required"
        }),

    password: joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.empty": "Password is required"
        })
})

const loginSchema = joi.object({

    email: joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Invalid email format",
            "string.empty": "Email is required",
            "any.required": "Email is required"
        }),

    password: joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.empty": "Password is required",
            "any.required": "Password is required"
        })
})

export { registerSchema, loginSchema }