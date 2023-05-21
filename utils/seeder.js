const apiKey = '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'
const axios = require('axios')
const fs = require('fs')

const recipesToGenerate = [
  // 'Chocolate chip cookies',
  // 'Chicken Parmesan',
  'Pancakes',
  'Spaghetti Bolognese',
  'Chicken Alfredo',
  'Guacamole',
  'Chicken Curry',
  'Pizza Dough',
  'Banana Bread',
  'Caesar Salad',
]

const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey
  }
})

recipesToGenerate.forEach((recipeName) => {
  const params = {
    prompt: `${recipeName} recipe with servings, prep, and cook time`,
    model: 'text-davinci-003',
    max_tokens: 600,
    temperature: 0
  }

  const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const recipe = { title: recipeName }
  client
    .post('https://api.openai.com/v1/completions', params)
    .then((result) => {
      const recipesJSON = fs.readFileSync('content/recipes.json', 'utf-8')
      const storedRecipes = JSON.parse(recipesJSON)
      const recipeData = result.data.choices[0].text

      // Add recipe string to Obj
      // const recipeSlug = recipeName.replace(' ', '-').toLocaleLowerCase()
      recipe.recipe = recipeData
      recipe.slug = slugify(recipeName)

      // Push new recipe to recipe list
      storedRecipes.push(recipe)
      // Write updated list to JSON file
      fs.writeFile('content/recipes.json', JSON.stringify(storedRecipes), (err) => {
        if (err) throw err
      })
    })
    .catch((err) => {
      console.error(err)
    })
})
