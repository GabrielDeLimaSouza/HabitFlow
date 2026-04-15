/**
 * Retorna a data local atual no formato YYYY-MM-DD.
 * Usa o locale sv-SE que produz formato ISO sem depender do UTC.
 * @returns {string}
 */
export function localDateISO() {
  return new Date().toLocaleDateString('sv')
}

/**
 * Retorna a data de ontem no formato YYYY-MM-DD considerando o fuso local.
 * @returns {string}
 */
export function yesterdayISO() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('sv')
}
