const fs = require("fs")
const { check } = require("./utils")

const initConfig = () => {
  if (fs.existsSync("config.json")) {
    console.log("config.json is already existed")
    return
  }

  fs.writeFile(
    "config.json",
    JSON.stringify(ConfigTemplate, false, 2),
    (error) => {
      if (check(error)) {
        console.log("config template created!")
      }
    }
  )
}

const initAudiences = () => {
  if (fs.existsSync("audiences.csv")) {
    console.log("audiences.csv is already existed")
    return
  }

  fs.writeFile("audiences.csv", AudiencesTemplate.join("\n"), (error) => {
    if (check(error)) {
      console.log("audiences template created!")
    }
  })
}

const init = () => {
  initConfig()
  initAudiences()
}

module.exports = {
  init,
}

/**
 * constants
 */
const ConfigTemplate = Object.freeze({
  accessToken: "<FACEBOOK_ACCESSTOKEN>",
  customAudienceID: "<CUSTOM_AUDIENCE_ID>",
  batchSize: 10000,
  header: true,
  mapping: {
    0: "EMAIL",
    1: "PHONE",
    2: "FN",
    4: "LN",
  },
})

const AudiencesTemplate = Object.freeze([
  ["email,phone,fn,ln"],
  ["someone@someurl.com,66860009999,someone,something"],
  ["another@someurl.com,,another,"],
])
