export const notesKeys = {
  all: ['notes'],
  lists: () => [...notesKeys.all, 'list'],
  list: (filters) => [...notesKeys.lists(), filters],
  dashboard: () => [...notesKeys.all, 'dashboard'],
  details: () => [...notesKeys.all, 'detail'],
  detail: (id) => [...notesKeys.details(), id],
};

export const invalidateNotesQueries = (queryClient) =>
  queryClient.invalidateQueries({ queryKey: notesKeys.all });
