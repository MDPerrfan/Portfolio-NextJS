// lib/api.js
// Single source of truth for all API calls
// Server components use this directly — no useEffect, no loading state

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getProjects() {
    try {
        const res = await fetch(`${BASE_URL}/projects`, {
            next: { revalidate: 3600 }, // cache for 1 hour, auto-revalidate
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data.projects) ? data.projects : [];
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        return [];
    }
}

export async function getAbout() {
    try {
        const res = await fetch(`${BASE_URL}/about`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.about ?? null;
    } catch (err) {
        console.error("Failed to fetch about:", err);
        return null;
    }
}

export async function submitContact(formData) {
    const res = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
    return res.json();
}