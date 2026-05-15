import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get targets() {
    return ["content", "typeMenu", "addButton"]
  }

  toggleTypeMenu(event) {
    event.stopPropagation()
    this.typeMenuTarget.classList.toggle("hidden")
  }

  closeTypeMenu() {
    this.typeMenuTarget.classList.add("hidden")
  }

  addFields(event) {
    this.typeMenuTarget.classList.add("hidden")

    let button = event.currentTarget
    let childIndex = button.dataset.childIndex
    let time = new Date().getTime()
    let regex = new RegExp(childIndex, "g")
    let html = button.dataset.fields.replace(regex, time)

    const parser = new DOMParser()
    const docFields = parser.parseFromString(html, "text/html")
    this.contentTarget.appendChild(docFields.body.firstChild)
  }

  removeFields(event) {
    this._pendingDeleteId = event.currentTarget.dataset.id
    this._showConfirmDialog()
  }

  moveUp(event) {
    const pane = document.getElementById(event.currentTarget.dataset.id)
    const prev = pane?.previousElementSibling
    if (prev) this.contentTarget.insertBefore(pane, prev)
  }

  moveDown(event) {
    const pane = document.getElementById(event.currentTarget.dataset.id)
    const next = pane?.nextElementSibling
    if (next) this.contentTarget.insertBefore(next, pane)
  }

  _showConfirmDialog() {
    if (document.getElementById("stream-field-confirm-dialog")) return

    const dialog = document.createElement("div")
    dialog.id = "stream-field-confirm-dialog"
    dialog.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
          <p class="text-gray-700 text-sm mb-4">Are you sure you want to delete this section?</p>
          <div class="flex gap-3 justify-end">
            <button id="stream-field-confirm-cancel" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
            <button id="stream-field-confirm-yes" class="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md">Yes</button>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(dialog)

    document.getElementById("stream-field-confirm-yes").addEventListener("click", () => this._doDelete())
    document.getElementById("stream-field-confirm-cancel").addEventListener("click", () => this._hideConfirmDialog())
  }

  _doDelete() {
    document.getElementById(this._pendingDeleteId)?.remove()
    this._hideConfirmDialog()
  }

  _hideConfirmDialog() {
    document.getElementById("stream-field-confirm-dialog")?.remove()
    this._pendingDeleteId = null
  }
}
