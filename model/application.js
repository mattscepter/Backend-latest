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
            default: false
        },
        eligibilityType: {
            type: String,
            trim: true
        },
        validSecurityGuardLicence: {
            type: Boolean,
            default: false
        },
        licenceNo: {
            type: String,
            trim: true
        },
        canDrive: {
            type: Boolean,
            default: false
        },
        highestLevelOfEducation: {
            type: String,
            trim: true
        },
        educationInCanada: {
            type: Boolean,
            default: false
        },
        priorExperience: {
            type: Boolean,
            default: false
        },
        yearsOfExp: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
)

appilcationSchema.plugin(paginate)
module.exports = mongoose.model('appilcation', appilcationSchema, 'appilcation')
