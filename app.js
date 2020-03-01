require('dotenv').config()
const PORT = process.env.PORT
const HOST = process.env.HOST
const MONGO = process.env.MONGO
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/User')
const Note = require('./models/Note')

mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.get('/', (req, res) => res.sendFile(path.resolve('./pages/auth.html')))
app.get('/dash', (req, res) => res.sendFile(path.resolve('./pages/dash.html')))
// app.get('/auth', (req, res) => res.sendFile(path.resolve('./pages/auth.html')))

app.use(express.static('static'))


class UserRepo {}
UserRepo.getById = async (userId) => {
    return await User.findById(userId)
        .exec()
}

class NotesService {}
NotesService.addNote = async ({ text, userId }) => {
    const note = new Note({
        text,
        userId: new mongoose.Types.ObjectId(userId)
    })
    await note.save()
    return note
}
NotesService.getNotesByUser = async (userId) => {
    return await Note.find({ userId: userId })
        .exec()
}
NotesService.updateNoteById = async ({ noteId, newText }) => {
    return await Note.findByIdAndUpdate(noteId, { text: newText })
        .exec()
}
NotesService.deleteById = async (noteId) => {
    return await Note.findOneAndDelete(noteId)
        .exec()
}

UserRepo.list = async () => {
    return await User.find({})
        .exec()
}


class Auth {
}


Auth.authenticate = async (opts) => {
    if (opts && opts.userId) {
        return await UserRepo.getById(opts.userId)
    }
}
Auth.register = async ({ username, password }) => {
    const user = await User.findOne({
        username
    })
        .exec()
    if (user) {
        return {
            status: 'Error',
            code: 400,
            message: 'User already exist'
        }
    }
    const newUser = new User({
        username,
        password
    })
    await newUser.save()
    return {
        status: 'Ok',
        code: 201,
        data: newUser
    }
}
Auth.login = async ({ username, password }) => {
    const user = await User.findOne({
        username,
        password
    })
        .exec()
  console.log({user})
    if (user) {
        return {
            status: 'Ok',
            code: 200,
            data: user
        }
    }
    return {
        status: 'Error',
        code: 400,
        message: 'User not exist'
    }
}


class Response {
}


Response.Ok = class {
    constructor(data) {
        this.data = data
        this.status = 'ok'
        this.code = 200
    }
}

const apiGateway = async ({ method, params, opts }, done) => {
    const user = await Auth.authenticate(opts)
    if (method === 'login') {
        return done(await Auth.login(params))
    } else if (method === 'register') {
        return done(await Auth.register(params))
    }
    if (!user) {
        done({
            status: 'error',
            message: 'not authorized',
            code: 401
        })
        return
    }
    if (method === 'profile') {
        done(new Response.Ok(user))
        return
    } else if (method === 'users') {
        done({
            status: 'ok',
            code: 200,
            data: await UserRepo.list()
        })
        return
    } else if (method === 'addNote') {
        const note = await NotesService.addNote({
            text: params.text,
            userId: user._id
        })
        done({
            status: 'ok',
            code: 201,
            data: note
        })
        return
    } else if (method === 'getMyNotes') {
        const notes = await NotesService.getNotesByUser(user._id)
        return done({
            status: 'ok',
            code: 200,
            data: notes
        })
    } else if (method === 'updateNote') {
        return done({
            status: 'ok',
            code: 200,
            data: await NotesService.updateNoteById({
                noteId: params.noteId,
                newText: params.newText
            })
        })
    } else if (method === 'deleteNote') {
        return done({
            status: 'ok',
            code: 200,
            data: await NotesService.deleteById(params.noteId)
        })
    }
    done({
        status: 'error',
        message: 'not founc',
        code: 404
    })
    return
}

io.on('connection', socket => {
    socket.on('call', (request, done) => {
        console.log('calling')
        console.log({ request })
        const { method, params, opts } = request
        apiGateway({
            method,
            params,
            opts
        }, done || (() => {
        }))
    })
})

server.listen(PORT, HOST, () => {
    console.log(`App is listening on host: ${ HOST }, port: ${ PORT } `)
})
