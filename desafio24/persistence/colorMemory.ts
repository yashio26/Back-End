import type { Color } from "../colorType.ts";

const colors: Color[] = []

export const getAll = (): Color[] => {
  return colors
}

export const saveColor = (
  code: string,
): Color => {
  const color: Color = {
    id: globalThis.crypto.randomUUID(),
    code,
  }
  colors.push(color)
  return color
};