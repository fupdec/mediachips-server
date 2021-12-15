import axios from 'axios'
const path = require('path')

const ApiCalls = {
  install(Vue, options) {
    Vue.prototype.$getLocalImage = async function (imgPath) {
      let result
      await axios({
          method: 'post',
          url: options.store.state.localhost + '/api/get-file',
          responseType: 'blob',
          data: {
            url: imgPath,
          }
        })
        .then(res => {
          result = URL.createObjectURL(res.data)
        })
        .catch(e => {
          result = path.join(__dirname, '/images/ghost.png')
          // console.log(e)
        })
      return result
    }
    Vue.prototype.$createThumb = function (timestamp, inputPath, outputPath, width, overwrite) {
      return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: options.store.state.localhost + '/api/Functions/createThumb',
            data: {
              timestamp,
              inputPath,
              outputPath,
              width,
              overwrite
            }
          })
          .then(res => {
            resolve(res)
          })
          .catch(e => {
            console.log(e)
            reject(e)
          })
      })
    }
  }
}

export default ApiCalls