let pendingFile: File | null = null;

export const setPendingFile = (f: File) => {
  pendingFile = f;
};

export const takePendingFile = (): File | null => {
  const f = pendingFile;
  pendingFile = null;
  return f;
};
