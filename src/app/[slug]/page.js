import { notFound } from "next/navigation";
import ResourceScreen from "@/components/ResourceScreen";
import { getResourcePageByRoute } from "@/lib/resourcePages";

export default async function ResourceRoutePage({ params }) {
  const { slug } = await params;
  const source = getResourcePageByRoute(slug);

  if (!source) {
    notFound();
  }

  return <ResourceScreen src={source} />;
}
