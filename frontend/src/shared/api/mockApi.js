export function mockFetch(path) {
  return Promise.resolve({ path, data: null });
}
