const main = () => {
  exportAttendance(2020, 9)
}

type AttendanceType = "出勤" | "退勤"

type AttendanceReport = {
  date: string
  time: string
  type: AttendanceType
}

type AttendanceMap = {
  [date: string]: AttendanceReport[]
}

const exportAttendance = (year: number, month: number) => {
  const sheet = getSpreadsheetByName(
    year.toString(),
    ROOT_FOLDER
  ).getActiveSheet()
  const mm = padding(month)

  const lastRow = sheet.getLastRow()
  const values = sheet.getRange(2, 1, lastRow - 1, 3).getDisplayValues()

  // convert to object
  const reports: AttendanceReport[] = values.map((row) => {
    if (row.length === 3) {
      return {
        date: row[0],
        time: row[1],
        type: row[2] as AttendanceType,
      }
    }
  })

  const resultSheet = createSpreadsheetInFolder(
    `${year}-${month}-${prng()}`,
    ROOT_FOLDER
  ).getActiveSheet()
  const targets = generateReportRows(year, month)

  // make pair
  reports
    .filter((report) => report.date && report.date.slice(5, -3) === mm)
    .forEach((report) => {
      if (Object.prototype.hasOwnProperty.call(targets, report.date)) {
        targets[report.date].push(report)
      } else {
        targets[report.date] = [report]
      }
    })

  // convert to rows
  const writeValues = Object.entries(targets).map(([date, pair], index) => {
    const [first, second] = pair
    const rowIndex = index + 1 + 1 // add header row and 0-based -> 1-based

    switch (pair.length) {
      case 0:
        return makeReportRow(rowIndex, date, "", "")
      case 1:
        return first.type === "出勤"
          ? makeReportRow(rowIndex, date, first.time, "")
          : makeReportRow(rowIndex, date, "", first.time)
      default:
        return makeReportRow(rowIndex, date, first.time, second.time)
    }
  })

  // text format settings
  // resultSheet.getRange(2, 1, writeValues.length).setNumberFormat(`mm"/"dd"("ddd")"`)
  resultSheet
    .getRange(2, 1, 31, 5)
    .setNumberFormats(
      Array.from({ length: 31 }).map(() => [
        `mm"/"dd"("ddd")"`,
        "h:mm",
        "h:mm",
        "h:mm",
        "#,##0.0",
      ])
    )
  // set values
  const HEADER = ["日付", "出勤時間", "退勤時間", "休憩時間", "勤務時間数"]
  const FOOTERS = [
    ["", "", "", "", ""],
    ["", "", "", "計", "=sum(E2:E32)"],
  ]
  const COLUMNS = writeValues.length + 1 + 2 // some value rows + a header row + two footer rows
  resultSheet
    .getRange(1, 1, COLUMNS, 5)
    .setValues([HEADER, ...writeValues, ...FOOTERS])
}

const generateReportRows = (
  year: number,
  month1to12: number
): AttendanceMap => {
  const days = new Date(year, month1to12, 0).getDate()
  return Array.from({ length: days }).reduce<AttendanceMap>((acc, _, i) => {
    const date = `${year}-${padding(month1to12)}-${padding(i + 1)}`
    acc[date] = []
    return acc
  }, {})
}

const makeReportRow = (
  rowIndex: number,
  date: string,
  enterTime: string,
  leaveTime: string
) => {
  const enterCell = `B${rowIndex}`
  const leaveCell = `C${rowIndex}`
  const breakTimeCell = `D${rowIndex}`

  return [
    date,
    enterTime,
    leaveTime,
    enterTime && leaveTime && "1:00:00",
    `=if(or(${enterCell}="", ${leaveCell}=""), "", (${leaveCell}-${enterCell}-${breakTimeCell})*24)`,
  ]
}

const padding = (x: string | number) => x.toString().padStart(2, "0")

const prng = () => Math.random().toString(32).substr(2)

const getSpreadsheetByName = (
  name: string,
  folder: GoogleAppsScript.Drive.Folder
) => {
  const files = folder.getFilesByName(name)

  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next())
  } else {
    return createSpreadsheetInFolder(name, folder)
  }
}

const createSpreadsheetInFolder = (
  name: string,
  folder: GoogleAppsScript.Drive.Folder
) => {
  const newSheet = SpreadsheetApp.create(name)
  const origin = DriveApp.getFileById(newSheet.getId())
  const copied = origin.makeCopy(name, folder)
  DriveApp.getRootFolder().removeFile(origin)

  return SpreadsheetApp.open(copied)
}
