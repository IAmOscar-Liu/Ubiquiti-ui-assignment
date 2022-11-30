import { SubTask } from "../types";

export const arrangeSubTask = (subTasks: SubTask[]) => {
  subTasks.sort(
    (a, b) =>
      a.subTaskPath.split(" -> ").length - b.subTaskPath.split("->").length
  );

  const roots = subTasks.filter((s) => s.subTaskPath.split("->").length <= 1);
  const nests = subTasks.filter((s) => s.subTaskPath.split("->").length > 1);

  for (let nest of nests) {
    const paths = nest.subTaskPath
      .split("->")
      .slice(1)
      .map((p) => p.trim().match(/[0-9]+/)?.[0])
      .map((p) => Number(p));
    if (paths.find((p) => !p)) continue;

    let parentCandidates: SubTask[] | undefined = roots;

    while (
      paths.length > 0 &&
      parentCandidates &&
      parentCandidates.length > 0
    ) {
      const parentId = paths.shift();
      const parent: SubTask | undefined = parentCandidates.find(
        (p) => p.id === parentId!
      );

      if (parent && paths.length === 0) {
        if (!parent.children) parent.children = [];
        parent.children.push(nest);
      }

      if (!parent) break;

      parentCandidates = parent.children;
    }
  }

  return roots;
};
