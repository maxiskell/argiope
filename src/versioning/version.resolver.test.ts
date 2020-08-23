import { VersionResolver } from "./version.resolver";

it("resolves version", () => {
  const resolver = new VersionResolver();
  expect(resolver.version()).toEqual("0.0.1");
});
