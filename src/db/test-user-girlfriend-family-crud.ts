import "dotenv/config";

const userId = "b5a7a9bd-803a-44e2-87ad-e0a58a74b1e5";
const baseUrl = 'http://localhost:3000/api/users/${userId}/girlfriend/family';

async function main() {
    console.log("=== KIZ ARKADAŞ AİLE BİLGİSİ API TESTİ BAŞLIYOR ===");

    console.log("\n1. CREATE GIRLFRİEND FAMILY INFO (POST)");
    const createResponse = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fatherName: "Hasan",
            motherName: "Fatma"
        }),
    });
    console.log("CREATE STATUS:", createResponse.status);

    console.log("\n2. GET GIRLFRİEND FAMILY INFO (GET)");
    const getResponse = await fetch(baseUrl, {method: "GET"});
    console.log("GET STATUS:", getResponse.status);

    console.log("\n3. UPDATE GIRLFRIEND FAMILY INFO (PATCH)");
    const updateResponse = await fetch(baseUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fatherName: "Hüseyin",
        }),
    });
    console.log("UPDATE STATUS:", updateResponse.status);
    console.log("\n4. DELETE GIRLFRIEND FAMILY INFO (DELETE)");
    const deleteResponse = await fetch(baseUrl, { method: "DELETE" });
    console.log("DELETE STATUS:", deleteResponse.status);

    console.log("\n=== KIZ ARKADAŞ AİLE BİLGİSİ API TESTİ TAMAMLANDI ===");
}
main().catch(console.error);