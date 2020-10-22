const { hashStr, normalizeStr, getConfig } = require("./utils")
const { init } = require("./initializer")
const adsSDK = require("facebook-nodejs-business-sdk")
const fs = require("fs")
const readline = require("readline")

const lineProcessor = (schema) => {
  return (line) => {
    if (typeof line !== "string") return line

    const splitted = line.split(",")
    if (splitted.length !== schema.length) {
      console.error("schema mismatched", schema, splitted)
      return
    }

    return splitted.map((val) => hashStr(normalizeStr(val)))
  }
}

const uploader = () => {
  const {
    accessToken,
    customAudienceID,
    header,
    mapping,
    batchSize,
  } = getConfig()
  const schema = Object.entries(mapping)
    .sort((a, b) => a[0] - b[0])
    .map((v) => v[1])
  const processLine = lineProcessor(schema)
  const rd = readline.createInterface({
    input: fs.createReadStream("audiences.csv"),
  })

  let headerSkipped = !header
  const data = []
  let batchNumber = 0

  rd.on("line", async (line) => {
    if (!headerSkipped) {
      headerSkipped = true
      return
    }

    data.push(line)

    if (data.length === batchSize) {
      console.info(
        `process batch ${batchNumber}: line ${batchNumber * batchSize} to ${
          (batchNumber + 1) * batchSize - 1
        }`
      )
      rd.pause()
      const [resp, error] = await uploadUsers({
        accessToken,
        customAudienceID,
        schema: schema,
        data: data.map(processLine),
      })

      if (error) {
        console.error(
          `process batch ${batchNumber}: line ${batchNumber * batchSize} to ${
            (batchNumber + 1) * batchSize - 1
          }`,
          error
        )
      } else {
        console.info(
          `process batch ${batchNumber}: line ${batchNumber * batchSize} to ${
            (batchNumber + 1) * batchSize - 1
          } done!`
        )
      }

      rd.resume()
      data.length = 0
      batchNumber++
    }
  })

  rd.on("close", async () => {
    if (data.length !== 0) {
      console.info(
        `process batch ${batchNumber}: line ${batchNumber * batchSize} to ${
          (batchNumber + 1) * batchSize - 1
        }`
      )
      const [resp, error] = await uploadUsers({
        accessToken,
        customAudienceID,
        schema: schema,
        data: data.map(processLine),
      })
      if (error) {
        console.error(
          `process batch ${batchNumber}: line ${batchNumber * batchSize} to ${
            (batchNumber + 1) * batchSize - 1
          }`,
          error
        )
      } else {
        console.info(
          `process batch ${batchNumber}: line ${batchNumber * batchSize} to ${
            (batchNumber + 1) * batchSize - 1
          } done!`
        )
      }
      data.length = 0
    }
  })
}

const uploadUsers = async ({
  customAudienceID,
  accessToken,
  schema = [],
  data = [],
}) => {
  const { CustomAudience } = adsSDK
  const api = adsSDK.FacebookAdsApi.init(accessToken)

  try {
    const customAudience = new CustomAudience(customAudienceID)
    const resp = await customAudience.createUser(null, {
      payload: { schema, data },
    })
    return [resp, null]
  } catch (error) {
    return [null, error]
  }
}

module.exports = {
  init,
  uploader,
}
