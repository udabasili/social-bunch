const Models = require('../models');
const logger = require('../loaders/logger');


/** Handle event functions*/
class GroupService {
    /**
     * 
     * @param {Object} currentUser 
     * @param {Object} groupRecord 
     * @param {String} groupId 
     */
    constructor(currentUser=null, groupRecord=null, groupId=null){
        this.currentUser = currentUser;
        this.groupRecord = groupRecord;
        this.groupId = groupId;
    }

    /**
     * create new event
     * @return {Object} event
     * @return {Object Array} events
     */
    async createGroup(){
        const newGroup = await Models.Group.create(this.groupRecord)
        const group = await newGroup.save();
        let groups = await Models.Group.find();
        return {groups, group}
    }

     /**
     * user joining an event
     * @return {Object} allEvents
     */
    async joinGroup(){
        let group = await Models.Group.findById(this.groupId);
        await group.members.push(this.currentUser.username);
        await group.save();
        let allGroups = await Models.Group.find();
        logger('info', `${this.currentUser.username} joined a group called ${group.name}`)
        return allGroups
    }

    /**
     * user leaving an event
     * @return {Object} allEvents
    */
    async leaveGroup(){
        const group = await Models.Group.findById(this.groupId);
        await group.removeMember(this.currentUser.username);
        await group.save();
        let allGroups = await Models.Group.find();
        logger('info', `${this.currentUser.username} left a group called ${group.name}`)
        return allGroups
    }

    async deleteGroup(){
        await Models.Group.findByIdAndRemove(this.groupId)
        let allGroups = await Models.Group.find()
        return allGroups
        
    }
}

module.exports = GroupService