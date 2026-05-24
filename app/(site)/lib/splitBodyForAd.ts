export function splitBodyForAd(body: Record<string, unknown>): {
  before: Record<string, unknown>;
  after: Record<string, unknown> | null;
} {
  const root = body.root as Record<string, unknown> | undefined;
  if (!root) return { before: body, after: null };

  const children = root.children as Record<string, unknown>[] | undefined;
  if (!children?.length) return { before: body, after: null };

  const firstParaIdx = children.findIndex(
    (node) => (node as Record<string, unknown>).type === "paragraph",
  );
  if (firstParaIdx === -1) return { before: body, after: null };

  const splitIdx = firstParaIdx + 1;
  if (splitIdx >= children.length) return { before: body, after: null };

  const before: Record<string, unknown> = {
    ...body,
    root: { ...root, children: children.slice(0, splitIdx) },
  };
  const after: Record<string, unknown> = {
    ...body,
    root: { ...root, children: children.slice(splitIdx) },
  };

  return { before, after };
}
