const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")
const validator = require('validator');

// ====================================================================================================================================== >

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number'  ) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

// =======================================================================================================================================>


const internCreate = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*')
    try {
        let requestBody = req.body

       // validation user entry or  req.body

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern  details' })
            return
        }

        if (!isValid(requestBody.name)) {
            res.status(400).send({ status: false, message: 'name is required' })
            return
        }

        if (!isValid(requestBody.email)) {
            res.status(400).send({ status: false, message: 'email is required' })
            return
        }
        
        if (!isValid(requestBody.mobile)) {
            res.status(400).send({ status: false, message: 'mobile number is required' })
            return
        }

        if (!isValid(requestBody.collegeName)) {
            res.status(400).send({ status: false, message: 'college name  is required' })
            return
        }

         // email unique validation

        if (!(validator.isEmail(requestBody.email))) {
            return res.status(400).send({ status: false, msg: 'enter valid email' })
        }

        // number unique validation

        let check1 = requestBody.mobile
        let check2 = (/^[0-9]{10}/.test(requestBody.mobile))
        if (!(check1.length === 10 && check2)) {
            return res.status(400).send({ status: false, msg: 'enter valid number' })
        }

        // validate given college exist or not

        const collegeId = await collegeModel.findOne({ name: requestBody.collegeName })
        if (!collegeId) {
            return res.status(400).send({ status: false, msg: 'college not found' })
        }
        if (collegeId.isDeleted === true) {
            return res.status(400).send({ status: false, msg: "college is deleted" })
        }

        // email unique validation

        let emailCheck = await internModel.findOne({email:requestBody.email})
        if(emailCheck){
        return   res.status(400).send({status:false,msg:"this email already exist"})
        }

        // number unique validation 

        let mobileCheck = await internModel.findOne({mobile:requestBody.mobile})
        if(mobileCheck){
        return  res.status(400).send({status:false,msg:"this mobile number is already exist"})
        }

        // craete data in intern model first method

        req.body.collegeId=collegeId._id
     const internCreate = await internModel.create(requestBody)
     res.status(200).send({ status: true, data: internCreate })

    //  create data in intern second method
    // const createIntern = {
        //     name: req.body.name,
        //     email: req.body.email,
        //     mobile: req.body.mobile,
        //     collegeId: collegeId._id
        // }
        // const internCreate = await internModel.create(createIntern)
        // res.status(200).send({ status: true, data: internCreate })
        
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

// ======================================================================================================================================>

module.exports.internCreate = internCreate;