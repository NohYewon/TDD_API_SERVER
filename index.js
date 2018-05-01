//API 만들기
var express = require('express')
var logger = require('morgan');
//body-parser 가져옴
var bodyParser = require('body-parser')
//express의 어플리케이션
var app = express();

let users = [
    {id:1, name:'ittnoh'},
    {id:2, name:'Alice'},
    {id:3, name:'hell'}
]

//미들웨어
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(logger('dev'));

//라우팅 : app.get()
app.get('/', (req, res) => res.send('Hello Word!')); //localhost:3000/ 로 접속시 라우팅

app.get('/users', (req, res) => { //localhost:3000/users 로 접속시 라우팅
    req.query.limit = req.query.limit || 10
    const limit = parseInt(req.query.limit, 10)
     
    //정수인지 아닌지 확인
    if(Number.isNaN(limit)) {
        res.status(400).end()
    } else {
        res.json(users.slice(0, limit))
    }
})

app.get('/users/:id', (req, res) => {
    //id 값을 얻어낸다.
    const id = parseInt(req.params.id, 10)
    //id가 숫자가 아닐 경우 400 응답
    if(Number.isNaN(id)){
        return res.status(400).end()
    }
    //users 배열 조회
    const user = users.filter(user => user.id === id)[0]
    //id로 유저를 찾을 수 없을 경우 404 응답
    if(!user){
        return res.status(404).end()
    }
    //응답 : res
    res.json(user)
})

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)
    if(Number.isNaN(id)){
        return res.status(400).end()
    }
   users =  users.filter(user => user.id !== id)
    res.status(204).end()
})

app.post('/users', (req, res) => {
    const name = req.body.name  //npm install body-parser --save 해줘야 함
    if(!name){
        return res.status(400).end()
    }
    const found = users.filter(user => user.name === name).length
    if(found){
        return res.status(409).end()
    }
    const id = Date.now()
    const user = { id, name }
    users.push(user)
    res.status(201).json(user)
})

module.exports = app