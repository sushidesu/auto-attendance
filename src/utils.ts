const yyyymmdd = (date) => {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString()
  const d = date.getDate().toString()

  return `${y}-${pad2(m)}-${pad2(d)}`
}

const yyyymm = (date) => {
  return yyyymmdd(date).slice(0, -3)
}

const hhmmss = (date) => {
  const h = date.getHours().toString()
  const mm = date.getMinutes().toString()
  const s = date.getSeconds().toString()

  return `${pad2(h)}:${pad2(mm)}:${pad2(s)}`
}

const pad2 = (str) => str.padStart(2, "0")

const createSpreadsheet = (name, parent) => {
  const sheet = SpreadsheetApp.create(name)
  const origin = DriveApp.getFileById(sheet.getId())
  const copied = origin.makeCopy(name, parent)
  DriveApp.getRootFolder().removeFile(origin)

  return SpreadsheetApp.open(copied)
}

const getLastRow = () => {}
