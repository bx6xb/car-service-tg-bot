export const notFound = (entityName: string, entity?: string) => {
  if (!entity) {
    throw new Error(`No ${entityName} found`);
  }
};
