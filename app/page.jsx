import HomeClient from "./HomeClient";

// Server-side function to fetch projects
async function getProjects() {
  try {
    const res = await fetch(
      "https://devparvesserver.vercel.app/api/portfolio/get-portfolio-data",
      { cache: "no-store" } 
    );

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.projects) ? data.projects : [];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export default async function HomePage() {
  const projects = await getProjects(); // ✅ SSR fetch

  return (
    <main className="flex flex-col min-h-screen w-full">
      <HomeClient projects={projects} />
    </main>
  );
}