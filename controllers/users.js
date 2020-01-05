const Users = require("../model/user");

exports.getAllUsers = async function(req, res, next){
    try {
        let users = await Users.find({})
        
        let filteredData =  await Users.filterData(users)
        return res.status(200).json({
            status:200,
            message:filteredData
        })
    } catch (error) {
        return ({
            status:500,
            message:error
        })
        
    }
    
}