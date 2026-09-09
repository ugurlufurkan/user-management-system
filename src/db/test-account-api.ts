async function testAccountApi() {
  const response = await fetch("http://localhost:3000/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: `api-script-${Date.now()}@example.com`,
      passwordHash: "test-hash",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${JSON.stringify(data)}`
    );
  }

  console.log("✅ Account API test successful");
  console.log(data);
}

testAccountApi().catch((error) => {
  console.error("❌ Account API test failed");
  console.error(error);
  process.exitCode = 1;
});