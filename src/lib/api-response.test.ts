import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { errorResponse, successResponse } from "@/lib/api-response";

describe("API response helpers", () => {
  it("should create a success response with default status 200", async () => {
    const response = successResponse({
      message: "Success",
    });

    assert.equal(response.status, 200);

    const body = await response.json();

    assert.deepEqual(body, {
      message: "Success",
    });
  });

  it("should create a success response with custom status", async () => {
    const response = successResponse(
      {
        message: "Created",
      },
      201
    );

    assert.equal(response.status, 201);

    const body = await response.json();

    assert.deepEqual(body, {
      message: "Created",
    });
  });

  it("should create an error response", async () => {
    const response = errorResponse("User not found", 404);

    assert.equal(response.status, 404);

    const body = await response.json();

    assert.deepEqual(body, {
      error: "User not found",
    });
  });

  it("should include details when provided", async () => {
    const response = errorResponse(
      "Request failed",
      500,
      "Database connection failed"
    );

    assert.equal(response.status, 500);

    const body = await response.json();

    assert.deepEqual(body, {
      error: "Request failed",
      details: "Database connection failed",
    });
  });
});