const ENTER = "enter"
const LEAVE = "leave"
const TEXTMAP = {
  [ENTER]: "出勤",
  [LEAVE]: "退勤",
}
const HEADERS = ["日付", "時刻", "出勤／退勤"]

const doGet = (e: GoogleAppsScript.Events.DoGet) => {
  return ContentService.createTextOutput(JSON.stringify(e))
}

const doPost = (e: GoogleAppsScript.Events.DoPost) => {
  const contents = JSON.parse(e.postData.contents)
  const { type } = contents

  if (type === ENTER || type === LEAVE) {
    const date = new Date()
    writeAttendance(date, TEXTMAP[type])
    return ContentService.createTextOutput("Done")
  } else {
    return ContentService.createTextOutput("Error")
  }
}

const getSpreadsheet = (date) => {
  const name = date.getFullYear()
  const files = ROOT_FOLDER.getFilesByName(name)

  if (files.hasNext()) {
    const sheet = SpreadsheetApp.open(files.next())
    return sheet
  } else {
    const sheet = createSpreadsheet(name, ROOT_FOLDER)
    sheet.getActiveSheet().getRange(1, 1, 1, 3).setValues([HEADERS])
    return sheet
  }
}

const writeAttendance = (date, enterOrLeave) => {
  const sheet = getSpreadsheet(date).getActiveSheet()
  const row = sheet.getLastRow() + 1

  const values = [[yyyymmdd(date), hhmmss(date), enterOrLeave]]
  sheet.getRange(row, 1, 1, 3).setValues(values)
}

global.doGet = doGet
global.doPost = doPost
