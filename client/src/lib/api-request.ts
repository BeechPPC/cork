import { useAuth } from "@/components/auth-wrapper";

// Custom API request function that includes auth tokens
export async function apiRequestWithAuth(
  method: string,
  url: string,
  data?: any
): Promise<Response> {
  const { getToken } = useAuth();
  
  const token = await getToken?.();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (data && (method === "POST" || method === "PATCH" || method === "PUT")) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response;
}