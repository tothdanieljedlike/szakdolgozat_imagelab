import {SuperRepository} from '../../super/super.repository';
import {OrganizationModel} from './organization.model';

export class OrganizationRepository extends SuperRepository<OrganizationModel> {
    getByName(name: string) {
        return this.repository.createQueryBuilder('org')
            .where('org.name', {name})
            .getOne();
    }
}
