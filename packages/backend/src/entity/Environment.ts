import { ExternalEntity } from './BaseEntity';
import { Entity, Column, OneToMany, ManyToOne, Unique } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { Network } from './Network';
import { Lazy } from '../types';
import { Organization } from './Organization';
import { Matches, Length } from 'class-validator';
import { NAME_REGEX } from '../constants';

@ObjectType()
@Entity()
@Unique(['name', 'organization'])
export class Environment extends ExternalEntity {
    static createDefaultEnvironments(organization: Organization) {
        return [
            this.createForOrganization(organization, 'prod', 'Production'),
            this.createForOrganization(organization, 'test', 'Test'),
        ];
    }

    static createForOrganization(organization: Organization, name: string, label: string) {
        const network = new Network();
        network.name = name;

        const environment = new Environment();
        environment.name = name;
        environment.label = label;
        environment.networks = [network];
        environment.organization = organization;

        return environment;
    }

    @Field()
    @Column()
    @Matches(NAME_REGEX)
    @Length(3, 20)
    name!: string;

    @Field()
    @Column()
    label!: string;

    @OneToMany(
        () => Network,
        network => network.environment,
        { lazy: true, cascade: true },
    )
    networks!: Lazy<Network[]>;

    @Field(() => Organization)
    @ManyToOne(
        () => Organization,
        organization => organization.environments,
        { lazy: true },
    )
    organization!: Lazy<Organization>;
}
