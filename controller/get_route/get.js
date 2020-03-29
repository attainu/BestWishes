const Users = require('../../models/users')
const Providers = require('../../models/providers')
const Venues = require('../../models/venues')
module.exports = {
    dashboard: async (req, res) => {
        try {
            const response = await Venues.find({}).populate('provider','name',)
            console.log(response)
            return res.json(response)
        }
        catch (error) {
            res.status(400).send(error)
        }
    }





}