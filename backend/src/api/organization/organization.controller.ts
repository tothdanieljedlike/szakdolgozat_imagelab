import {Authorized, Body, Delete, Get, JsonController, Param, Put} from 'routing-controllers';
import {SuperController} from '../../super/super.controller';
import {Organization} from '../../types/organization';
import {ROLES} from '../../types/user';
import {OrganizationModel} from './organization.model';
import {OrganizationRepository} from './organization.repository';

@JsonController('/organization')
export class OrganizationController extends SuperController<OrganizationModel> {
    constructor() {
        super(new OrganizationRepository(OrganizationModel));
    }

    @Get()
    getAll(): Promise<Organization[]> {
        return super.getAll();
    }

    @Get('/id/:id')
    getById(@Param('id') id: number): Promise<Organization> {
        return super.getById(id);
    }

    @Put('/id/:id')
    @Authorized(ROLES.ADMIN)
    update(
        @Param('id') id: number,
        @Body({required: true}) item: Organization,
    ): Promise<Organization> {
        return super.update(id, item);
    }

    @Delete('/id/:id')
    @Authorized(ROLES.ADMIN)
    async delete(@Param('id') id: number): Promise<Organization> {
        return super.delete(id);
    }

    getByName(@Param('name') name: string): Promise<Organization> {
        return (this.repository as OrganizationRepository).getByName(name);
    }

    add(item: OrganizationModel): Promise<Organization> {
        return super.add(item);
    }
}
