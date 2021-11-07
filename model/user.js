/**
 * @author krish
 */

const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1: uuidv1 } = require('uuid')

const userSchema = new mongoose.Schema(
    {
        //personal info
        name: {
            type: String,
            maxlength: 32,
            trim: true,
            default: null
        },
        lastname: {
            type: String,
            maxlength: 32,
            trim: true,
            default: null
        },
        dateOfBirth: {
            type: String,
            trim: true,
            default: null
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'transgender', 'others', null],
            default: null
        },
        weight: {
            type: Number,
            maxlength: 5,
            default: null
        },
        height: {
            type: String,
            maxlength: 5,
            default: null
        },
        eyeColor: {
            type: String,
            trim: true,
            default: null
        },
        hairColor: {
            type: String,
            trim: true,
            default: null
        },

        languagesKnown: {
            type: Array,
            default: null
        },

        //Course bought
        courses: {
            type: Array,
            default: []
        },

        //contact Info
        email: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: Number,
            maxlength: 15,
            default: null
        },
        homePhone: {
            type: Number,
            maxlength: 15,
            default: null
        },
        address: {
            type: String,
            trim: true,
            default: null
        },
        country: {
            type: String,
            trim: true,
            default: null
        },
        city: {
            type: String,
            trim: true,
            default: null
        },
        street: {
            type: String,
            trim: true,
            default: null
        },
        streetNumber: {
            type: Number,
            default: null
        },
        suite: {
            type: String,
            default: null
        },
        province: {
            type: String,
            trim: true,
            default: null
        },
        postalCode: {
            type: String,
            trim: true,
            default: null
        },

        //work status
        isElilligibeToWorkInCanada: {
            type: String,
            enum: ['YES', 'NO', null],
            default: null
        },
        eligibilityType: {
            type: String,
            trim: true,
            default: null
        },
        isValidGuardLicence: {
            type: String,
            enum: ['YES', 'NO', null],
            default: null
        },
        securityGuardLicenseNo: {
            type: String,
            trim: true,
            default: null
        },
        isDrive: {
            type: String,
            enum: ['YES', 'NO', null],
            default: null
        },

        //education
        levelOfEducation: {
            type: String,
            trim: true,
            default: null
        },
        isEducationInCanada: {
            type: String,
            enum: ['YES', 'NO', null],
            default: null
        },

        //experience
        isPriorExperienceInCanada: {
            type: String,
            enum: ['YES', 'NO', null],
            default: null
        },
        yearsOfExperience: {
            type: Number,
            maxlength: 2,
            default: null
        },

        //employment record
        category: {
            type: String,
            trim: true,
            default: null
        },
        companyName: {
            type: String,
            trim: true,
            default: null
        },
        companyAddress: {
            type: String,
            trim: true,
            default: null
        },
        employeeDuration: {
            from: {
                type: String,
                trim: true,
                default: null
            },
            to: {
                type: String,
                trim: true,
                default: null
            }
        },
        isActive: {
            type: String,
            enum: ['YES', 'NO', null],
            default: null
        },
        reasonForLeaving: {
            type: String,
            trim: true,
            default: null
        },

        //background declaration
        hasCriminalRecord: {
            type: String,
            enum: ['YES', 'NO', null],
            default: null
        },

        hasVechicle: {
            type: String,
            enum: ['YES', 'NO', null],
            default: null
        },

        hasLicenseToDrive: {
            type: String,
            enum: ['YES', 'NO', null],
            default: null
        },

        //credentials
        encrypted_password: {
            type: String,
            required: true
        },
        salt: {
            type: String
        },
        role: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
)

userSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.encrypted_password = this.securePassword(password)
    })

    .get(function () {
        return this._password
    })

userSchema.methods = {
    authenticate: function (password) {
        return this.securePassword(password) === this.encrypted_password
    },

    securePassword: function (password) {
        if (!password) return ''

        try {
            return crypto
                .createHmac('sha256', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    }
}

module.exports = mongoose.model('users', userSchema, 'users')
