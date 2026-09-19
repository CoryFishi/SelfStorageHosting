import type { Source } from "@/lib/sources";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

/**
 * A citation link on a light surface, reading "Publisher: Title". The link
 * text names the publisher, so a screen-reader user browsing a list of links
 * still knows whose document each one is. Where the target is a PDF, the
 * title says so.
 */
export default function SourceLink({ source }: { source: Source }) {
  return (
    <a href={source.url} className={`font-medium underline ${FOCUS_RING_LIGHT}`}>
      {source.publisher}: {source.title}
    </a>
  );
}
