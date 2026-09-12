import "dotenv/config";

const baseUrl = "http://localhost:3000/api/users";

async function main() {
  let createdUserId = "";

  console.log("1. CREATE USER");

  const createResponse = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId: "02006656-efe5-4af9-8c7f-7dd7a1a4b93d",
      firstName: "Integration",
      lastName: "Test",
    }),
  });

  console.log("CREATE STATUS:", createResponse.status);

  if (createResponse.status !== 201) {
    throw new Error(
      `User creation failed: ${await createResponse.text()}`
    );
  }

  const createdUser = await createResponse.json();
  createdUserId = createdUser.id;

  console.log("CREATED USER:", createdUser);

  console.log("\n2. GET ALL USERS");

  const listResponse = await fetch(baseUrl, {
    method: "GET",
  });

  console.log("GET ALL STATUS:", listResponse.status);

  if (listResponse.status !== 200) {
    throw new Error(`User listing failed: ${await listResponse.text()}`);
  }

  const users = await listResponse.json();

  if (!Array.isArray(users)) {
    throw new Error("User list response is not an array");
  }

  console.log("TOTAL USERS:", users.length);

  console.log("\n3. GET ONE USER");

  const getOneResponse = await fetch(`${baseUrl}/${createdUserId}`, {
    method: "GET",
  });

  console.log("GET ONE STATUS:", getOneResponse.status);

  if (getOneResponse.status !== 200) {
    throw new Error(`User lookup failed: ${await getOneResponse.text()}`);
  }

  const fetchedUser = await getOneResponse.json();

  if (fetchedUser.id !== createdUserId) {
    throw new Error("Returned user id does not match created user id");
  }

  console.log("FETCHED USER:", fetchedUser);

  console.log("\n4. UPDATE USER");

  const updateResponse = await fetch(`${baseUrl}/${createdUserId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: "Updated",
      lastName: "Integration",
    }),
  });

  console.log("UPDATE STATUS:", updateResponse.status);

  if (updateResponse.status !== 200) {
    throw new Error(
      `User update failed: ${await updateResponse.text()}`
    );
  }

  const updatedUser = await updateResponse.json();

  if (
    updatedUser.firstName !== "Updated" ||
    updatedUser.lastName !== "Integration"
  ) {
    throw new Error("User update values are incorrect");
  }

  console.log("UPDATED USER:", updatedUser);

  console.log("\n5. DELETE USER");

  const deleteResponse = await fetch(`${baseUrl}/${createdUserId}`, {
    method: "DELETE",
  });

  console.log("DELETE STATUS:", deleteResponse.status);

  if (deleteResponse.status !== 204) {
    throw new Error(
      `User deletion failed: ${await deleteResponse.text()}`
    );
  }

  console.log("USER DELETED");

  console.log("\n6. VERIFY DELETE");

  const verifyResponse = await fetch(`${baseUrl}/${createdUserId}`, {
    method: "GET",
  });

  console.log("VERIFY DELETE STATUS:", verifyResponse.status);

  if (verifyResponse.status !== 404) {
    throw new Error(
      `Deleted user still exists: ${await verifyResponse.text()}`
    );
  }

  console.log("\nUSER CRUD TEST PASSED");
}

main().catch((error) => {
  console.error("\nUSER CRUD TEST FAILED");
  console.error(error);
  process.exit(1);
});