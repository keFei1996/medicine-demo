import CryptoJS from "crypto-js"
const Base64 = require('js-base64')

// 说明 新版                     之前可用的key
// key ZmR3ZXJ6NDFzNDVyNXl0Nw== OTF6bWF4MWYxenA4ZmJjbQ===
// iv NncxMmZjYWtwdnllNXhxeA== MWhmY245MXptYXh6c2V0cg==

let options = {
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
}
options[Base64.Base64.decode('aXY=')] = CryptoJS.enc.Utf8.parse(Base64.Base64.decode('ZHd6NDE0cnl0NzQxc3Bxcw==')) //iv

export default {
  encrypt(plaintText) {
    plaintText = JSON.stringify(plaintText)
    let message = CryptoJS.enc.Utf8.parse(plaintText)
    let encryptedData = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(Base64.Base64.decode('ZHd6NDE0cnl0NzQxc3Bxcw==')), options) //key
    let encryptedBase64Str = encryptedData.toString()
    return encryptedBase64Str
  },
  decrypt(encryptedBase64Str) {
    let decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str.toString(), CryptoJS.enc.Utf8.parse(Base64.Base64.decode('ZHd6NDE0cnl0NzQxc3Bxcw==')), options)
    let decryptedBase64Str = decryptedData.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedBase64Str)
  }
}
