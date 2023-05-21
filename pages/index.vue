<template>
  <section>
    <Header />
    <div class="flex flex-col items-center mt-[80px] pt-8">
      <h1 class="text-4xl font-bold mb-8">POPULAR RECIPES</h1>
      <div class="flex flex-row flex-wrap justify-center max-w-[80%]">
        <NuxtLink class="mx-4 mb-8 hover:text-rose-900 hover:opacity-90" v-for="(recipe, index) in allRecipes.slice(0, 30)" :key="index" :to="`/recipe/${recipe.slug}`">
          <div class="w-full flex mb-2">
            <p class="text-2xl font-semibold">{{ recipe.title }}</p>
          </div>
          <div class="w-64 h-64">
            <img class="w-full h-full object-cover" v-if="recipe.imageURL" :src="recipe.imageURL" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'IndexPage',
  async asyncData({ $content, params, payload, route }) {
      // If a payload is provided, no request is made.
      if (payload) {
        // console.log('PAYLOAD')
        return { allRecipes: payload }
      } else {
        // console.log('CONTENT')
        const recipes = await $content('/recipes')
          .fetch()
          .catch(err => {});

          if (recipes) {
            return { allRecipes: recipes }
          } else {
            return { allRecipes: [], error: true}
          }
      }
      // in development, load from local content
    },
    // methods: {
    //   getRandomSubarray(arr, size) {
    //     var shuffled = arr.slice(0), i = arr.length, temp, index;
    //     while (i--) {
    //       index = Math.floor((i + 1) * Math.random());
    //       temp = shuffled[index];
    //       shuffled[index] = shuffled[i];
    //       shuffled[i] = temp;
    //     }
    //     return shuffled.slice(0, size);
    //   },
    // },
    // computed: {
    //   randomRecipes() {
    //     return this.getRandomSubarray(this.$data.allRecipes, 30)
    //   }
    // },
}
</script>
