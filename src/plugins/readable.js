const Cols = require('../../filter-cols')

const Readable = {
  install(Vue, options) {
    Vue.prototype.$checkCurrentPage = function (page) {
      return options.router.history.current.path.includes(page)
    }
    Vue.prototype.$getReadableFileSize = function (bytes) {
      if (bytes > 1000000000000) bytes = (bytes / 1024 / 1024 / 1024 / 1024 - 0.01).toFixed(2) + ' TB'
      else if (bytes > 1000000000) bytes = (bytes / 1024 / 1024 / 1024 - 0.01).toFixed(2) + ' GB'
      else if (bytes > 1000000) bytes = (bytes / 1024 / 1024 - 0.01).toFixed(0) + ' MB'
      else if (bytes > 1000) bytes = (bytes / 1024 - 0.01).toFixed(0) + ' KB'
      else bytes += ' B'
      return bytes
    }
    Vue.prototype.$getReadableDuration = function (duration) {
      let sec = Math.floor(duration)
      let h = sec / 3600 ^ 0
      let m = (sec - h * 3600) / 60 ^ 0
      let s = sec - h * 3600 - m * 60
      h = h < 10 ? "0" + h + ":" : h
      if (h === "00:") h = ""
      m = m < 10 ? "0" + m : m
      s = s < 10 ? "0" + s : s
      let total = h + m + ":" + s
      return total
    }
    Vue.prototype.$getReadableBitrate = function (value) {
      if (value > 1000000) value = (value / 1024 / 1024 - 0.01).toFixed(0) + ' Mbps'
      else if (value > 1000) value = (value / 1024 - 0.01).toFixed(0) + ' Kbps'
      else value += ' bps'
      return value
    }
    Vue.prototype.$getReadableVideoQuality = function (width, height) {
      if (width > height) {
        if (height < 720) return 'SD'
        else if (height >= 720 && height < 1080) return 'HD'
        else if (height >= 1080 && height < 1800) return 'FHD'
        else if (height >= 1800) return 'UHD'
      } else return 'Phone'
    }
    Vue.prototype.$getReadableVideoHeight = function (width, height) {
      if (height > 1800 && width > height) return '4K'
      else return height + 'p'
    }
    Vue.prototype.$getFileNameFromPath = function (fullPath) {
      return fullPath.split('\\').pop().split('/').pop().replace(/\.[^/.]+$/, "")
    }
    Vue.prototype.$getFileExtensionFromPath = function (fullPath) {
      return fullPath.split('.').pop().toLowerCase()
    }
    Vue.prototype.$getIconDataType = function (type) {
      if (type === "string") return "mdi-alphabetical";
      if (type === "date") return "mdi-calendar";
      if (type === "number") return "mdi-numeric";
      if (type === "array") return "mdi-code-array";
      if (type === "boolean") return "mdi-toggle-switch";
      if (type === "rating") return "mdi-star";
      return "mdi-shape";
    }
    Vue.prototype.$validateName = function (string) {
      string = string.trim().toLowerCase()
      if (string.length > 50) return 'Name must be less than 99 characters'
      else if (string.length === 0) return 'Name is required'
      else if (/[\\\/\%"?<>{}\[\]]/g.test(string)) return 'Name must not content \\/\%\"<>{}\[\]'
      else return true
    }
    Vue.prototype.$transformTextToArray = function (string) {
      let arr = string.trim();
      arr = arr.split(/\r?\n/);
      arr = arr.filter((el) => el != "");
      arr = arr.map((s) => s.trim());
      return arr
    }
    Vue.prototype.$checkColorForDarkText = function (color) {
      // Variables for red, green, blue values
      let r, g, b, hsp;

      // Check the format of the color, HEX or RGB?
      if (color.match(/^rgb/)) {
        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

        r = color[1];
        g = color[2];
        b = color[3];
      } else {
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace(
          color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
      }

      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
      );

      // Using the HSP value, determine whether the color is light or dark
      return hsp < 160
    }
    Vue.prototype.$showHoverImage = function (event, metaId, itemId) {
      if (event.buttons !== 0) return
      let x = event.clientX
      let y = event.clientY
      let appHeight = window.innerHeight
      let appWidth = window.innerWidth
      let imgSize = 160
      let doubleOffset = 60
      if (appWidth < x + imgSize + doubleOffset) x -= (imgSize + doubleOffset)
      if (appHeight < y + imgSize + doubleOffset) y -= (imgSize + doubleOffset)
      options.store.state.hover.x = x
      options.store.state.hover.y = y
      options.store.state.hover.show = true
      options.store.state.hover.itemId = itemId
      options.store.state.hover.metaId = metaId

      options.store.state.hover.time = new Date().getTime()
      setTimeout(() => {
        let currentTime = new Date().getTime()
        if (currentTime - options.store.state.hover.time > 4500)
          options.store.state.hover.show = false
      }, 5000)
    }
    Vue.prototype.$filterItems = function (sets, itemsType) {
      /** 
       * Creating query for getting items from database.
       * @param {array} filters - with filter objects.
       */
      let filters = sets.filters
      let videoCols = Cols.video.map(i => i.by)
      const isFilterByVideo = filters.some(i => videoCols.includes(i.by))
      const isFilterTypeArray = filters.some(i => i.type === 'array')

      const parseFilters = (arr) => {
        let q = ""
        for (let i of arr) {
          if (videoCols.includes(i.by)) i.by = 'videoMetadata.' + i.by
          if (i.type === 'string') {
            q += `${i.union} ${i.by} ${i.cond} `;
            if (!i.cond.includes('null')) {
              q += `'%${i.val}%' `;
            }
          } else if (i.type === 'number') {
            q += `${i.union} ${i.by} ${i.cond} ${i.val} `;
          } else if (i.type === 'date') {
            q += `${i.union} ${i.by} ${i.cond} '${i.val} 00:00:00.000' `;
          } else if (i.type === 'boolean') { // TODO rating type
            q += `${i.union} ${i.by} ${i.cond} 1 `;
          } else if (i.type === 'array') { // TODO fix values
            console.log(i.val)
            // q += `${i.union} itemsIn${itemsType}.childItemId ${i.cond} (${i.val.join()}) `;
          }
        }
        return q
      }

      let q = `SELECT * FROM ${itemsType} `;
      if (isFilterByVideo) {
        q += "INNER JOIN videoMetadata ON media.id = videoMetadata.mediaId ";
      }
      if (isFilterTypeArray) {
        if (itemsType == 'media') {
          q += "INNER JOIN itemsInMedia ON media.id = itemsInMedia.mediaId ";
        } else if (itemsType == 'items') {
          q += "INNER JOIN itemsInItems ON items.id = itemsInItems.itemId ";
        }
      }
      if (itemsType == 'media') {
        q += `WHERE typeId = ${sets.typeId} `;
      } else if (itemsType == 'items') {
        q += `WHERE metaId = ${sets.metaId} `;
      }
      q += parseFilters(filters);
      q += "GROUP BY id ";
      q += `ORDER BY ${sets.sortBy} ${sets.sortDir} `;
      return q
    };
  }
}

export default Readable