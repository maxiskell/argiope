import { ObjectType, Field } from "type-graphql";

import SiteMap from "./sitemap";

@ObjectType()
class Crawl {
  @Field(() => String)
  baseUrl!: string;

  @Field(() => [SiteMap], { nullable: true })
  sitemaps?: Set<SiteMap> | void;
}

export default Crawl;
