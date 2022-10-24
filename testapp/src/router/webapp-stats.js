const save = (v) => {
    localStorage.setItem('webapp-stat-buffer', JSON.stringify(v))
}

const load = () => {
    return JSON.parse(localStorage.getItem('webapp-stat-buffer'))
}

const ifUndefinedPopulateWithEmptyList = () => {
    if (!localStorage.getItem('webapp-stat-buffer')) {
        save([])
    }
}

const clearLocalStorage = () => {
    localStorage.setItem('webapp-stat-buffer', '[]')
}

const sendStats = (statList) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const body = JSON.stringify(statList)
    const method = 'POST'
    const requestOptions = { method, headers, body }
    const url = 'https://webapp-stats.herokuapp.com/webapp-stats'
    fetch(url, requestOptions)
}

const webappStatTrack = async (to, from, username = 'anonymous') => {
    try {
        ifUndefinedPopulateWithEmptyList()
        const baseUrl = window.location.origin
        const senderDebounceLimit = 10 // controls how often you send "save data api"
        const currentList = load()
        const timestamp = new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')
        currentList.push({
            app_id: '22c4c3f7-609d-4bd2-a239-8bebfc8b59e4', // appName: mlink-localhost-jk
            timestamp,
            user: username,
            from_path: baseUrl + from.path,
            to_path: baseUrl + to.path,
            screen_width: window.innerWidth || '',
            screen_height: window.innerHeight || '',
        })
        save(currentList)

        const listLength = currentList.length

        if (listLength >= senderDebounceLimit) {
            sendStats(currentList)
            clearLocalStorage()
        }
    } catch (e) {
        console.warn(e.message)
        // silently continue if it fails
    }
}

export default webappStatTrack
