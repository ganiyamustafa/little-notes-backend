import ClientError from '../../exceptions/ClientError';
import { Request, Response } from 'express';
import noteSerializer from '../../serializer/notes';
import userSerializer from '../../serializer/users';

class GroupHandler {
  constructor(private _service, private _noteService, private _validator) {
    this.postGroupHandler = this.postGroupHandler.bind(this);
    this.getGroupsHandler = this.getGroupsHandler.bind(this);
    this.getGroupNotesByIdHandler = this.getGroupNotesByIdHandler.bind(this);
    this.getGroupMembersByIdHandler = this.getGroupMembersByIdHandler.bind(this);
    this.getGroupByIdHandler = this.getGroupByIdHandler.bind(this);
    this.putGroupByIdHandler = this.putGroupByIdHandler.bind(this);
    this.putGroupNotesByIdHandler = this.putGroupNotesByIdHandler.bind(this);
    this.deleteGroupByIdHandler = this.deleteGroupByIdHandler.bind(this);
    this.deleteGroupNotesByIdHandler = this.deleteGroupNotesByIdHandler.bind(this);
    this.deleteGroupsMembersByIdHandler = this.deleteGroupsMembersByIdHandler.bind(this);
  }

  async getGroupsHandler(req: Request, res: Response) {
    const page = parseInt((req.query.page || 1).toString());
    const limit = parseInt((req.query.limit || 10).toString());
    const offset = (page - 1) * limit;
    const { search } = req.query;
    const { userId: credentialId } = req['auth'];

    const groups = await this._service.findAll(credentialId, { search, limit, offset });
    const total_groups = await this._service.countDocuments(credentialId, { search });

    const meta = { 
      page, 
      limit, 
      'total_notes': total_groups,
      'last_page': Math.ceil(total_groups / limit) || 1
    }

    return res.status(200).send({
      status: 'success',
      data: groups,
      meta
    });
  }

  async getGroupByIdHandler(req: Request, res: Response) {
    try {
      const { userId: credentialId } = req['auth'];
      const { groupId } = req.params;
      const { populate } = req.query;

      await this._service.verifyGroupAccess(groupId, credentialId);
      const group = await this._service.findOne(groupId, { populate });
      
      return res.status(200).send({
        status: 'success',
        data: {
          group: group
        }
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  async getGroupNotesByIdHandler(req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page || 1).toString());
      const limit = parseInt((req.query.limit || 10).toString());
      const offset = (page - 1) * limit;

      const { search } = req.query;
      const { userId: credentialId } = req['auth'];
      const { groupId } = req.params;
      
      await this._service.verifyGroupAccess(groupId, credentialId);
      const group = await this._service.findNotes(groupId, { search, limit, offset });
      const total_notes = await this._service.countNotes(groupId, { search });;

      const meta = { 
        page, 
        limit, 
        'total_notes': total_notes,
        'last_page': Math.ceil(total_notes / limit) || 1
      }

      return res.status(200).send({
        status: 'success',
        data: group.notes,
        meta
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  async getGroupMembersByIdHandler(req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page || 1).toString());
      const limit = parseInt((req.query.limit || 10).toString());
      const offset = (page - 1) * limit;

      const { userId: credentialId } = req['auth'];
      const { groupId } = req.params;
      
      await this._service.verifyGroupAccess(groupId, credentialId);
      const group = await this._service.findMembers(groupId, { limit, offset });
      const total_members = await this._service.countMembers(groupId);

      const meta = { 
        page, 
        limit, 
        'total_members': total_members,
        'last_page': Math.ceil(total_members / limit) || 1
      }

      return res.status(200).send({
        status: 'success',
        data: {
          owner: userSerializer(group.owner),
          members: group.members.map((member) => userSerializer(member))
        },
        meta
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: 'server error',
      });
    }
  }

  async postGroupHandler(req: Request, res: Response) {
    try {
      this._validator.validatePostGroupPayload(req.body);
      const { userId: credentialId } = req['auth'];
      const { name, members } = req.body;

      const group = await this._service.create({ owner: credentialId, name, members })
      
      return res.status(201).send({
        status: 'success',
        message: "success create group",
        data: {
          groupId: group.id
        }
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: "server error",
      });
    }
  }

  async putGroupByIdHandler(req: Request, res: Response) {
    try {
      this._validator.validatePutGroupPayload(req.body);
      const { groupId } = req.params;
      const { name, members } = req.body;
      const { userId: credentialId } = req['auth'];
      await this._service.verifyGroupOwner(groupId, credentialId);

      if (members) {
        await this._service.verifyMembers(groupId, members);
      }
      
      const group = await this._service.update(groupId, { name, members });

      return res.status(200).send({
        status: 'success',
        message: "success update group",
        data: {
          groupId: group.id
        }
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: 'server error',
      });
    }
  }

  async putGroupNotesByIdHandler(req: Request, res: Response) {
    try {
      this._validator.validatePutGroupPayload(req.body);
      const { groupId } = req.params;
      const { notes } = req.body;
      const { userId: credentialId } = req['auth'];

      await this._service.verifyGroupAccess(groupId, credentialId);
      await this._noteService.verifyOwners(notes, credentialId);
      const group = await this._service.update(groupId, { notes });

      return res.status(200).send({
        status: 'success',
        message: "success update group",
        data: {
          groupId: group.id
        }
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: 'server error',
      });
    }
  }

  async deleteGroupByIdHandler(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const { userId: credentialId } = req['auth'];
      await this._service.verifyGroupOwner(groupId, credentialId);
      
      const group = await this._service.delete(groupId);

      return res.status(200).send({
        status: 'success',
        message: "success delete group",
        data: {
          groupId: group.id
        }
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: 'server error',
      });
    }
  }

  async deleteGroupsMembersByIdHandler(req: Request, res: Response) {
    try {
      this._validator.validatePutGroupPayload(req.body);
      const { groupId } = req.params;
      const { members } = req.body;
      const { userId: credentialId } = req['auth'];
      await this._service.verifyGroupOwner(groupId, credentialId);
      
      const group = await this._service.removeData(groupId, { members });

      return res.status(200).send({
        status: 'success',
        message: "success update group",
        data: {
          groupId: group.id
        }
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: 'server error',
      });
    }
  }

  async deleteGroupNotesByIdHandler(req: Request, res: Response) {
    try {
      this._validator.validatePutGroupPayload(req.body);
      const { groupId } = req.params;
      const { notes } = req.body;
      const { userId: credentialId } = req['auth'];
      await this._service.verifyGroupAccess(groupId, credentialId);
      
      const group = await this._service.removeData(groupId, { notes });

      return res.status(200).send({
        status: 'success',
        message: "success update group",
        data: {
          groupId: group.id
        }
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).send({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).send({
        status: 'error',
        message: 'server error',
      });
    }
  }
}

export default GroupHandler
