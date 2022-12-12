import { Request, Response } from 'express';
import ClientError from '../../exceptions/ClientError';
import noteSerializer from '../../serializer/notes';

class NotesHandler {
  constructor(private _service, private _validator) {
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(req: Request, res: Response) {
    try {
      this._validator.validatePostNotePayload(req.body);
      const { userId } = req['auth'];
      const note = await this._service.create({ userId, ...req.body });
      return res.status(201).send({
        status: 'success',
        message: "success create note",
        data: {
          noteId: note.id
        }
      });
    } catch(error) {
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

  async getNotesHandler(req: Request, res: Response) {
    const page = parseInt((req.query.page || 1).toString());
    const limit = parseInt((req.query.limit || 10).toString());
    const offset = (page - 1) * limit;
    const { search, isArchived } = req.query;
    const { userId: credentialId } = req['auth'];

    const notes = await this._service.findAll(credentialId, { search, isArchived, limit, offset });
    const total_notes = await this._service.countDocuments(credentialId, { search, isArchived });

    const meta = { 
      page, 
      limit, 
      'total_data': total_notes,
      'last_page': Math.ceil(total_notes / limit) || 1
    }

    return res.status(200).send({
      status: 'success',
      data: notes.map((note) => noteSerializer(note)),
      meta: meta
    });
  }

  async getNoteByIdHandler(req: Request, res: Response) {
    try {
      const { noteId } = req.params;
      const { userId: credentialId } = req['auth'];

      await this._service.verifyOwner(noteId, credentialId);
      const note = await this._service.findOne(noteId);

      return res.status(200).send({
        status: 'success',
        message: 'success',
        data: noteSerializer(note)
      });
    } catch(error) {
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

  async putNoteByIdHandler(req: Request, res: Response) {
    try {
      this._validator.validatePutNotePayload(req.body);

      const { noteId } = req.params
      const { userId: credentialId } = req['auth'];

      await this._service.verifyOwner(noteId, credentialId);
      const note = await this._service.update(noteId, req.body);

      return res.status(200).send({
        status: 'success',
        message: "success update note",
        data: {
          noteId: note.id
        }
      });
    } catch(error) {
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

  async deleteNoteByIdHandler(req: Request, res: Response) {
    try {
      const { noteId } = req.params
      const { userId: credentialId } = req['auth'];

      await this._service.verifyOwner(noteId, credentialId)
      const note = await this._service.delete(noteId);
      
      return res.status(200).send({
        status: 'success',
        message: "success update note",
        data: {
          noteId: note.id
        }
      });
    } catch(error) {
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
}

export default NotesHandler
