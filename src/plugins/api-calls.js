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
    Vue.prototype.$checkFileExists = async function (filePath, isMedia) {
      let res = null
      try {
        res = await axios({
          method: 'post',
          url: options.store.state.localhost + '/api/Task/checkFileExists',
          data: {
            path: filePath,
            isMedia: isMedia,
          }
        })
      } catch (error) {
        res = error
      }
      return res
    }
    Vue.prototype.$getLocalImage = async function (imgPath, outside) {
      let result
      await axios({
          method: 'post',
          url: options.store.state.localhost + '/api/get-file',
          responseType: 'blob',
          data: {
            url: imgPath,
            outside: outside,
          }
        })
        .then(res => {
          result = URL.createObjectURL(res.data)
        })
        .catch(e => {
          result = path.join(__dirname, '/images/unavailable.png')
          // console.log(e)
        })
      return result
    }
    Vue.prototype.$createImage = async function (image, outputPath) {
      const res = await axios({
        method: 'post',
        url: options.store.state.localhost + '/api/Task/createImage',
        data: {
          image,
          outputPath,
        }
      })
      return res
    }
    Vue.prototype.$deleteLocalImage = async function (imgPath) {
      const res = await axios({
        method: 'post',
        url: options.store.state.localhost + '/api/Task/deleteImage',
        data: {
          path: imgPath,
        }
      })
      return res
    }
    Vue.prototype.$createThumb = async function (timestamp, inputPath, outputPath, width, overwrite) {
      const res = await axios({
        method: 'post',
        url: options.store.state.localhost + '/api/Task/createThumb',
        data: {
          timestamp,
          inputPath,
          outputPath,
          width,
          overwrite
        }
      })
      return res
    }
    Vue.prototype.$getOption = async function (option) {
      const res = await axios.get(options.store.state.localhost + "/api/Setting/" + option)
      return res
    }
    Vue.prototype.$setOption = async function (option, value) {
      const res = await axios({
        method: 'put',
        url: options.store.state.localhost + "/api/Setting/" + option,
        data: {
          value
        }
      })
      return res
    }
    Vue.prototype.$createDbEntry = async function (value, model) {
      const res = await axios({
        method: 'post',
        url: options.store.state.localhost + "/api/" + model,
        data: value
      })
      return res
    }
    Vue.prototype.$openPath = async function (entryPath, isDirectory) {
      axios({
        method: "post",
        url: options.store.state.localhost + "/api/Task/openPath",
        data: {
          path: entryPath,
          isDir: isDirectory,
        },
      });
    }
    Vue.prototype.$getWatchedFolders = async () => {
      let result = [];
      await axios
        .get(options.store.state.localhost + "/api/MediaTypesInWatchedFolders")
        .then((res) => {
          let watchedFolders = res.data;
          let types = {}
          for (let i of watchedFolders) {
            let id = i.folderId
            if (!types[id]) types[id] = []
            types[id].push(i.mediaType);
          }
          let folders = _.uniqBy(watchedFolders, (i) => i.folderId);
          for (let i of folders) {
            let obj = i.watchedFolder
            obj.types = types[i.folderId]
            result.push(obj)
          }
        })
        .catch((e) => {
          console.log(e);
        });
      return result;
    }
  }
}

export default ApiCalls