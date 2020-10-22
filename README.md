# Facebook Custom Audiences Uploader
It is a command line utility to upload a customer list to Facebook Marketing Platform.

_Data Cleansing_: This application will trim and hash data by _sha256_ automatically, so you don't have to prepare hashed data file.

_Rate Limit_: This application put the customer data into batches and upload them sequentially without handling any rate limit. You may see the error in `error.log` after it finished if the rate limit is hit. (PR is welcome)

# Usages

## Installation

1. Download the executable from the release page.
2. Place the executable somewhere on your machine or server
3. Run init command.
   1. macos: `./audience-uploader-macos init`
   2. linux: `./audience-uploader-linux init`
   3. windows: `./audience-uploader-win.exe init`
4. update `config.json` with your Facebook __AccessToken__ and __CustomAudienceID__

## Prepare Audiences file
1. Look into `audiences.csv`, you will see a sample set of customer information (you should be able to run the `upload` command without errors at this point)
2. Place you customer data into this file. Do not hash data, the command will trim and hash data with _sha256_ automatically
3. Edit `mapping` values within `config.json` to match your data structures (it is defaulted to "EMAIL,PHONE,FN,LN")

## Upload Audiences
1. run command
   1. macos: `./audience-uploader-macos upload`
   2. linux: `./audience-uploader-linux upload`
   3. windows: `./audience-uploader-win.exe upload`
2. If there are no errors, the `error.log` will stay empty after it finished.
3.