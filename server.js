import express from 'express'

const url = 'https://api.buurtcampus-oost.fdnd.nl/api/v1'

// Maak een nieuwe express app
const app = express()

// Stel in hoe we express gebruiken
app.set('view engine', 'ejs')
app.set('views', './views')

// express afhandeling voor json
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
    response.render('index', data)
  })
})



// functie om te posten

app.post('/create-stekje', (request, response) => {
  const stekjesUrl = 'https://api.buurtcampus-oost.fdnd.nl/api/v1'
  const url = stekjesUrl + '/stekjes'

  postJson(url, request.body).then((data) => {
    let newStekje = { ... request.body}

    if (data.success) {
      response.redirect('/')

      console.log("Stekje redirected", newStekje);
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