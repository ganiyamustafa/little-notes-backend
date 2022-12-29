import AuthorizationError from '../../exceptions/AuthorizationError';
import ClientError from '../../exceptions/ClientError';
import NotFoundError from '../../exceptions/NotFoundError';
import { isValidObjectId } from 'mongoose';
import { Group, GroupInterface } from '../../models/GroupSchema';

class GroupsService {
  constructor(private _group: typeof Group) { }

  async findAll(uId: string, { search='', limit=10, offset=0 }): Promise<GroupInterface[]> {
    return await this._group.find(
      { 
        name: { $regex: `.*${search}.*` }, 
        $or: [{ owner: uId },  { members: { $in: [uId] }}] 
    }).skip(offset).limit(limit).populate('owner', 'id username').exec();
  }

  async findOne(id: string, { populate = '' }): Promise<GroupInterface> {
    try {
      if (!isValidObjectId(id)) {
        throw new NotFoundError('group not found')
      }
  
      var group = await this._group.findById(id);
  
      if (!group) {
        throw new NotFoundError('group not found')
      }
  
      if (populate) {
        const paths = populate.split(',').map((path) =>  {
          return { path }
        });
        await this.populates(group, paths)
      }

      return group;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findNotes(id: string, { search='', limit=10, offset=0 }): Promise<GroupInterface> {
    const groupNotes = this._group.findById(id).populate({ 
      path: 'notes',
      select: '_id title description isPinned user createdAt',
      populate: {
        path: 'user',
        select: '_id username'
      },
      match: { title: { $regex: `.*${search}.*`} },
      options: {
        limit: limit,
        sort: { isPinned: -1},
        skip: offset
      }
    }).exec();

    console.log('aaa');

    if (!groupNotes) {
      throw new NotFoundError('group not found');
    }
    
    return groupNotes;
  }

  async findMembers(id: string, { limit=10, offset=0 }): Promise<GroupInterface> {
    const populateOptions = [
      { 
        path: 'members',
        select: 'username email',
        options: {
          limit: limit,
          sort: { username: -1},
          skip: offset
        }
      },
      {
        path: 'owner',
        select: 'username email',
      }
    ];
    
    const group = await this._group.findById(id).exec();

    if (!group) {
      throw new NotFoundError('group not found');
    }

    return await this.populates(group, populateOptions);
  }

  async populates(group, options: Array<{}>): Promise<GroupInterface> {
    try {
      for (let i = 0; i < options.length; i++) {
        if (options[i]['path'] === 'notes') {
          options[i]['select'] ||= '_id title description isPinned';
        } else if (options[i]['path'] === 'members' || options[i]['path'] === 'owner') {
          options[i]['select'] ||= '_id username email';
        }
        group = await group.populate(options[i]);
      }
  
      return group;
    } catch (error) {
      throw new Error(error);
    }
  }

  async create({ owner, name, notes }): Promise<GroupInterface> {
    try {
      return await new this._group({ owner, name, notes }).save();
    } catch (error) {
      if (error.name === "ValidationError") {
        Object.keys(error.errors).forEach((key) => {
          throw new ClientError(error.errors[key].message);
        });
      }
      throw new Error(error);
    }
  }

  async update(id: string, { name, members, notes }): Promise<GroupInterface> {
    try {
      const group = await this._group.findByIdAndUpdate(id, { name, $addToSet: { members, notes } }).exec()

      if (!group) {
        throw new NotFoundError(`group not found`);
      }

      return group;
    } catch (error) {
      if (error.name === "ValidationError") {
        Object.keys(error.errors).forEach((key) => {
          throw new ClientError(error.errors[key].message);
        });
      }
      throw new Error(error);
    }
  }

  async removeData(id: string, { members, notes }): Promise<GroupInterface> {
    try {
      const group = await this._group.findByIdAndUpdate(id, { $pullAll: { members, notes } }).exec()

      if (!group) {
        throw new NotFoundError(`group not found`);
      }

      return group;
    } catch (error) {
      if (error.name === "ValidationError") {
        Object.keys(error.errors).forEach((key) => {
          throw new ClientError(error.errors[key].message);
        });
      }
      throw new Error(error);
    }
  }

  async delete(id: string) {
    try {
      const group = await this._group.findByIdAndDelete(id).exec()

      if (!group) {
        throw new NotFoundError(`group not found`);
      }

      return group;
    } catch (error) {
      if (error.name === "ValidationError") {
        Object.keys(error.errors).forEach((key) => {
          throw new ClientError(error.errors[key].message);
        });
      }
      throw new Error(error);
    }
  }

  async countDocuments(uId: string, { search='' }): Promise<number> {
    return await this._group.countDocuments({ name: { $regex: `.*${search}.*` }, user: uId }).exec();
  }

  async countNotes(id: string, { search='' }): Promise<number> {
    const group = await this._group.findById(id, 'notes').populate({
      path: 'notes',
      select: '_id',
      match: { title: { $regex: `.*${search}.*`} }
    }).exec();

    if (!group) {
      throw new NotFoundError('group not found');
    }
    
    return group.notes.length;
  }

  async countMembers(id: string): Promise<number> {
    const group = await this._group.findById(id, 'members').exec();

    if (!group) {
      throw new NotFoundError('group not found');
    }
    
    return group.members.length;
  }

  async verifyGroupAccess(groupId, userId) {
    try {
      await this.verifyGroupOwner(groupId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this.verifyGroupMembers(groupId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifyMembers(groupId, memberIds) {
    memberIds.forEach((memberId) => {
      if (!isValidObjectId(memberId)) {
        throw new NotFoundError(`can't find user with id ${memberId}`);
      }
    });

    const group = await this._group.findById(groupId).select('owner');

    if (!group) {
      throw new NotFoundError('group not found');
    }

    if (memberIds.includes(group.owner.toString())) {
      throw new ClientError("can't add yourself to group");
    }
  }

  async verifyGroupOwner(groupId, userId) {
    if (!isValidObjectId(groupId)) {
      throw new NotFoundError(`group not found`);
    }

    const group = await this._group.findById(groupId).select('owner');

    if (!group) {
      throw new NotFoundError('group not found');
    }

    if (group.owner.toString() !== userId) {
      throw new AuthorizationError("can't access this source");
    }
  }

  async verifyGroupMembers(groupId, userId) {
    if (!isValidObjectId(groupId)) {
      throw new NotFoundError(`group not found`);
    }

    const group = await this._group.findById(groupId).select('members');

    if (!group) {
      throw new NotFoundError('group not found');
    }

    if (!group.members.includes(userId)) {
      throw new AuthorizationError("can't access this source");
    }
  }
}

export default GroupsService;
