const apiKey = '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'
const axios = require('axios')
const fs = require('fs')

const recipesToSeedJSON = fs.readFileSync('recipeSeedData.json', 'utf-8')
const recipesToSeed = JSON.parse(recipesToSeedJSON)

const recipesJSON = fs.readFileSync('content/recipes.json', 'utf-8')
const recipes = JSON.parse(recipesJSON)
const currentRecipeSlugs = recipes.map(recipe => recipe.slug)

const slugify = str =>
str
  .toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '');

const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey
  }
})

recipesToSeed.forEach((recipeSeed) => {
  if (!currentRecipeSlugs.includes(slugify(recipeSeed.title))) {
    // console.log('DOESNT HAVE', recipe)
    const params = {
      prompt: `${recipeSeed.title} recipe with servings, prep, and cook time`,
      model: 'text-davinci-003',
      max_tokens: 600,
      temperature: 0
    }

    const recipe = { ...recipeSeed, links: [] }
    client
      .post('https://api.openai.com/v1/completions', params)
      .then((result) => {
        const recipesJSON = fs.readFileSync('content/recipes.json', 'utf-8')
        const storedRecipes = JSON.parse(recipesJSON)
        const recipeData = result.data.choices[0].text

        // Push new recipe to recipe list
        recipe.recipe = recipeData
        recipe.slug = slugify(recipeSeed.title)
        storedRecipes.push(recipe)

        // Write updated list to JSON file
        fs.writeFile('content/recipes.json', JSON.stringify(storedRecipes), (err) => {
          if (err) throw err
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }
})
