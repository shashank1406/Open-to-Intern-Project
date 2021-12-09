const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number') return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
// ==========================================================================================================================================>


const collegeCreate = async function (req, res) {
    try {

        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
            return
        }

        if (!isValid(requestBody.name)) {
            res.status(400).send({ status: false, message: 'college name is required' })
            return
        }
        if (!isValid(requestBody.fullName)) {
            res.status(400).send({ status: false, message: 'college full name is required' })
            return
        }
        if (!isValid(requestBody.logoLink)) {
            res.status(400).send({ status: false, message: 'logo link is required' })
            return
        }

        let collegeCreate = await collegeModel.create(requestBody)
        res.status(201).send({ status: true, data: collegeCreate })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }

}
// ===========================================================================================================================================>


const getAllIntern = async function (req, res) {
       res.setHeader('Access-Control-Allow-Origin','*')
    try {
        let collegeName = req.query.collegeName.toLowerCase();

        if (!collegeName) {
            return res.status(404).send({ status: false, msg: "please provide college name in query params" })
        }
        let collegeDetail = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!collegeDetail) {
            res.status(404).send({ status: false, msg: "college not found please provide valid college name" })
        }
        // that is one methd fo response structure data in data base
        let collegeDetail1 = await collegeModel.findOne({ name: collegeName, isDeleted: false }).select({ name: 1, fullName: 1, logoLink: 1, _id: 0 })
        let internDetail = await internModel.find({ collegeId: collegeDetail._id, isDeleted: false }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        if (internDetail.length === 0) {
            return res.status(201).send({ status: true, msg: { ...collegeDetail1.toObject(), interests: "intern Details not present" } })
        }
        let result = { ...collegeDetail1.toObject(), interests: internDetail }

        res.status(200).send({ status: true, data: result })
        // that is second method to response data in data base
        // let internDetail = await internModel.find({ collegeId: collegeDetail._id }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        // let result = {
        //     name: collegeDetail.name,
        //     fullName: collegeDetail.fullName,
        //     logoLink: collegeDetail.logoLink,
        //     interests: internDetail
        // }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

// ================================================================================================================================================>

module.exports.collegeCreate = collegeCreate;
module.exports.getAllIntern = getAllIntern;