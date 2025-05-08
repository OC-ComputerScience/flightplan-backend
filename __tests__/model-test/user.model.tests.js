import { jest } from "@jest/globals";
import SequelizeMock from "sequelize-mock";
import User from "../../app/models/user.model.js";

// Create Sequelize instance for mocks
const dbMock = new SequelizeMock();

dbMock.sync = () => Promise.resolve();
dbMock.close = () => Promise.resolve();

jest.unstable_mockModule(
  "../../app/sequelizeUtils/sequelizeInstance.js",
  () => ({
    default: dbMock,
  }),
);

describe("User Model Tests", () => {
  beforeAll(async () => {
    await dbMock.sync({ force: true });
  });

  afterAll(async () => {
    await dbMock.close();
  });

  it("should create a user successfully", async () => {
    // dumby data (Thats valid of course)
    const userData = {
      fName: "John",
      lName: "Doe",
      email: "john.doe@example.com",
      fullName: "John Doe",
    };

    const user = await User.create(userData);

    expect(user.id).toBeDefined();
    expect(user.fName).toBe(userData.fName);
    expect(user.lName).toBe(userData.lName);
    expect(user.email).toBe(userData.email);
    expect(user.fullName).toBe(userData.fullName);

    await User.destroy({ where: { id: user.id } });
  });

  it("should not create a user without an email", async () => {
    try {
      await User.create({
        fName: "Jane",
        lName: "Doe",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeValidationError");
    }
  });

  it("should not create a user with a duplicate email", async () => {
    const userData = {
      fName: "Alice",
      lName: "Smith",
      email: "alice.smith@example.com",
      fullName: "Alice Smith",
    };

    const user1 = await User.create(userData);
    let user2 = null;
    try {
      user2 = await User.create({
        fName: "Bob",
        lName: "Johnson",
        email: "alice.smith@example.com", //SAme email to test duplicates
        fullName: "Bob Johnson",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.name).toBe("SequelizeUniqueConstraintError");
    } finally {
      await User.destroy({ where: { id: user1.id } });
      if (user2) {
        await User.destroy({ where: { id: user2.id } });
      }
    }
  });
});
