import "dotenv/config";

// Not: Gerçek bir test için veritabanında kayıtlı bir userId'yi buraya yazmalısınız.
const userId = "b5a7a9bd-803a-44e2-87ad-e0a58a74b1e5"; 
const baseUrl = `http://localhost:3000/api/users/${userId}/family`;

async function main() {
  console.log("=== AİLE BİLGİSİ API TESTİ BAŞLIYOR ===");

  console.log("\n1. CREATE FAMILY INFO (POST)");
  const createResponse = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fatherName: "Ali",
      motherName: "Ayşe",
    }),
  });
  console.log("CREATE STATUS:", createResponse.status);

  console.log("\n2. GET FAMILY INFO (GET)");
  const getResponse = await fetch(baseUrl, { method: "GET" });
  console.log("GET STATUS:", getResponse.status);

  console.log("\n3. UPDATE FAMILY INFO (PATCH)");
  const updateResponse = await fetch(baseUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fatherName: "Veli",
    }),
  });
  console.log("UPDATE STATUS:", updateResponse.status);

  console.log("\n4. DELETE FAMILY INFO (DELETE)");
  const deleteResponse = await fetch(baseUrl, { method: "DELETE" });
  console.log("DELETE STATUS:", deleteResponse.status);

  console.log("\n=== TEST BİTTİ ===");
}

main().catch(console.error);