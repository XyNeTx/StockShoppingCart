// Server Components เรียก .NET API ตรง ส่วน browser เรียกผ่าน rewrite /api/* ใน next.config.ts
const BASE_URL =
  typeof window === "undefined"
    ? (process.env.API_URL ?? "http://localhost:5202")
    : "";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(0, "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
  }
  const text = await res.text();
  if (!res.ok) {
    // .NET API ส่ง { message } มาเมื่อเกิด error เช่น สินค้าในสต็อกไม่พอ
    let message = `เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง (${res.status})`;
    try {
      message = JSON.parse(text).message ?? message;
    } catch {}
    throw new ApiError(res.status, message);
  }
  return (text ? JSON.parse(text) : undefined) as T;
}
