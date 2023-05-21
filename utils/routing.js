const fs = require('fs')
const recipesJSON = fs.readFileSync('content/recipes.json', 'utf-8')
const recipesObj = JSON.parse(recipesJSON)

module.exports = {
  createRoutes: async () => {
    console.log(recipesObj)
    const routes = []

    recipesObj.map((recipe) => {
      routes.push(`/recipe/${recipe.slug}`)
    })

    // for (const recipe of recipesObj) {
    //   console.log('___RECIPE___', recipe)
    //   // const recipeSlug = recipe.slug.replace(' ', '-')
    //   routes.push(`/recipe/${recipe.slug}`)
    // }

    return routes
  }
}
