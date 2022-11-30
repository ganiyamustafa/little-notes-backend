import NotFoundError from '../../exceptions/NotFoundError';
import ClientError from '../../exceptions/ClientError';
import { Note, NoteInterface } from '../../models/NoteSchema';
import { isValidObjectId } from 'mongoose';
import AuthorizationError from '../../exceptions/AuthorizationError';

export default class NotesService {
  constructor(private readonly _note: typeof Note) { }

  async findAll(uId: string, { title='', isArchived=false, limit=10, offset=0 }): Promise<NoteInterface[]> {
    return await this._note.find({ title: { $regex: `.*${title}.*` }, isArchived, user: uId }).sort({ isPinned: -1 }).skip(offset).limit(limit).exec();
  }

  async verifyOwner(noteId: string, uId: string) {
    if (!isValidObjectId(noteId)) {
      throw new NotFoundError(`note not found`);
    }

    const note = await this._note.findById(noteId).select('user');

    if (!note) {
      throw new NotFoundError('note not found');
    }

    if (note.user.toString() !== uId) {
      throw new AuthorizationError("can't access this source");
    }
  }

  async verifyOwners(noteIds: Array<string>, uId: string) {
    noteIds.forEach((noteId) => {
      if (!isValidObjectId(noteId)) {
        throw new ClientError(`invalid cast id ${noteId}`);
      } 
    })

    const notes = await this._note.find({ _id: { $in: noteIds } }).select('id, user');
    
    if (!notes.length) {
      throw new NotFoundError('note not found');
    }

    if (notes) {
      notes.forEach((note) => {
        if (note.user.toString() !== uId ) {
          throw new AuthorizationError(`can't access note with id ${note.id}`);
        }
      })
    }
  }

  async findOne(id: string): Promise<NoteInterface> {
    if (!isValidObjectId(id)) {
      throw new NotFoundError(`note not found`);
    }

    const note = await this._note.findById(id).exec();

    if (!note) {
      throw new NotFoundError(`note not found`);
    }

    return note;
  }

  async create({userId, title, description}): Promise<NoteInterface> {
    try {
      return await new this._note({ user: userId, title, description }).save();
    } catch (error) {
      if (error.name === "ValidationError") {
        Object.keys(error.errors).forEach((key) => {
          throw new ClientError(error.errors[key].message);
        });
      }
      throw new Error(error);
    }
  }

  async update(id: string, {title, description, isPinned}): Promise<NoteInterface> {
    try {
      if (!isValidObjectId(id)) {
        throw new NotFoundError(`note not found`);
      }

      const updatedAt = new Date();
      const note = await this._note.findByIdAndUpdate(id, {title, description, isPinned, updatedAt}).exec();

      if (!note) {
        throw new NotFoundError(`note not found`);
      }

      return note;
    } catch (error) {
      if (error.name === "ValidationError") {
        Object.keys(error.errors).forEach((key) => {
          throw new ClientError(error.errors[key].message);
        });
      }
      
      throw new Error(error);
    }
  }
  
  async delete(id: string): Promise<NoteInterface> {
    return this._note.findByIdAndDelete(id).exec();
  }

  async countDocuments(uId: string, { search='', isArchived=false }): Promise<number> {
    return await this._note.countDocuments({ title: { $regex: `.*${search}.*` }, isArchived, user: uId }).exec();
  }
}