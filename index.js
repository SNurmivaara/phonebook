const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require ('body-parser')
const morgan = require('morgan')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '050-1234567',
  },
  {
    id: 2,
    name: 'Arto Järvinen',
    number: '041-1254567',
  },
  {
    id: 3,
    name: 'Lea Kutvonen',
    number: '040-1236767',
  },
  {
    id: 4,
    name: 'Martti Tienari',
    number: '09-1564567',
  },
]

app.get('/info', (req, res) => {
  res.send(`Phone book contains information from ${persons.length} persons<br>${new Date()}`)
})

app.get('/api/persons', (req, res) =>{
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 100000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  
  if (body.name === undefined) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (body.number === undefined) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  res.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})