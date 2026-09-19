import { assertNoForbiddenTypes } from "@/lib/schema";

export default function JsonLd({ data }: { data: object }) {
  assertNoForbiddenTypes(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
