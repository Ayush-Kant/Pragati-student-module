import { normalizeDiscussionQuery, parseTags } from "../utils/discussionHelpers.js";

describe("discussion helpers", () => {
  it("builds filter and pagination options from a query object", () => {
    const result = normalizeDiscussionQuery({
      search: "react",
      category: "general",
      tags: "node,postgres",
      sortBy: "popular",
      page: "2",
      pageSize: "10",
    });

    expect(result.where).toMatchObject({
      category: "general",
      tags: { overlap: ["node", "postgres"] },
    });
    expect(result.where["$or"]).toBeDefined();
    expect(result.pagination).toEqual({ page: 2, pageSize: 10, offset: 10 });
    expect(result.sortBy).toBe("popular");
  });

  it("parses tag input into a clean array", () => {
    expect(parseTags("node, postgres,react")).toEqual(["node", "postgres", "react"]);
    expect(parseTags(["node", " postgres ", ""])).toEqual(["node", "postgres"]);
  });
});
