export const isValidContent = (content: any) => {
  if (Array.isArray(content)) {
    return content.some(
      (item) =>
        item !== null && item !== '' && item !== 'null null' && item !== 'null',
    );
  }
  return content !== null && content !== '' && typeof content !== 'undefined';
};

export const filterGroups = (data: any[]) => {
  return data
    .map((group) => ({
      group: group.group.filter((item: any) => {
        if (item.type === 'sustainability_goals') {
          return isValidContent(item.content);
        } else if (item.type === 'price') {
          return isValidContent(item.content || item.free);
        }

        return isValidContent(item.content) || isValidContent(item.description);
      }),
    }))
    .filter((group) => group.group.length > 0);
};
