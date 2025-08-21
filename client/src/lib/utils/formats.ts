export const blobToBase64 = (blob: Blob): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(blob)
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result)
			} else {
				reject(new Error('Unexpected result type'))
			}
		}
		reader.onerror = error => reject(error)
	})
