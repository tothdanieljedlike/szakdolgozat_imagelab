import {SuperRepository} from '../../super/super.repository';
import {UserModel} from './user.model';

export class UserRepository extends SuperRepository<UserModel> {
    getByEmail(email: string) {
        return this.repository.createQueryBuilder('user')
            .leftJoin('user.organization', 'organization')
            .select([
                'user.id',
                'user.firstName',
                'user.lastName',
                'user.role',
                'user.email',
                'user.password',
                'user.reset',
                'user.institution',
                'organization.id',
                'organization.name',
            ])
            .where('user.email = :email', {email})
            .getOne();
    }
    // .andWhere('user.token = :empty', {empty: ''})
    getByToken(token: string) {
        return this.repository.createQueryBuilder('user')
            .select()
            .where('token = :token', {token})
            .getMany();
    }

    getByResetToken(token: string) {
        return this.repository.createQueryBuilder('user')
            .select()
            .where('reset = :token', {token})
            .getMany();
    }

    validateUser(token: string, university: string) {
        return this.repository.createQueryBuilder()
            .update(UserModel)
            .set({ token: '' , institution:university})
            .where('token = :token', {token})
            .execute();
    }

    resetUserPassword(token: string, password: string) {
        return this.repository.createQueryBuilder()
            .update(UserModel)
            .set({ reset: '', password })
            .where('reset = :token', {token})
            .execute();
    }

    async add(user: UserModel) {
        const newUser = await super.add(user);
        return await this.getById(newUser.id);
    }

    getFullUserById(id: number): Promise<UserModel> {
        return this.repository.createQueryBuilder('user')
            .leftJoinAndSelect('user.cards', 'card')
            .leftJoinAndSelect('user.comments', 'comment')
            .leftJoinAndSelect('user.ratings', 'rating')
            .where('user.id = :id', {id})
            .getOne();
    }
}
