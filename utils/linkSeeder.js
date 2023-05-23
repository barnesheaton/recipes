const fs = require('fs')

const recipesJSON = fs.readFileSync('content/recipes.json', 'utf-8')
const recipes = JSON.parse(recipesJSON)

const linksJSON = fs.readFileSync('content/links.json', 'utf-8')
const links = JSON.parse(linksJSON)

let newRecipes = recipes
let seeder = recipes.reduce((promiseChain, recipe, index) => {
    return promiseChain.then(
      () =>
      new Promise((resolve) => {
            links.forEach(link => {
                const needsLink = recipe.recipe.toLowerCase().includes(link.phrase)
                if (needsLink) {
                    if (!recipe.links) {
                        newRecipes[index].links = [link]
                        // Add a the IF it doesn't already exist
                     } else if (!recipe.links.find(rl => rl.phrase == link.phrase)) {
                         newRecipes[index].links = [...newRecipes[index].links, link]
                     }
                }
            })
            resolve()
        })
    )
  }, Promise.resolve())

console.log('--- Seeding Links---')
seeder
  .then(() => {})
  .finally(() => {
    fs.writeFile('content/recipes.json', JSON.stringify(newRecipes), (err) => {
      if (err) throw err
    })
  })
        
