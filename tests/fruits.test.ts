import supertest from "supertest";
import app from "../src/app";

const server = supertest(app);

describe("POST /fruits", () => {
  it("should return 201 when inserting a fruit", async () => {
    const body = {
      name: "banana",
      price: "2.00",
    };

    const sendFruit = await server.post("/fruits").send(body);
    expect(sendFruit.status).toEqual(201);
  });

  it("should return 409 when inserting a fruit that exists already", async () => {
    const body = {
      name: "banana",
      price: "2.00",
    };

    const sendFruitAgain = await server.post("/fruits").send(body);
    expect(sendFruitAgain.status).toEqual(409);
  });

  it("should return 422 when missing a info", async () => {
    const body = {
      name: "banana",
    };

    const fruitWithoutPrice = await server.post("/fruits").send(body);
    expect(fruitWithoutPrice.status).toEqual(422);
  });
});

describe("GET /fruits", () => {
  it("should return 404 when a fruit doesn't exist", async () => {
    const { statusCode } = await server.get("/fruits/123");
    expect(statusCode).toBe(404);
  });

  it("should return 400 when id params is not valid", async () => {
    const { statusCode } = await server.get("/fruits/banana");
    expect(statusCode).toBe(400);
  });

  it("should return a fruit with given id", async () => {
    const { body }= await server.get("/fruits/1");
    expect(body).toEqual({
      name: "banana",
      price: "2.00",
      id: 1
  });
  });

  it("should return all fruits", async () => {
    const { body } = await server.get("/fruits");
    expect(body).toHaveLength(1);
  });
})