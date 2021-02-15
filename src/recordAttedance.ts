type AttendanceType = "ENTER" | "LEAVE"

/**
 * spreadsheetに勤怠を記録する
 * 指定されたスプレッドシートの最後の行に、日付と "出勤" または "退勤" を入力する
 */
export const recordAttendance = (
  sheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
  type: AttendanceType,
  yyyymmdd: string
) => {
  // 最終行を取得
  const TARGET_COLUMN = "A:B"
  const lowermostCell = sheet.getRange(TARGET_COLUMN)
  const lastRow = lowermostCell.getValue()
    ? lowermostCell.getRow()
    : lowermostCell.getNextDataCell(SpreadsheetApp.Direction.UP).getRow()

  // 日付と勤怠を入力する
  const attendanceData = [yyyymmdd, type]
  // @ts-ignore @types/google-apps-script が間違っているっぽい?
  sheet.getRange(lastRow + 1, 1, 1, 2).setValues(attendanceData)
}
