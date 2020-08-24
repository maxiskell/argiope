import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
class Report {
  @Field(() => [String])
  crawling!: Set<string>;

  @Field(() => Int)
  crawled: number;
}

export default Report;
