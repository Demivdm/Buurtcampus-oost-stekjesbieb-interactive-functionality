import * as dotenv from 'dotenv'

import { fetchJson, postJson } from '../helpers/fetchWrapper.js'

import express from 'express'

dotenv.config()

const member = express.Router()

// Haal de gegevens van één member op
member.get('/', (request, response) => {
  const id = request.query.id || null
  const url = `${process.env.API_URL}/member/?id=${id}`

  fetchJson(url).then((data) => {
    response.render('member', data)
  })
})

// Toon het formulier om een nieuwe member aan te maken
member.get('/new', (request, response) => {
  const data = {
    squad: request.query.squad || null,
  }
  response.render('memberForm.ejs', data)
})

// Handel het versturen van het formulier af
member.post('/', (request, response) => {
  console.log(request.body)
  // Roep de API aan met de post methode
  const url = `${process.env.API_URL}/member`
  postJson(url, request.body).then((data) => {
    // De waarden uit het formulier (niet de API)
    let newMember = { ...request.body }
    // Het id uit de API (overschrijft het formulier)
    newMember.id = data.data.createMember.id || null

    // Stuur de gebruiker naar / als het gelukt is
    if (data.success) {
      response.redirect('/?memberPosted=true') // squad meegeven, message meegeven

      // Toon opnieuw het formulier (met waarden) als het niet gelukt is
    } else {
      response.render('memberForm.ejs', newMember) // Fail, message meegeven
    }
  })
})

export default member