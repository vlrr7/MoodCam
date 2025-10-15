export function saveBlobAs(b: Blob, filename: string) {
const a = document.createElement('a')
const url = URL.createObjectURL(b)
a.href = url
a.download = filename
a.click()
URL.revokeObjectURL(url)
}