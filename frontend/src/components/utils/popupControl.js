export function popupScroll () {
  let addEl = document.getElementsByClassName('popup-widget')
  let widgetEl = document.getElementsByClassName('popup-contents')
  if (widgetEl.length !== 0) {
    let widgetHeight = widgetEl[0].offsetHeight + 60
    let windowHeight = window.innerHeight
    let scrollClass = 'add_scroll'
    let display_table = 'display_table'
    if(widgetHeight > windowHeight) {
      addEl[0].classList.add(scrollClass)
      addEl[0].classList.remove(display_table)
    }else{
      addEl[0].classList.remove(scrollClass)
      addEl[0].classList.add(display_table)
    }
  }
}
