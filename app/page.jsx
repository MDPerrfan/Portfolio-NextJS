import HomeClient from "./HomeClient";
import { getProjects, getAbout } from "@/lib/api";

export default async function HomePage() {
 const [projects, about] = await Promise.all([
    getProjects(),
    getAbout(),
  ]);

  return (
    <main className="flex flex-col min-h-screen w-full">
      <HomeClient projects={projects} about={about}/>
    </main>
  );
}