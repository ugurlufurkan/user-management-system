export {};

const baseUrl = "http://localhost:3000/api/sections";

async function request(
  url: string,
  options?: RequestInit
): Promise<{
  status: number;
  data: unknown;
}> {
  const response = await fetch(url, options);

  let data: unknown = null;

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    data = await response.json();
  }

  return {
    status: response.status,
    data,
  };
}

async function testSectionCrud() {
  const sectionName = `CRUD Section ${Date.now()}`;

  console.log("1. CREATE");

  const createResult = await request(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: sectionName,
    }),
  });

  console.log("Status:", createResult.status);

  if (createResult.status !== 201) {
    throw new Error(`CREATE failed: ${JSON.stringify(createResult.data)}`);
  }

  const createdSection = createResult.data as {
    id: string;
  };

  console.log("✅ CREATE successful");
  console.log("Section ID:", createdSection.id);

  console.log("\n2. GET ALL");

  const listResult = await request(baseUrl, {
    method: "GET",
  });

  console.log("Status:", listResult.status);

  if (listResult.status !== 200) {
    throw new Error(`GET ALL failed: ${JSON.stringify(listResult.data)}`);
  }

  console.log("✅ GET ALL successful");

  console.log("\n3. GET ONE");

  const getResult = await request(`${baseUrl}/${createdSection.id}`, {
    method: "GET",
  });

  console.log("Status:", getResult.status);

  if (getResult.status !== 200) {
    throw new Error(`GET ONE failed: ${JSON.stringify(getResult.data)}`);
  }

  console.log("✅ GET ONE successful");

  console.log("\n4. UPDATE");

  const updatedName = `Updated ${sectionName}`;

  const updateResult = await request(`${baseUrl}/${createdSection.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: updatedName,
    }),
  });

  console.log("Status:", updateResult.status);

  if (updateResult.status !== 200) {
    throw new Error(`UPDATE failed: ${JSON.stringify(updateResult.data)}`);
  }

  console.log("✅ UPDATE successful");

  console.log("\n5. DELETE");

  const deleteResult = await request(`${baseUrl}/${createdSection.id}`, {
    method: "DELETE",
  });

  console.log("Status:", deleteResult.status);

  if (deleteResult.status !== 204) {
    throw new Error(`DELETE failed: ${JSON.stringify(deleteResult.data)}`);
  }

  console.log("✅ DELETE successful");

  console.log("\n6. VERIFY DELETE");

  const verifyResult = await request(
    `${baseUrl}/${createdSection.id}`,
    {
      method: "GET",
    }
  );

  console.log("Status:", verifyResult.status);

  if (verifyResult.status !== 404) {
    throw new Error(
      `DELETE verification failed: ${JSON.stringify(verifyResult.data)}`
    );
  }

  console.log("✅ DELETE verification successful");

  console.log("\n🎉 Section CRUD test completed successfully");
}

testSectionCrud().catch((error) => {
  console.error("\n❌ Section CRUD test failed");
  console.error(error);
  process.exitCode = 1;
});