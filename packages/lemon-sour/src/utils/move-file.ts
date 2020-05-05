import mv from 'mv'
import * as fs from 'fs'
import razer from 'razer'

/**
 * moveFile
 * @param prevPath
 * @param nextPath
 */
const moveFile = (prevPath: string, nextPath: string) => {
  return new Promise(
    (resolve: (value?: any) => void, reject: (err: any) => void) => {
      fs.readdir(prevPath, (err, files) => {
        if (err) {
          reject(err)
          return
        }

        const fileList: string[] = []
        files.forEach((file) => {
          fileList.push(file)
          mv(
            prevPath + '/' + file,
            nextPath + '/' + file,
            { mkdirp: true },
            (err: any) => {
              if (err) {
                // 一番最初はまだファイルがないので失敗するので、ここのエラーは基本的に無視する
                // reject(err);
                // return;
              }
            }
          )
        })

        razer(
          `Moving up the file list: ${fileList} to the ${nextPath} directory`
        )
        resolve()
      })
    }
  )
}

export { moveFile }
