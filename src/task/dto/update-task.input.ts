import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput {
    @Field(() => Int)
    id: number;

    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    completed?: boolean;
}