import { Query } from "type-graphql";

import * as packageJson from "../../package.json";

class VersionResolver {
  @Query(() => String)
  public version(): string {
    return packageJson.version;
  }
}

export default VersionResolver;
