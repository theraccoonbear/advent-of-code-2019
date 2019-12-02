const { MongoClient } = require("mongodb");

const connectionUrl = require("../migration-config").mongodb.url;

/**
 * Jest config
 */
jest.setTimeout(10000);

let connection;

beforeAll(async () => {
  if (global.INJECT_DB === false) {
    return;
  }
  connection = await MongoClient.connect(
    connectionUrl,
    { useNewUrlParser: true }
  );
  global.db = await connection.db(`MIGRATE-TEST_${process.env.JEST_WORKER_ID}`);
});

beforeEach(async () => {
  if (global.INJECT_DB === false) {
    return;
  }
});

afterEach(async () => {
  if (global.INJECT_DB === false) {
    return;
  }

  // Effectively removes all collections and documents. Keeps db clean between
  // tests, and will make sure the test db doesn't exist after tests are complete
  await global.db.dropDatabase();
});

afterAll(async () => {
  if (global.INJECT_DB === false) {
    return;
  }
  await connection.close();
});
