// tslint:disable:no-empty
export const ua = window ? navigator.userAgent.toLowerCase() : 'n/a'
export const addListener = window ? window.addEventListener : () => {}
export const removeListener = window ? window.removeEventListener : () => {}
export const width = window ? () => window.innerWidth : () => 0
export const height = window ? () => window.innerHeight : () => 0
