// export interface HelpTextValue {
//   de: string
//   en: string
// }

// export interface HelpTextItem {
//   name: string
//   values: HelpTextValue
// }

// export interface HelpTextApiResponse {
//   status: boolean
//   message: string
//   data: HelpTextItem[]
// }


export type Language = "en" | "de"

export interface FilteredHelpTextItem {
  name: string
  values: Record<Language, string>
}

export interface FilteredHelpTextsResponse {
  status: boolean
  message: string
  data: FilteredHelpTextItem[]
}