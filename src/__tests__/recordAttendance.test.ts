import { recordAttendance } from "../recordAttedance"

describe("recordAttendance() は勤怠をSpreadSheetに入力する", () => {
  it("勤怠を記録する", (done) => {
    const expected = [["20210202", "ENTER"]]
    const sheetMock = ({
      getRange: () => ({
        setValues: jest.fn((data: any[][]) => {
          expect(data).toEqual(expected)
          done()
        }),
        getRow: () => 0,
        getValue: () => true,
        getNextDataCell: () => ({
          getRow: () => 0,
        }),
      }),
    } as unknown) as GoogleAppsScript.Spreadsheet.Spreadsheet

    recordAttendance(sheetMock, "ENTER", "20210202")
  })
})
