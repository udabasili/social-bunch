const models = require('../models');
const Logger = require('../loaders/logger');
const mongoose = require('mongoose');

const logger = Logger
/** Handle group functions*/
class GroupService {
    /**
     * 
     * @param {Object} currentUser 
     * @param {Object} groupRecord - the details of the group being added
     * @param {String} groupId 
     */
    constructor(currentUser = null, groupRecord = null, groupId = null) {
        this.currentUser = currentUser;
        this.groupRecord = groupRecord;
        this.groupId = groupId;
    }

    /**
     * create new group
     * @return {Object} group
     * @return {Object Array} groups
     */
    async createGroup() {
        const groupRecord = this.groupRecord;
        Logger.silly('Creating group db record')
        console.log(groupRecord)
        const group = await models.GroupModel.create({
            groupName: groupRecord.GroupName,
            description: groupRecord.GroupDescription,
            imageUrl: groupRecord.imageUrl,
            category: groupRecord.GroupCategory,
            createdBy: mongoose.Types.ObjectId(this.currentUser._id)
        })
        Logger.silly('Adding member to group')
        group.members.push(mongoose.Types.ObjectId(this.currentUser._id))
        await group.save()
        const groups = await this.getAllGroups()
        return groups
    }

    async getAllGroups() {
        Logger.silly('Get all groups')
        const groups = await models.GroupModel.find()
            .populate('createdBy', ['username', 'userImage'])
            .populate('members', ['username', 'userImage'])

        return groups;
    }

    /**
     * user joining an group
     * @return {Object} allGroups
     */
    async joinGroup() {
        Logger.silly('Adding new member to group')
        await models.GroupModel.findByIdAndUpdate(
            mongoose.Types.ObjectId(this.groupId), {
                $push: {
                    members: mongoose.Types.ObjectId(this.currentUser._id)
                }
            }
        );
        const groups = await this.getAllGroups()
        return groups
    }

    /**
     * user leaving an group
     * @return {Object} allGroups
     */
    async leaveGroup() {
        Logger.silly('Member leaving group')
        await models.GroupModel.findByIdAndUpdate(
            mongoose.Types.ObjectId(this.groupId), {
                $pull: {
                    members: mongoose.Types.ObjectId(this.currentUser._id)
                }
            }
        );
        const allGroups = await this.getAllGroups()
        return allGroups
    }

    /**
     * current user deleting an group he created
     * @return {Object} allGroups
     */
    async deleteGroup() {
        Logger.silly('Deleting group')
        await models.GroupModel.findById(this.groupId)
        await models.GroupModel.findByIdAndRemove(this.groupId)
        const allGroups = await this.getAllGroups()
        return allGroups

    }
}

module.exports = GroupService;