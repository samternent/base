export const find = (set, root) => {
  if (!(root in set)) {
    set[root] = root;
  }
  let part = root;
  while (set[part] !== part) {
    set[part] = set[set[part]];
    part = set[part]
  }
  return part;
}

export const union = (set, i, j) => {
  const iRoot = find(set, i);
  const jRoot = find(set, j);

  const unions = {
    ...set,
  };

  return (iRoot !== jRoot)
    ? { ...unions, [jRoot]: iRoot }
    : unions;
}

export const roots = (set) => (new Set(Object.values(set)));
