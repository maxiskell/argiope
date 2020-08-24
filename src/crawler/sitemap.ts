import { ObjectType, Field } from "type-graphql";

@ObjectType()
class SiteMap {
  @Field(() => String)
  url!: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => [String], { nullable: true })
  links?: Set<string>;
}

export default SiteMap;
