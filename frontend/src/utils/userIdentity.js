export const getCreatorName = (value) => {
  if (value === "test@promptlibrary.dev" || value === "test user") {
    return "test user";
  }
  return value || "Unknown";
};

export const isPromptOwner = (createdBy, currentUserEmail) => {
  if (!createdBy || !currentUserEmail) {
    return false;
  }

  const currentUserName = getCreatorName(currentUserEmail);
  return createdBy === currentUserEmail || createdBy === currentUserName;
};
