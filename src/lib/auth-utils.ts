import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Şifreyi veritabanına kaydederken şifrelemek (hashlemek) için
export function hashPassword(password: string): string {
const salt = randomBytes(16).toString("hex");
const derivedKey = scryptSync(password, salt, 64).toString("hex");
return `${salt}:${derivedKey}`;
}

//Kullanıcı giriş yaparken şifresinin doğru olup olmadığını kontrol etmek için
export function verifyPassword(password: string, hash: string): boolean {
    try {
        const [salt, key] = hash.split(":");
        if(!salt || !key) return false;

        const keyBuffer = Buffer.from(key, "hex");
        const derivedKey = scryptSync(password, salt, 64);
        return timingSafeEqual(keyBuffer, derivedKey);
    } catch (error) {
        return false;
    }
}

// Her girişte kullanıcıya özel, tahmin edilemez oturum (session) anahtarı üretmek için
export function generateSessionToken(): string {
    return randomBytes(32).toString("hex");
}