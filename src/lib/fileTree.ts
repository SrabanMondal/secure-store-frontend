import { File } from "@/store/files";

export function buildFileTree(files: File[]) {
  const tree: any = {};

  files.forEach((file) => {
    const parts = file.file_path.split("/");
    let current = tree;

    parts.forEach((part, idx) => {
      if (!current[part]) {
        current[part] = { __files: [] };
      }
      if (idx === parts.length - 1) {
        current[part].__files.push(file);
      } else {
        current = current[part];
      }
    });
  });

  return tree;
}

// helper to drill into tree by path
export function getNodeAtPath(tree: any, path: string[]) {
  let current = tree;
  for (const segment of path) {
    if (!current[segment]) return {};
    current = current[segment];
  }
  return current;
}
