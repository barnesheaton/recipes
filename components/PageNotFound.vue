<template>
    <section>
        <Header />
        <section class="lg:px-32 max-w-screen-2xl md:px-16 mt-[80px] mx-auto pt-8 px-0 w-full">
            <div class="h-full w-full flex flex-col justify-center items-center">
                <h1 class="text-2xl font-semibold mb-4">
                    Sorry! We couldn't find that page.
                </h1>
                <a href="/">
                    <el-button round>Go Back Home</el-button>
                </a>
                <h1 class="text-2xl mt-8" v-if="randomRecipes && randomRecipes.length">
                    Or try out one of these delicious recipes.
                </h1>
                <el-divider></el-divider>
            </div>
            </section>
            <div class="flex flex-row flex-wrap justify-center max-w-[80%] mx-auto">
                <NuxtLink class="mx-4 mb-8 hover:text-rose-900 hover:opacity-90" v-for="(recipe, index) in randomRecipes" :key="index" :to="`/recipe/${recipe.slug}`">
                <div class="w-full flex mb-2">
                    <p class="text-2xl font-semibold">{{ recipe.title }}</p>
                </div>
                <div class="w-64 h-64">
                    <img class="w-full h-full object-cover" v-if="recipe.imageURL" :src="recipe.imageURL" />
                </div>
                </NuxtLink>
            </div>
    </section>
</template>

<script>
export default {
    name: 'PageNotFound',
    props: {
        recipes: []
    },
    methods: {
      getRandomSubarray(arr, size) {
        var shuffled = arr.slice(0), i = arr.length, temp, index;
        while (i--) {
          index = Math.floor((i + 1) * Math.random());
          temp = shuffled[index];
          shuffled[index] = shuffled[i];
          shuffled[i] = temp;
        }
        return shuffled.slice(0, size);
      },
    },
    computed: {
      randomRecipes() {
        return this.getRandomSubarray(this.$props.recipes, 10)
      }
    },
}
</script>