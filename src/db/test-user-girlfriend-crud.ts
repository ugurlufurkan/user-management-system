import "dotenv/config";

// Not: Gerçek bir test için veritabanında kayıtlı bir userId'yi buraya yazmalısınız.
const userId = "b5a7a9bd-803a-44e2-87ad-e0a58a74b1e5"; 
const baseUrl = `http://localhost:3000/api/users/${userId}/girlfriend`;

async function main() {
  console.log("=== KIZ ARKADAŞ BİLGİSİ API TESTİ BAŞLIYOR ===");

  console.log("\n1. CREATE GIRLFRIEND INFO (POST)");
  const createResponse = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Zeynep",
      lastName: "Yılmaz",
    }),
  });
  console.log("CREATE STATUS:", createResponse.status);

  console.log("\n2. GET GIRLFRIEND INFO (GET)");
  const getResponse = await fetch(baseUrl, { method: "GET" });
  console.log("GET STATUS:", getResponse.status);

  console.log("\n3. UPDATE GIRLFRIEND INFO (PATCH)");
  const updateResponse = await fetch(baseUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lastName: "Kaya",
    }),
  });
  console.log("UPDATE STATUS:", updateResponse.status);

  console.log("\n4. DELETE GIRLFRIEND INFO (DELETE)");
  const deleteResponse = await fetch(baseUrl, { method: "DELETE" });
  console.log("DELETE STATUS:", deleteResponse.status);

  console.log("\n=== TEST BİTTİ ===");
}

main().catch(console.error);