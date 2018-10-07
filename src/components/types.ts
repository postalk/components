export interface CardForm {
  x: number
  y: number
  color: string
  author: string
  value?: string
  file?: File
}

export interface CardInfo {
  id: string
  x: number
  y: number
  value: string
  color: string
  author: string
}
