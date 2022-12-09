const express = require('express')
const uuid = require('uuid')

const port = 3002
const app = express()
app.use(express.json())

/*
    - Query params => meusite.com/users?name=rodolfo&age=28 - FILTROS
    - Route params => /users/2 - BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
    - Request Body => { "name":"Rodolfo", "age":33}
    - GET          => Buscar informação no back-end
    - POST         => Criar informação no back-end
    - PUT / PATCH  => Alterar/ atualizar informação no back-end
    - DELETE       => Deletar informação no back-end
    - MIDDLEWARE   => INTERCEPTADOR - Tem o poder de parar ou alterar dados de requisição
*/

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params
    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({message: "User not founded"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get('/users', (request, response) => {
    
    return response.json(users)
})

app.post('/users', (request, response) => {
    
    const {name, age} = request.body
    
    const user = {id:uuid.v4(), name, age}

    users.push(user)
    return response.status(201).json(user)
})

app.put('/users/:id', checkUserId, (request, response) => {
    
    const {name, age} = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, name, age}

    users[index] = updateUser

    return response.json(updateUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    
    const index = request.userIndex    

    users.splice(index, 1)

    return response.status(204).json(users)
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port})`)
})