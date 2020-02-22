const request = require("supertest");

const server = require("./server.js");

describe("server.js", () => {
  describe("index route", () => {
    it("should set testing env", () => {
      expect(process.env.DB_ENV).toBe("testing");
    });

    it("should return an OK status code from the index route", async () => {
      const expectedStatusCode = 200;

      const response = await request(server).get("/");

      expect(response.status).toEqual(expectedStatusCode);
    });

    it("should return a JSON object from the index route", async () => {
      const expectedBody = { api: "running" };

      const response = await request(server).get("/");

      expect(response.body).toEqual(expectedBody);
    });

    it("should return a JSON object from the index route", async () => {
      const response = await request(server).get("/");

      expect(response.type).toEqual("application/json");
    });
  }),
    describe("jokes route", () => {
      it("should return 201 status code to get jokes", async () => {
        const expectedStatusCode = 201;
        const testUser = { username: "test1", password: "test1" };
        const login = await request(server).post("/api/auth/login", testUser);
        console.log(login.data);

        const response = await request(server).get("/api/jokes");

        expect(response.status).toEqual(expectedStatusCode);
      });
    }),
    describe("auth route", () => {
      it("should login successfully with test1 user", async () => {
        const expectedBody = { message: "Welcome test1!" };
        const response = await request(server).post("/api/auth/login", {
          username: "test1",
          password: "test1"
        });

        expect(response.body).toEqual(expectedBody);
      });
      it("should allow creation of new user test4", async () => {
        const expectedStatusCode = 201;

        const response = await request(server).post("/api/auth/register", {
          username: "test4",
          password: "test4"
        });

        expect(response.status).toEqual(expectedStatusCode);
      });
    });
});
