const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  if (event) {
    event.partitionKey
      ? (candidate = event.partitionKey)
      : (candidate = crypto
          .createHash("sha3-512")
          .update(JSON.stringify(event))
          .digest("hex"));
  }

  if (candidate) {
    typeof candidate !== "string"
      ? (candidate = JSON.stringify(candidate))
      : (candidate = TRIVIAL_PARTITION_KEY);
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  return candidate;
};
