// 'use strict'

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { response } = require('express')
const app = express()
app.use(cors())

// ----- mongoose configs -----//

mongoose.connect('mongodb://MurshedQatoseh:22091979Mmm@ac-j8xoxdw-shard-00-00.mmktkvk.mongodb.net:27017,ac-j8xoxdw-shard-00-01.mmktkvk.mongodb.net:27017,ac-j8xoxdw-shard-00-02.mmktkvk.mongodb.net:27017/?ssl=true&replicaSet=atlas-t15e7y-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

const booksSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String
})

const book = mongoose.model('books', booksSchema)

async function seedData () {
  const firstBook = new book({
    title: 'The Prince',
    description: 'The Prince is a 16th-century political treatise written by Italian diplomat and political theorist Niccolò Machiavelli as an instruction guide for new princes and royals.',
    status: 'Available'
  })

  const secondBook = new book({
    title: 'The Art of War',
    description: 'The Art of War is an ancient Chinese military treatise dating from the Late Spring and Autumn Period. The work, which is attributed to the ancient Chinese military strategist Sun Tzu, is composed of 13 chapters.',
    status: 'Available'
  })

  const thirdBook = new book({
    title: 'the kite runner',
    description: 'it tells the story of Amir, a young boy from the Wazir Akbar Khan district of Kabul..',
    status: 'Available'
  })
  const fourthBook = new book({
    title: 'java script',
    description: 'it`s talk about learn java',
    status: 'available'
  })

  await firstBook.save()
  await secondBook.save()
  await thirdBook.save()
  await fourthBook.save()
}
// seedData();

const PORT = process.env.PORT || 3007
app.get('/', homeRouteHandler)

function homeRouteHandler (req, res) {
  res.send('Welcome to the home route')
}

app.get('/books', booksRouteHandler)
app.delete('/deleteBook/:id', deleteBookHandler)
app.put('/update/:id', updatebookHandler)
function deleteBookHandler (req, res) {
  const bookId = req.params.id
  const email = req.params.email
  book.deleteOne({ _id: bookId }, (err, result) => {
    book.find({ l }, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
    })
  })
}

function updatebookHandler (req, res) {
  const id = req.params.id
  const { title, description, status } = req.body
  console.log(req.body)
  book.findByIdAndUpdate(id, { title, description, status }, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      book.find({}, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(result);
          res.send(result)
        }
      })
    }
  })
}

function booksRouteHandler (req, res) {
  book.find({}, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
}

app.get('/test', (req, res) => {
  res.send('test request received')
})

app.get('*', errorRouteHandler)

function errorRouteHandler (req, res) {
  res.send('404 PAGE NOT FOUND!')
}
// eslint-disable-next-line no-undef
app.post('/addbook', addBookHandler)
async function addBookHandler (req, res) {
  console.log(req.body)

  const { title, description, status } = req.body
  await book.create({
    title,
    description,
    status
  })

  book.find({}, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.status(200).send(result)
    }
  })
}

app.listen(PORT, () => console.log(`listening on ${PORT}`))
