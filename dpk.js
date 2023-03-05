/*
The original code had nested conditional statements that made it difficult to read and understand. The refactored code simplifies the logic by flattening the conditionals, which makes it more readable and easier to follow. The code first checks if the event object exists and has a partitionKey property, and if it does, it uses that as the candidate partition key. If not, it creates a JSON string of the event and hashes it using SHA3-512 to get the candidate partition key. If the candidate partition key is not a string, it is converted to a JSON string. Finally, if the candidate partition key is too long, it is hashed again using SHA3-512.

The main advantage of the refactored code is that it is more readable and easier to understand, making it easier to maintain and debug. It also handles edge cases more gracefully, such as when the input event object is empty or when the JSON string of the event object is empty. Additionally, the refactored code reduces the number of times the SHA3-512 hashing algorithm is used, which can improve performance.
*/

const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  let candidate = event.partitionKey;

  if (!candidate) {
    const data = JSON.stringify(event);
    if (!data) {
      return TRIVIAL_PARTITION_KEY;
    }
    candidate = crypto.createHash("sha3-512").update(data).digest("hex");
  }

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  return candidate;
};
