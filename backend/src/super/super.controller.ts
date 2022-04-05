import {Body} from 'routing-controllers';
import {SuperRepository} from './super.repository';

export abstract class SuperController<T extends {id: number}> {
    constructor(protected repository: SuperRepository<T>) { }

    getAll(...attr: any[]) {
        return this.repository.getAll();
    }

    getById(id: number, ...attr: any[]) {
        return this.repository.getById(id);
    }

    update(id: number, @Body() item: T, ...attr: any[]) {
        return this.repository.update(id, item);
    }

    add(item: T, ...attr: any[]): Promise<T> {
        return this.repository.add(item);
    }

    async delete(item: number | T, ...attr: any[]) {
        if (typeof item === 'number') {
            item = await this.getById(item);
        }
        return this.repository.delete(item);
    }

    public deleteAll() {
        return this.repository.deleteAll();
    }
}
