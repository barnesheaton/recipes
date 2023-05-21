const imageApiKey = '35954508-e5fd385d8a58155ec35b1839c'
const UnsplashKey = 'LB1lDsFtbYEgYIDO5RojBNgOjLDRW23neD6pITUoP1Q'

const axios = require('axios')
const fs = require('fs')
// const cloudinary = require('cloudinary').v2

// Configuration
// cloudinary.config({
//   cloud_name: 'dpwcgzqph',
//   api_key: '696846171758843',
//   api_secret: '5KyKegI44QLIAHNuhOZMfPAX01M'
// })

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
                console.log('Unsplash Result', res.data.results[0])
                newRecipes[index].imageURL = image.urls.regular
              }
            })
            .finally(() => {
              resolve()
            })
          //   axios
          //     .get(imageApiUrl)
          //     .then((result) => {
          //       if (result.data && result.data.hits && result.data.hits.length) {
          //         const imageToUploadURL = result.data.hits[0].webformatURL
          //         console.log(`--- Getting Image for ${recipe.name}`)
          //         console.log('PIXABAY img URL: ', imageToUploadURL)
          //         cloudinary.uploader
          //           .upload(imageToUploadURL, {
          //             public_id: recipe.slug || recipe.name.replace(' ', '-')
          //           })
          //           .then((data) => {
          //             console.log('Cloudinary Img URL', data.secure_url)
          //             resolve()
          //             newRecipes[index].imageURL = data.secure_url
          //           })
          //           .catch((err) => {
          //             console.log(err)
          //           })
          //           .finally(() => {
          //             resolve()
          //           })
          //       } else {
          //         resolve()
          //       }
          //     })
          //     .catch((err) => {
          //       console.error(err)
          //     })
        } else {
          resolve()
        }
      })
  )
}, Promise.resolve())

console.log('--- Seeding ---')
seeder
  .then(() => {})
  .finally(() => {
    console.log('--- finally ---')
    fs.writeFile('content/recipes.json', JSON.stringify(newRecipes), (err) => {
      if (err) throw err
    })
  })
