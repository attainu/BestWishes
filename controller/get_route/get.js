const Users = require('../../models/users')
const Providers = require('../../models/providers')
const Venues = require('../../models/venues')
const Admin = require('../../models/admin')
module.exports = {
    dashboard: async (req, res) => {
        try {
            const response = await Venues.find({}).populate('provider', 'name')
            console.log(response)
            return res.json(response)
        }
        catch (error) {
            res.status(400).send(error)
        }

    },
    admin_user_dashboard: async (req, res) => {
        try {
            const payload_id = res.payload._id
            const admin = await Users.findById({ _id: payload_id })
            if (admin.Isadmin === true) {
                const response = await Users.find({})
                return res.status(200).json(response)
            }
            else{
                res.status(500).json("only for admin")
            }
        }
        catch (error) {
            res.status(400).json(error)
        }

    },
    admin_provider_dashboard: async (req, res) => {
        try {
            const payload_id = res.payload._id
            const admin = await Users.findById({ _id: payload_id })
            if (admin.Isadmin === true) {

            const response = await Providers.find({}).populate({path:'venue_id'})
            return res.status(200).json(response)
            }
            else{
                res.status(500).json("only for admin")
            }
        }
        catch (error) {
            res.status(400).json(error)
        }
    }






}