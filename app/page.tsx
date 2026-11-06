import { getPublishedContent } from "@/lib/db";
import PublicPressKit from "@/components/public/PublicPressKit";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getPublishedContent();
  return <PublicPressKit data={content} />;
}

