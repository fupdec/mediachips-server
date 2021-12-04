const Readable = {
  install(Vue, options) {
    Vue.getReadableFileSize = function (bytes) {
      if (bytes > 1000000000000) bytes = (bytes/1024/1024/1024/1024-0.01).toFixed(2) + ' TB'
      else if (bytes > 1000000000) bytes = (bytes/1024/1024/1024-0.01).toFixed(2) + ' GB'
      else if (bytes > 1000000) bytes = (bytes/1024/1024-0.01).toFixed(0) + ' MB'
      else if (bytes > 1000) bytes = (bytes/1024-0.01).toFixed(0) + ' KB'
      else bytes += ' B'
      return bytes
    }
    Vue.getReadableDuration = function (duration) {
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
    Vue.getReadableBitrate = function (value) {
      if (value > 1000000) value = (value/1024/1024-0.01).toFixed(0) + ' Mbps'
      else if (value > 1000) value = (value/1024-0.01).toFixed(0) + ' Kbps'
      else value += ' bps'
      return value
    }
    Vue.getReadableVideoQuality = function (width, height) {
      if (width > height) {
        if (height < 720) return 'SD'
        else if (height >= 720 && height < 1080) return 'HD'
        else if (height >= 1080 && height < 1800) return 'FHD'
        else if (height >= 1800) return 'UHD'
      } else return 'Phone'
    }
    Vue.getReadableVideoHeight = function (width, height) {
      if (height > 1800 && width > height) return '4K'
      else return height + 'p'
    }
  }
}

export default Readable