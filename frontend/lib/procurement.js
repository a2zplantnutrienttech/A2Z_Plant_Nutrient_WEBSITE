// Extended API client for procurement flows
export async function sendProfileRequest(payload) {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || "";
  const res = await fetch(`${BACKEND_URL}/api/profile-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}
