export const slugConvert = (title: string) => {
  return title.replace(/\s+/g, "-").toLowerCase();
};
