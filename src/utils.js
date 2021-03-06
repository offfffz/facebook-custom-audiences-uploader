const fs = require("fs")
const sha256 = require("js-sha256")

const check = (error) => {
  if (!error) return true

  console.error(error)
  return false
}

const normalizeStr = (str) => {
  if (typeof str !== "string") return str

  const replacedStr = str.replace(/\"/, "")
  const lowercasedStr = replacedStr.toLowerCase()
  const trimmedStr = lowercasedStr.trim()

  return trimmedStr
}

const hashStr = (str) => {
  if (typeof str !== "string") return str

  return sha256(str)
}

const getConfig = () => {
  let data = fs.readFileSync("config.json")
  let object = JSON.parse(data)

  return object
}

module.exports = {
  getConfig,
  check,
  normalizeStr,
  hashStr,
}
