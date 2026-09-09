import { createLucideIcon, type IconNode } from "lucide-react";

/** SVG-level attributes that lucide sets itself and should not be copied onto children. */
const SKIP_ATTRS = new Set([
  "xmlns",
  "viewBox",
  "width",
  "height",
  "class",
  "role",
  "aria-hidden",
]);

const SHAPE_TAGS = [
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
];

/**
 * Parses a raw SVG string into a lucide IconNode.
 *
 * Only the shape elements are kept — <title>, <desc>, <defs> and the wrapper
 * <svg> are dropped, since lucide supplies its own wrapper and sizing.
 *
 * `filled` controls how the shapes are painted. Lucide's own icons are line
 * drawings, so the wrapper sets fill="none" stroke="currentColor". Brand marks
 * are usually solid shapes and need that flipped, which is the default here.
 */
export function svgToIconNode(svg: string, filled = true): IconNode {
  const tagPattern = new RegExp(
    `<(${SHAPE_TAGS.join("|")})\\b([^>]*?)/?>`,
    "gi",
  );

  const nodes: IconNode = [];

  for (const match of svg.matchAll(tagPattern)) {
    const tag = match[1].toLowerCase();
    const attrs: Record<string, string> = {};

    for (const attr of match[2].matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) {
      if (!SKIP_ATTRS.has(attr[1])) attrs[attr[1]] = attr[2];
    }

    if (filled) {
      attrs.fill = attrs.fill ?? "currentColor";
      attrs.stroke = attrs.stroke ?? "none";
    }

    nodes.push([tag, attrs] as IconNode[number]);
  }

  if (nodes.length === 0) {
    throw new Error("svgToIconNode: no shape elements found in the SVG");
  }

  return nodes;
}

/**
 * Builds a lucide icon component from a raw SVG string. The result accepts the
 * same props as any lucide icon — size, className, strokeWidth, and so on.
 *
 *   export const XIcon = svgToLucideIcon("X", rawSvgString);
 *   <XIcon className="h-4 w-4" />
 */
export function svgToLucideIcon(name: string, svg: string, filled = true) {
  return createLucideIcon(name, svgToIconNode(svg, filled));
}
