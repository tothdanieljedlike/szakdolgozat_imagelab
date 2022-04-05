import {getManager, ObjectType, Repository} from 'typeorm';
import {sendError} from '../util/web/sendError';

export class SuperRepository<T extends {id: number}> {
    repository: Repository<T>;

    constructor(type: ObjectType<T>) {
        this.repository = getManager().getRepository<T>(type);
    }

    getAll(): Promise<T[]> {
        return this.repository.find();
    }

    getById(id: number): Promise<T> {
        return this.repository.findOneById(id);
    }

    async update(id: number, item: T): Promise<T> {// id, item as any
        await this.repository.update(id, item as any);
        return item;
    }

    add(item: T): Promise<T> {
        return this.repository.save(item as any);
    }

    async delete(item: T): Promise<T> {
        if (!item) {return sendError('invalid id'); }
        return this.repository.remove(item);
    }

    deleteAll() {
        return this.repository.createQueryBuilder().delete().execute();
    }
}
