// const imageApiKey = '35954508-e5fd385d8a58155ec35b1839c'
const UnsplashKey = 'LB1lDsFtbYEgYIDO5RojBNgOjLDRW23neD6pITUoP1Q'

const axios = require('axios')
const fs = require('fs')

const recipesJSON = fs.readFileSync('content/recipes.json', 'utf-8')
const recipes = JSON.parse(recipesJSON)
let newRecipes = recipes

let seeder = recipes.reduce((promiseChain, recipe, index) => {
  return promiseChain.then(
    () =>
      new Promise((resolve) => {
        if (!recipe.imageURL) {
          let imageQuery = recipe.title.replace(' ', '+')
          //   let imageApiUrl = `https://pixabay.com/api/?key=${imageApiKey}&q=${imageQuery}&image_type=photo&pretty=false`
          //   let imageApiUrl = `https://api.unsplash.com/photos/?client_id=${UnsplashKey}`
          let imageApiUrl = 'https://api.unsplash.com/search/photos'

          // Trying Unsplash here
          axios
            .get(imageApiUrl, {
              headers: { Authorization: `Client-ID ${UnsplashKey}` },
              params: { query: recipe.title }
            })
            .then((res) => {
              const image =
                res.data && res.data.results && res.data.results.length && res.data.results[0]
              if (image) {
                newRecipes[index].imageURL = image.urls.regular
              }
            })
            .finally(() => {
              resolve()
            })
        } else {
          resolve()
        }
      })
  )
}, Promise.resolve())

console.log('--- Seeding Images ---')
seeder
  .then(() => {})
  .finally(() => {
    fs.writeFile('content/recipes.json', JSON.stringify(newRecipes), (err) => {
      if (err) throw err
    })
  })
