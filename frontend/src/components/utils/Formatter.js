export function dateFormatter (str) {
  // YYYY-MM-DD HH:MM:SS
  const dt = new Date(str)
  const mm = dt.getMonth() + 1
  const dd = dt.getDate()
  const YYYYMMDD = [dt.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-')
  const HHMMSS = [dt.getHours(), dt.getMinutes(), dt.getSeconds()].join(':')

  return YYYYMMDD + ' ' + HHMMSS
}

export function numberFormatter (num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function numberToFixed (num, cut) {
  return num.toFixed(cut)
}

export function nFormatter (num, digits) {
  var si = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'K' },
    { value: 1E6, symbol: 'M' },
    { value: 1E9, symbol: 'B' },
    { value: 1E12, symbol: 'T' },
    { value: 1E15, symbol: 'P' },
    { value: 1E18, symbol: 'E' }
  ]
  let rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i = 0
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
}

