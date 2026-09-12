async function testSectionCreate() {
  const response = await fetch("http://localhost:3000/api/sections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `Test Section ${Date.now()}`,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Section creation failed: ${response.status} ${JSON.stringify(data)}`
    );
  }

  console.log("✅ Section API creation successful");
  console.log(data);
}

testSectionCreate().catch((error) => {
  console.error("❌ Section API creation failed");
  console.error(error);
  process.exitCode = 1;
});