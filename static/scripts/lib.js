const RESPONSE_TIMEOUT = 30000

const socket = io()

function createdAtToDisplay(str) {
    try {
        return moment(str).format('MMMM Do YYYY, HH:mm:ss')
    } catch(e) {
        console.error(e)
        return str
    }
}

async function getProfile() {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject()
        }, RESPONSE_TIMEOUT)
        socket.emit('call', {
            method: 'profile',
            opts: { userId: localStorage.token }
        }, (result) => {
            clearTimeout(timeoutId)
            resolve(result)
        })
    })
}

async function getUsers() {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject()
        }, RESPONSE_TIMEOUT)
        socket.emit('call', {
            method: 'users',
            opts: { userId: localStorage.token }
        }, (result) => {
            clearTimeout(timeoutId)
            resolve(result)
        })
    })
}

async function addNote(text) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject()
        }, RESPONSE_TIMEOUT)
        socket.emit('call', {
            method: 'addNote',
            params: { text },
            opts: { userId: localStorage.token }
        }, (result) => {
            clearTimeout(timeoutId)
            resolve(result)
        })
    })
}

async function getMyNotes() {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject()
        }, RESPONSE_TIMEOUT)
        socket.emit('call', {
            method: 'getMyNotes',
            opts: { userId: localStorage.token }
        }, (result) => {
            clearTimeout(timeoutId)
            resolve(result)
        })
    })
}

async function deleteNote(noteId) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject()
        }, RESPONSE_TIMEOUT)
        socket.emit('call', {
            method: 'deleteNote',
            params: { noteId },
            opts: { userId: localStorage.token }
        }, (result) => {
            clearTimeout(timeoutId)
            resolve(result)
        })
    })
}

async function changeNoteColor(noteId, color) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject()
        }, RESPONSE_TIMEOUT)
        socket.emit('call', {
            method: 'changeNoteColor',
            params: { noteId, color },
            opts: { userId: localStorage.token }
        }, (result) => {
            clearTimeout(timeoutId)
            resolve(result)
        })
    })
}

async function login(username, password) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject()
        }, RESPONSE_TIMEOUT)
        socket.emit('call', {
            method: 'login',
            params: { username, password },
        }, (result) => {
            clearTimeout(timeoutId)
            resolve(result)
        })
    })
}

async function myRegister(username, password) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject()
        }, RESPONSE_TIMEOUT)
        socket.emit('call', {
            method: 'register',
            params: { username, password },
        }, (result) => {
            clearTimeout(timeoutId)
            resolve(result)
        })
    })
}

async function isLoggedIn() {
    if (!localStorage.token) return false
    const token = localStorage.token
    try {
        const profile = await getProfile()
        if (profile.data.username) {
            return true
        }
    } catch(e) {
        return false
    }
}

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms))
}
