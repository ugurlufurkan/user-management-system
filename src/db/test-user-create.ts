export {};

const baseUrl = "http://localhost:3000/api/users";

async function testUserCreate() {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId: "02006656-efe5-4af9-8c7f-7dd7a1a4b93d",
      firstName: "Test",
      lastName: "User",
    }),
  });

  const data = await response.json();

  console.log("Status:", response.status);

  if (!response.ok) {
    throw new Error(
      `User creation failed: ${response.status} ${JSON.stringify(data)}`
    );
  }

  if (!data.id) {
    throw new Error("Created user does not contain an id");
  }

  console.log("✅ User creation API test successful");
  console.log(data);
}

testUserCreate().catch((error) => {
  console.error("❌ User creation API test failed");
  console.error(error);
  process.exitCode = 1;
});