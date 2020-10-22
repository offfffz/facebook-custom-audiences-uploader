const { Command } = require("commander")
const { init, uploader } = require(".")

const program = new Command()
program.version("0.0.1")

program.command("init").action(() => init())
program.command("upload").action(() => uploader())

program.parse(process.argv)
