declare namespace NodeJS {
  // extends global
  export interface Global {
    doGet: (
      e: GoogleAppsScript.Events.DoGet
    ) => GoogleAppsScript.Content.TextOutput
    doPost: (
      e: GoogleAppsScript.Events.DoPost
    ) => GoogleAppsScript.Content.TextOutput
  }
}
