export const renameQuery = (query, name) => {
  const regexPattern = /(query\s+).*?([\{\(])/
  return query.replace(regexPattern, '$1' + name + ' $2')
}
