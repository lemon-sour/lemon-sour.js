// https://stackoverflow.com/questions/7323932/how-do-you-follow-an-http-redirect-in-node-js
// https://github.com/follow-redirects/follow-redirects
// import * as http from 'http';
// import * as https from 'https';
const http = require('follow-redirects').http
const https = require('follow-redirects').https
import * as URL from 'url'
import * as fs from 'fs'
import razer from 'razer'
import C from '../common/constants'

function download(
  fileUrl: string,
  distPath: string,
  progress: (percent: string, bytes: number) => void,
  callback: () => void
) {
  return new Promise(
    (resolve: (value?: any) => void, reject: (err: any) => void) => {
      let timeout = 10000

      let file = fs.createWriteStream(distPath)

      const parsedUrl = URL.parse(fileUrl)
      let httpObject
      if (parsedUrl.protocol === 'https:') {
        httpObject = https
      } else {
        httpObject = http
      }

      let request = httpObject.get(fileUrl).on('response', (res: any) => {
        if (res.statusCode !== C.HTTP_OK) {
          clearTimeout(timeoutId)
          reject(new Error(res.statusMessage))
          return
        }

        let len = parseInt(res.headers['content-length'], 10)
        let downloaded = 0

        res
          .on('data', (chunk: any) => {
            file.write(chunk)
            downloaded += chunk.length
            razer(
              'Downloading ' +
                ((100.0 * downloaded) / len).toFixed(2) +
                '% ' +
                downloaded +
                ' bytes'
            )
            progress(((100.0 * downloaded) / len).toFixed(0), downloaded)

            // reset timeout
            clearTimeout(timeoutId)
            timeoutId = setTimeout(fn, timeout)
          })
          .on('end', () => {
            // clear timeout
            clearTimeout(timeoutId)
            file.end()
            razer('downloaded to: ' + distPath)
            resolve()
            callback()
          })
          .on('error', (err: any) => {
            // clear timeout
            razer('res.on(error): ' + err.message)
            clearTimeout(timeoutId)
            reject(err)
          })
      })

      // error handler
      request.on('error', (err: any) => {
        razer('request.on(error): ' + err.message)
        clearTimeout(timeoutId)
        reject(new Error(err.message))
      })

      // generate timeout handler
      let fn = timeoutWrapper(request)

      // set initial timeout
      let timeoutId = setTimeout(fn, timeout)
    }
  )
}

function timeoutWrapper(req: any) {
  return () => {
    req.abort()
  }
}

export default download
