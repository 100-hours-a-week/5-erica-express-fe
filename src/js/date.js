export function changeDate(timestamp) {
	const date = new Date(timestamp)

	// 원하는 형식으로 변환
	const year = date.getUTCFullYear()
	const month = String(date.getUTCMonth() + 1).padStart(2, '0')
	const day = String(date.getUTCDate()).padStart(2, '0')
	const hours = String(date.getUTCHours()).padStart(2, '0')
	const minutes = String(date.getUTCMinutes()).padStart(2, '0')

	const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}`

	return formattedTimestamp
}
