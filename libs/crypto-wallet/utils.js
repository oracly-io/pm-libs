export const toHex = (num) => {
  const val = Number(num)
  return val ? '0x' + val.toString(16) : num
}