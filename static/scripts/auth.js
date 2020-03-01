async function main() {
    const app = new Vue({
        el: '#auth',
        data: {
            isLoading: false,
            username: '',
            password: '',
            isLogin: true,
            errorModal: {
                open: false,
                title: 'Error',
                body: 'User does not found!',
            }
        },
        methods: {
            onLoginClick: async function() {
                if (!this.username && !this.password) return
                this.isLoading = true
                try {
                    await sleep(2000)
                    const response = await login(this.username, this.password)
                    if (response.code !== 200) {
                        this.errorModal.title = 'Error'
                        this.errorModal.body = 'User does not found'
                        this.errorModal.open = true
                        console.error(response)
                    } else {
                        response.data._id
                        localStorage.token = response.data._id
                        window.location.href = '/dash'
                    }
                } catch(e) {
                    console.error(e)
                }
                this.isLoading = false
            },
            onRegisterClick: async function() {
                if (!this.username && !this.password) return
                this.isLoading = true
                try {
                    await sleep(2000)
                    const response = await myRegister(this.username, this.password)
                    if (response.code !== 201) {
                        if (response.code === 400) {
                            this.errorModal = {
                                open: true,
                                title: 'Error',
                                body: 'User already exist'
                            }
                        } else {
                            this.errorModal = {
                                open: true,
                                title: 'Error',
                                body: 'Unknown error'
                            }
                        }
                    } else {
                        response.data._id
                        localStorage.token = response.data._id
                        window.location.href = '/dash'
                    }
                } catch(e) {
                    console.error(e)
                    this.errorModal = {
                        open: true,
                        title: 'Error',
                        body: 'Unknown error'
                    }
                }
                this.isLoading = false
            },
        }
    })
}

main()
