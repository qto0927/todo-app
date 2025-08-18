import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Task {
    @Field(() => ID)
    id: number;

    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    completed: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date
}