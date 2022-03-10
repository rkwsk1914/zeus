export class Validator {
  checkAlphaNum (strings) {
    const erroetMsg = 'Contains invalid characters. Only single-byte alphanumeric characters can be set.'
    const checkFormat = strings.match(/[^\w|^:|^\\|^\-|^.|^?|^&|^=|^/]+/)
    if (checkFormat) {
      return erroetMsg
    }
    return null
  }

  clearnPathString (strings) {
    let result = strings.replaceAll(/\\|\//g, '/')
    const checkStringsLast = result.match(/\/$/)
    if (!checkStringsLast) {
      result = result + '/'
    }
    return result
  }

  checkOnlyNumber (strings) {
    const erroetMsg = 'Contains invalid characters. Only 1-byte numbers can be set.'
    const checkFormat = strings.match(/[^\d]+/)
    if (checkFormat) {
      return erroetMsg
    }
    return null
  }

  checkMinLength (strings, minLength) {
    const erroetMsg = `Not enough letters. The minimum number of characters is ${minLength}.`
    if (strings.length < minLength) {
      return erroetMsg
    }
    return null
  }
}
