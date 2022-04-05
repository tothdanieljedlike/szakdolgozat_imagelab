import {MinLength} from 'class-validator';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {Organization} from '../../types/organization';

@Entity()
export class OrganizationModel implements Organization {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        nullable: false,
    })
    @MinLength(3)
    name: string;
}
