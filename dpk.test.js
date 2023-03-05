const crypto = require("crypto");

const { deterministicPartitionKey } = require('./index');

describe("deterministicPartitionKey", () => {
  it("returns trivial partition key if no event is provided", () => {
    const result = deterministicPartitionKey(null);
    expect(result).toBe("0");
  });

  it("returns partition key if it is present in the event", () => {
    const event = { partitionKey: "abc" };
    const result = deterministicPartitionKey(event);
    expect(result).toBe("abc");
  });

  it("returns hash of the event as the partition key if it is not present", () => {
    const event = { name: "test" };
    const result = deterministicPartitionKey(event);
    const expected = crypto
      .createHash("sha3-512")
      .update(JSON.stringify(event))
      .digest("hex");
    expect(result).toBe(expected);
  });

});
