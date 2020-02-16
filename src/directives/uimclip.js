export default {
  inserted: function (el, binding) {
    el.addEventListener('click', (e) => {
      let textarea = document.createElement('textarea')
      let value = el.dataset.uimclip
      textarea.value = value
      el.after(textarea)
      textarea.focus()
      textarea.setSelectionRange(0, value.length)
      document.execCommand('copy')
      textarea.remove();
      binding.value.onSuccess();
    })
  }
}
