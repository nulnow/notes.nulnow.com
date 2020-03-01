

async function main() {
    const app = new Vue({
        el: '#app',
        data: {
            isLoading: false,
            noteText: '',
            notes: {
                data: null,
                isLoading: true,
                isLoadingError: false,
            }
        },
        methods: {
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
                await deleteNote(note._id)
                this.notes.data = (this.notes.data || []).filter(n => n._id !== note._id)
                document.activeElement.blur()
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
