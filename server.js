import express from 'express'

const url = 'https://api.buurtcampus-oost.fdnd.nl/api/v1'

// Maak een nieuwe express app
const app = express()

// Stel in hoe we express gebruiken
app.set('view engine', 'ejs')
app.set('views', './views')

// Express afhandeling voor json Dit vertelt hoe express met json om moet gaan
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

// selecteert welke statische pagina er wordt getoont
app.use(express.static('public'))

// routes

app.get('/create-stekje', (request, response) => {
  response.render('plantForm')
})

app.get('/', (request, response) => {
  let stekjesUrl = url + '/stekjes'

  fetchJson(stekjesUrl).then((data) => {

    // stekjes en posted zijn objecten. Hier vertel ik wat(data.stekjes en .posted) de pagina moet ophalen als deze opnieuw geladen wordt.
    
    response.render('index', {stekjes: data.stekjes, posted: request.query.posted})
  })
})



// functie om te posten

app.post('/create-stekje', (request, response) => {
  const stekjesUrl = 'https://api.buurtcampus-oost.fdnd.nl/api/v1'
  const url = stekjesUrl + '/stekjes'

  postJson(url, request.body).then((data) => {
    let newStekje = { ... request.body}

    if (data.success) {
      // als het posten succesvol was dan wordt de gebruiker naar wordt er posted achter de link geplakt
      response.redirect('/?posted=true#post-succes')
    }

    else {
    //  hier maak je een variabel en vertel je welke data er in errors zit

      const newdata = { errors: data.errors, values: newStekje }
      
      response.render('plantForm', newdata)
    }
    
  })
})

// Stel het poortnummer in en start express
app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}


// * postJson() is a wrapper for the experimental node fetch api. It fetches the url
// * passed as a parameter using the POST method and the value from the body paramater
// * as a payload. It returns the response body parsed through json.
// * @param {*} url the api endpoint to address
// * @param {*} body the payload to send along
// * @returns the json response from the api endpoint

export async function postJson(url, body) {
 return await fetch(url, {
   method: 'post',
   body: JSON.stringify(body),
   headers: { 'Content-Type': 'application/json' },
 })
   .then((response) => response.json())
   .catch((error) => error)
}