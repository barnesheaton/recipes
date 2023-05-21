<template>
  <div>
  <PageNotFound :recipes="allRecipes" v-if="error || !recipe" />
  <section v-else class="font-normal text-md">
    <Header />
    <section class="lg:px-32 max-w-screen-2xl md:px-16 mt-[80px] mx-auto pb-16 pt-8 px-0 w-full">
      <div class="flex flex-col items-center w-full">
        <p class="text-md">How to make:</p>
        <h1 class="text-4xl font-bold">{{ recipe.title }}</h1>
        <div class="flex flex-col sm:max-w-[800px] w-[600px] mt-8 max-w-full">
          
        <img class="w-full object-cover max-h-[400px]" :alt="recipe.title" v-if="recipe && recipe.imageURL" :src="recipe.imageURL" />
        <div :v-if="recipeData && recipeData.servings" class="flex w-full h-full bg-red-100 py-8 px-16 mt-8 justify-between">
          <div class="flex flex-col items-center">
            <p>Yields</p>
            <div class="border-b border-black w-4 my-2"></div>
            <p class="text-md font-bold">{{ recipeData.servings }}</p>
          </div>
          <div class="flex flex-col items-center">
            <p class="font-normal">Prep Time:</p>
            <div class="border-b border-black w-4 my-2"></div>
            <p class="text-md font-bold">{{ recipeData.prepTime }}</p>
          </div>
          <div class="flex flex-col items-center">
            <p>Cook Time:</p>
            <div class="border-b border-black w-4 my-2"></div>
            <p class="text-md font-bold">{{ recipeData.cookTime }}</p>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
    <div class="flex flex-row flex-wrap">
      <div class="flex flex-1 flex-col sm:min-w-[400px] max-w-full px-8 md:px-0">
        <div>

          <h1 class="text-3xl font-bold mb-4">Ingredients</h1>
          <div class="flex">
            <ul>
              <li v-for="ingredient in ingredients" :key="ingredient" :value="ingredient">
                <span class="text-rose-900 text-2xl">•{{' '}}</span>{{ ingredient.replace('-', '') }}
              </li>
              <li class="flex">
                <el-divider></el-divider>
              </li>
            </ul>
          </div>
      </div>
      </div>
      <div class="flex flex-1 flex-col sm:min-w-[400px] max-w-full px-8 md:px-0">
        <h1 class="text-3xl font-bold mb-4">Directions</h1>
        <div class="flex flex-col">
          <div class="flex flex-col mb-3" v-for="(i, index) in instructions" :key="i" :value="i">
            <p class="text-rose-900 text-md font-bold">
              Step {{ index + 1 }}
            </p>
            <p class="text-md">
              {{ i }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </section>
  <div class="flex flex-col w-full justify-center items-center px-8 text-center">
    <h1 class="text-2xl font-semibold mt-8">
      You might also like these delicious recipes!
    </h1>
    <el-divider></el-divider>
  </div>
  <div class="flex flex-row flex-wrap justify-center max-w-[80%] mx-auto">
      <NuxtLink class="mx-4 mb-8 hover:text-rose-900 hover:opacity-90" v-for="(recipe) in allRecipes.slice(0, 20)" :key="recipe.slug" :to="`/recipe/${recipe.slug}`">
        <div class="w-full flex mb-2">
            <p class="text-2xl font-semibold">{{ recipe.title }}</p>
        </div>
        <div class="w-64 h-64">
            <img class="w-full h-full object-cover" v-if="recipe.imageURL" :src="recipe.imageURL" />
        </div>
      </NuxtLink>
  </div>
  </section>
  </div>
  </template>
  
  <script>
  export default {
    name: 'PageArticle',
    async asyncData({ $content, params, payload, route }) {
      // If a payload is provided, no request is made.
      if (payload) {
        // console.log('PAYLOAD')
        const recipe = payload.find(r => r.slug == route.params.slug) 
        if (recipe) {
          return { recipe: recipe, allRecipes: payload, search: null }
        } else {
          return { error: 404, allRecipes: payload}
        }
      } else {
        // console.log('CONTENT')
        const recipes = await $content('/recipes')
          .fetch()
          .catch(err => {
            // return {error: 404, allRecipes: []}
          });
          if (recipes && recipes.length) {
            const recipe = recipes.find(r => r.slug == route.params.slug)
            if (recipe) {
              return { recipe, allRecipes: recipes, search: null }
            } else if (!recipe && recipes) {
              return {error: 404, allRecipes: recipes}
            } else {
              return {error: 404, allRecipes: []}
            }
          } else {
            return {error: 404, allRecipes: []}
          }
      }
      // in development, load from local content
    },
    head() {
      if (this.$data.recipe) {
        return {
          title: `${this.$data.recipe.title || this.$route.params.slug} Recipe - How To Make`
        }
      }
    },
    computed: {
      randomRecipes() {
        const rs = this.$data.allRecipes
        if (rs && rs.length) {
          const start =  Math.floor(Math.random()*rs.length)
          return rs.slice(start, start + 2)
        } else {
          return []
        }
      },
      recipeData() {
        const recipeString = this.$data.recipe && this.$data.recipe.recipe
        if (recipeString && recipeString.length) {
          const data = {}
          recipeString.split('\n\n').map((item, index) => {
            if (item.includes("Prep Time")) {
              data.prepTime = item.slice(11)
            }
            if (item.includes("Servings")) {
              data.servings = item.slice(10)
            }
            if (item.includes("Cook Time")) {
              data.cookTime = item.slice(11)
            }
          })
          return data
        } else {
          return {}
        }
      },
      ingredients() {
        const recipeString = this.$data.recipe && this.$data.recipe.recipe
        if (recipeString && recipeString.length) {
          const recipeArray = recipeString.split('\n\n')
          // console.log('recipeArray', recipeArray)
          const start = recipeString.indexOf('Ingredients:')
          const end = recipeString.indexOf('Instructions:')
          const res = recipeString.substring(start + 15, end).split('\n').filter(item => {if (item.length) return item})
          // console.log('res', res)
          // return recipeArray[recipeArray.indexOf('Ingredients:') + 1].split('\n')
          return res
        } else {
          return []
        }
      },
      instructions() {
        const recipeString = this.$data.recipe && this.$data.recipe.recipe
        // console.log('instructions', this.$data.recipe, recipeString)
        if (recipeString && recipeString.length) {
          const start = recipeString.indexOf('Instructions:')
          const end = recipeString.length
          const breakpoint = /[0-9]+\./
          return recipeString.substring(start + 17, end).split(breakpoint)
        } else {
          return []
        }
      }
    }
  };
  </script>

<style scoped>
:deep() .el-table__body {
  width: 100% !important
}
:deep() .el-table__header {
  width: 100% !important;
}

:deep() .el-table__row > td {
  background-color: initial !important;
}

:deep() .el-loading-spinner > td {
  display: flex;
  justify-content: center;
}

:deep() .el-header {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

:deep() .el-drawer {
  width: 80% !important;
}

:deep() .el-table__empty-block {
  width: 100% !important;
}

:deep() .el-table__empty-text {
  width: 100% !important;
}

:deep() .el-drawer__body {
    padding-left: 8px;
    padding-right: 8px;
}
</style>
