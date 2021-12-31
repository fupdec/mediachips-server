import axios from 'axios'
const path = require('path')

const ApiCalls = {
  install(Vue, options) {
    Vue.prototype.$getLocalhost = function () {
      return new Promise((resolve, reject) => {
        axios.get('/config.json')
          .then(res => {
            const config = res.data
            options.store.state.localhost = `http://${config.ip}:${config.port}`;
            resolve(res)
          })
          .catch(e => {
            console.log(e)
            reject(e)
          })
      })
    }
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
    Vue.prototype.$getOption = function (option) {
      return new Promise((resolve, reject) => {
        let url = `/api/Setting?option=${option}`;
        axios
          .get(options.store.state.localhost + url)
          .then(res => {
            resolve(res)
          })
          .catch(e => {
            console.log(e)
            reject(e)
          })
      })
    }
    Vue.prototype.$setOption = function (option, value) {
      return new Promise((resolve, reject) => {
        axios({
            method: 'put',
            url: options.store.state.localhost + '/api/Setting',
            data: {
              option,
              value,
            },
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