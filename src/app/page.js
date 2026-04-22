import ResourceScreen from "@/components/ResourceScreen";
import { getResourcePageByRoute } from "@/lib/resourcePages";

export default function Home() {
  const source = getResourcePageByRoute("");
  return <ResourceScreen src={source} />;
}
