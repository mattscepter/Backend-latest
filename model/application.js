/**
 * @author krish
 */

const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const appilcationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            required: true
        },
        elegibleToWorkInCanada: {
            type: Boolean,
            default: false,
            required: true
        },
        eligibilityType: {
            type: String,
            trim: true,
            required: true
        },
        validSecurityGuardLicence: {
            type: Boolean,
            default: false,
            required: true
        },
        licenceNo: {
            type: String,
            trim: true
        },
        canDrive: {
            type: Boolean,
            default: false,
            required: true
        },
        highestLevelOfEducation: {
            type: String,
            trim: true,
            required: true
        },
        educationInCanada: {
            type: Boolean,
            default: false,
            required: true
        },
        priorExperience: {
            type: Boolean,
            default: false,
            required: true
        },
        yearsOfExp: {
            type: String,
            trim: true,
            required: true
        }
    },
    { timestamps: true }
)

appilcationSchema.plugin(paginate)
module.exports = mongoose.model('appilcation', appilcationSchema, 'appilcation')
