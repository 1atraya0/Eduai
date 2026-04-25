import { notFound } from "next/navigation";
import ResourceScreen from "@/components/ResourceScreen";
import { getRouteFromSlug } from "@/lib/resourcePages";

export default async function ResourceRoutePage({ params }) {
  const { slug } = await params;
  const route = getRouteFromSlug(slug);

  if (!route) {
    notFound();
  }

  return <ResourceScreen initialRoute={route} />;
}
