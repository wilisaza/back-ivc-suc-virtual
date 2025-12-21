import { DateTime } from 'luxon'
import crypto from "crypto";

export const encrypt = (arg) => {
  const digest = crypto.createHash("sha1").update(arg).digest();
  let hexString = "";

  for (let i = 0; i < digest.length; i++) {
    hexString += (digest[i] & 0xff).toString(16);
  }

  return hexString;
}

export const isEmpty = (arg) => {
  let isEmpty = false
  if (
    typeof arg === 'boolean' ||
    arg instanceof Date ||
    arg instanceof DateTime ||
    arg instanceof Function
  ) {
    isEmpty = false
  } else if (!arg && typeof arg !== 'number') {
    isEmpty = true
  } else if (typeof arg === 'string' || Array.isArray(arg)) {
    isEmpty = arg.length === 0
  } else if (typeof arg === 'object') {
    isEmpty = Object.keys(arg).length === 0
  }
  return isEmpty
}

/*
 * Función para convertir un string a un numero (incluye float o integer).
 */
export const toNumber = (arg) => {
  if (isEmpty(arg) || typeof arg === 'number') {
    return arg
  }

  // Verifica si el string contiene solo números o un punto para los decimales o un signo negativo.
  if (!/^-?[0-9]+(\.[0-9]+)?$/.test(arg)) {
    return null
  }

  const number = parseFloat(arg)
  return isNaN(number) ? null : number
}