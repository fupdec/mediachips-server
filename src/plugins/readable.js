const Cols = require('../../app/configs/filter-cols.js')

const Readable = {
  install(Vue, options) {
    Vue.prototype.$checkCurrentPage = function (page) {
      return options.router.history.current.path.includes(page)
    }
    Vue.prototype.$getRandomId = function () {
      return Math.random().toString(16).slice(2);
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
    Vue.prototype.$getDateFromMs = function (ms) {
      let date = new Date(ms)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
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
    Vue.prototype.$foundByChars = function (text, query) {
      text = text.toLowerCase();
      let foundCharIndex = 0;
      let foundAllChars = false;
      for (let i = 0; i < query.length; i++) {
        const char = query.charAt(i);
        const x = text.indexOf(char, foundCharIndex);
        if (x > -1)(foundAllChars = true), (foundCharIndex = x + 1);
        else return false;
      }
      return foundAllChars;
    }
    Vue.prototype.$getListCond = function (type) {
      if (!type) return [];
      else if (type == "number" || type == "date")
        return [{
            cond: "=",
            icon: "equal",
            text: "equal",
          },
          {
            cond: "!=",
            icon: "not-equal-variant",
            text: "not equal",
          },
          {
            cond: ">",
            icon: "greater-than",
            text: "greater than",
          },
          {
            cond: "<",
            icon: "less-than",
            text: "less than",
          },
          {
            cond: ">=",
            icon: "greater-than-or-equal",
            text: "greater than or equal",
          },
          {
            cond: "<=",
            icon: "less-than-or-equal",
            text: "less than or equal",
          },
        ];
      else if (type == "string")
        return [{
            cond: "like",
            icon: "equal",
            text: "includes",
          },
          {
            cond: "not like",
            icon: "not-equal-variant",
            text: "excludes",
          },
          {
            cond: "is null",
            icon: "code-brackets",
            text: "empty",
          },
          {
            cond: "not null",
            icon: "dots-horizontal",
            text: "not empty",
          },
        ];
      else if (type == "array")
        return [{
            cond: "in",
            icon: "math-norm",
            text: "includes one of",
          },
          // {
          //   cond: "in all",
          //   icon: "equal",
          //   text: "includes all",
          // },
          {
            cond: "not in",
            icon: "not-equal-variant",
            text: "excludes",
          },
          {
            cond: "is null",
            icon: "code-brackets",
            text: "empty",
          },
          {
            cond: "not null",
            icon: "dots-horizontal",
            text: "not empty",
          },
        ];
      else if (type == "boolean")
        return [{
            cond: "=",
            icon: "check",
            text: "yes",
          },
          {
            cond: "!=",
            icon: "close",
            text: "no",
          },
        ];
      else return [];
    };
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
      return [...new Set(arr)] // removing duplicates
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
      return hsp < 150
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

      options.store.state.hover.delay = new Date().getTime()
      setTimeout(() => {
        let currentTime = new Date().getTime()
        if (currentTime - options.store.state.hover.delay > 4500)
          options.store.state.hover.show = false
      }, 5000)
    }
    Vue.prototype.$filterItems = function (sets, type) {
      /** 
       * Creating query for getting items from database.
       * @param {string} type - type of items: media or items.
       */
      let filters = sets.filters
      let videoCols = Cols.video.map(i => i.by)
      const isFilterByVideo = filters.some(i => videoCols.includes(i.by))
      const isFilterTypeArray = filters.some(i => i.type === 'array')

      const getQueryFromFilter = (i) => {
        let union = i.union
        let by = i.by
        let cond = i.cond
        let val = i.val
        let q = ""
        if (videoCols.includes(by)) by = 'videoMetadata.' + by
        if (i.type === 'string') {
          q += `${union} ${by} ${cond} `;
          if (!cond.includes('null')) {
            q += `'%${val}%' `;
          }
        } else if (i.type === 'number') { // TODO add rating type
          q += `${union} ${by} ${cond} ${val} `;
        } else if (i.type === 'date') {
          q += `${union} ${by} ${cond} '${val} 00:00:00.000' `;
        } else if (i.type === 'boolean') {
          q += `${union} ${by} ${cond} 1 `;
        } else if (by === 'country') {
          q += `${union} `;
          if (!cond.includes('null'))
            for (let x = 0; x < val.length; x++) {
              const country = val[x];
              if (x != 0) q += `OR `;
              cond = cond.replace('in', 'LIKE')
              q += `items.country ${cond} '%${country}%' `;
            }
          else q += `items.country ${cond} `;
        } else if (i.type === 'array') {
          let parent = 'media'
          if (type == 'items') parent = 'parentItem'
          q += `${union} `
          if (cond == 'not in') {
            q += `NOT EXISTS ( SELECT * FROM itemsIn${type} WHERE
              ${type}.id = itemsIn${type}.${parent}Id
                AND itemsIn${type}.itemId IN (${val.join()}) ) `
          } else if (cond == 'in all') {
            q += `( `
            for (let j = 0; j < val.length; j++) {
              if (j != 0) q += `AND `
              q += `itemsIn${type}.itemId = ${val[j]} `
            }
            q += `) `
          } else if (cond == 'is null') {
            q += `NOT EXISTS ( SELECT * FROM itemsIn${type} WHERE
              ${type}.id = itemsIn${type}.${parent}Id
                AND itemsIn${type}.metaId = ${by} ) `
          } else if (cond == 'not null') {
            q += `itemsIn${type}.metaId = ${by} `
          } else q += `itemsIn${type}.itemId ${cond} (${val.join()}) `;
        }
        return q
      }

      let q = `SELECT * FROM ${type} `;
      if (isFilterByVideo) {
        q += "INNER JOIN videoMetadata ON media.id = videoMetadata.mediaId ";
      }
      if (isFilterTypeArray) {
        if (type == 'media') {
          q += "LEFT OUTER JOIN itemsInMedia ON media.id = itemsInMedia.mediaId ";
        } else if (type == 'items') {
          q += "LEFT OUTER JOIN itemsInItems ON items.id = itemsInItems.parentItemId ";
        }
      }
      if (type == 'media') {
        q += `WHERE typeId = ${sets.typeId} `;
      } else if (type == 'items') {
        q += `WHERE items.metaId = ${sets.metaId} `;
      }
      for (let i of filters) q += getQueryFromFilter(i);
      q += "GROUP BY id ";
      q += `ORDER BY ${sets.sortBy} ${sets.sortDir} `;
      return q
    }
    Vue.prototype.$parseFilePath = function (filePath, mediaId) {
      // Parsing file path for matching with item's name or synonyms
      const fltr = (string) => {
        return string.replace(/[&\/\\#,+()$~%.'":*?<>{} ]/g, "").toLowerCase();
      };
      const string = fltr(filePath);
      const items = options.store.state.items;
      let parsed = options.store.state.Page.assigned;
      parsed = parsed.filter((i) => i.meta.metaSetting.parser);

      let vals = [];
      for (let meta of parsed) {
        const metaId = meta.metaId;
        let found = items
          .filter((i) => {
            if (i.metaId !== metaId) return false;
            let foundName = string.includes(fltr(i.name));
            let foundSynonyms = false;
            if (i.synonyms && i.synonyms.length) {
              let synonyms = i.synonyms.split(",");
              for (let s of synonyms) {
                if (string.includes(fltr(s))) foundSynonyms = true;
              }
            }
            return foundName || foundSynonyms;
          })
          .map((i) => i.id);
        found = [...new Set(found)]; // remove duplicates

        for (let i of found) {
          vals.push({
            itemId: i,
            metaId: metaId,
            mediaId: mediaId,
          });
        }
      }
      return vals;
    }
    Vue.prototype.$getAverageColor = function (src) {
      return new Promise((resolve) => {
        let context = document.createElement("canvas").getContext("2d");
        context.imageSmoothingEnabled = true;
        let img = new Image();
        img.src = src;
        img.onload = () => {
          context.drawImage(img, 0, 0, 1, 1);
          let res = context.getImageData(0, 0, 1, 1).data.slice(0, 3)
          let color = "rgb(" + res[0] + "," + res[1] + "," + res[2] + ")"
          resolve(color);
        };
      });
    }
    Vue.prototype.$getWatchedFoldersExtensions = (watchedFolders) => {
      let extensions = {};
      for (let folder of watchedFolders) {
        let arr = []
        const types = folder.types
        for (let j of types) {
          arr = arr.concat(j.extensions.split(','))
        }
        extensions[folder.path] = arr
      }
      return extensions;
    }
  }
}

export default Readable