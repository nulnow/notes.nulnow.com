
function test() {
    return 'rew'
}

async function main() {
    const app = new Vue({
        el: '#app',
        data: {
            isLoading: false,
            noteText: '',
            openedNoteId: null,
            notes: {
                data: null,
                isLoading: true,
                isLoadingError: false,
            }
        },
        computed: {
            modalNote() {
                return (this.notes.data || []).find(n => n._id === this.openedNoteId)
            },
            sortedNotes() {
                return (this.notes.data || []).sort((a, b) => {
                    const aTime = new Date(a.updated_at)
                    const bTime = new Date(b.updated_at)
                    return aTime > bTime ? -1 : aTime < bTime ? 1 : 0
                })
            }
        },
        methods: {
            createdAtToDisplay: function(str) {
                try {
                    return moment(str).format('MMMM Do YYYY, HH:mm:ss')
                } catch(e) {
                    console.error(e)
                    return str
                }
            },
            reloadNotes: function() {
                this.notes.isLoading = true
                this.notes.isLoadingError = false
                getMyNotes()
                    .then(response => {
                        console.log({ response })
                        this.notes.isLoadingError = false
                        this.notes.isLoading = false
                        this.notes.data = response.data
                    })
                    .catch(() => {
                        this.notes.isLoadingError = true
                        this.notes.isLoading = false
                    })
            },
            deleteNote: async function(note) {
                this.notes.data = (this.notes.data || []).filter(n => n._id !== note._id)
                document.activeElement.blur()
                await deleteNote(note._id)
            },
            onAddNoteClick: async function() {
                const text = this.noteText
                if (!text) {
                    return
                }
                const note = await addNote(text)
                this.noteText = ''
                this.notes.data = [...(this.notes.data || []), note.data]
                document.activeElement.blur()
            },
            onLogoutClick: function() {
                delete window.localStorage.token
                window.location.reload()
            },
            async onNoteColorChange(event, note) {
                const color = event.target.value
                const result = await changeNoteColor(note._id, color)
                if (result.code === 200) {
                    this.notes.data = (this.notes.data || []).map(n => n._id === note._id ? result.data : n)
                }
            }
        }
    })

    if (!(await isLoggedIn())) {
        console.log('not logged in')
        window.location.href = '/'
    } else {
        console.log('logged in')
        app.isLoading = false
        app.reloadNotes()
    }

}

main()
