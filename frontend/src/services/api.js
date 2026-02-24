const apiBase = "/api";

// Simple API helper for the frontend.
// Because the backend is stateless and uses JWT, any number of frontend
// instances (or devices) can talk to any backend instance as long as the
// Authorization header is set.
class ApiClient {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const res = await fetch(`${apiBase}${path}`, {
      ...options,
      headers
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(data?.message || "Request failed");
    }

    return data;
  }

  get(path) {
    return this.request(path, { method: "GET" });
  }

  post(path, body) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(body || {})
    });
  }

  patch(path, body) {
    return this.request(path, {
      method: "PATCH",
      body: JSON.stringify(body || {})
    });
  }
}

export const api = new ApiClient();

