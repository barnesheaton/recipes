<template>
  <section>
    <el-header
      class="flex bg-white flex-row fixed top-0 left-0 right-0 items-center border-b border-gray-400 z-50"
      height="80px"
    >
    <el-menu
    height="100%"
    class="bg-white border-none w-full h-full items-center flex justify-between max-w-screen-2xl mx-auto md:px-16 px-8"
  mode="horizontal"
  background-color="#fff"
  text-color="#000"
  active-text-color="#DC2626">
  <NuxtLink to="/" class="h-[80%]">
    <img class="h-full" src="../assets/images/logo.png" alt="Discover Nuxt 3" />
  </NuxtLink>
  <div class="flex items-center">
    <el-menu-item class="mx-4 text-md font-bold text-black" index="1"><a href="/">Popular</a></el-menu-item>
    <el-popover
    placement="top-start"
    width="320"
    trigger="click"
    content="">
    <template #reference>
      <div class="w-80">
        <el-input
        v-model="input"
        class="h-10"
        placeholder="Search"
        :prefix-icon="ElIconSearch"
        >
      </el-input>
    </div>
    </template>
    <template #default>
      <el-table
      class="max-h-[600px] overflow-y-auto"
      v-if="searchResults && searchResults.length"
      @row-click="onClickSearchResult"
      row-class-name="cursor-pointer hover:text-red-900 text-md font-bold text-black"
      :show-header="false"
      :data="searchResults">
      <el-table-column
        prop="title"
        label="Name"
        width="100%">
      </el-table-column>
    </el-table>
    </template>
    </el-popover>
    {{ recipes }}
  </div>
  </el-menu>
  
    </el-header>
    <el-main class="max-w-screen-2xl m-auto mt-[80px]">
      <Nuxt />
    </el-main>
  </section>
</template>

<script>
export default {
  name: 'default',
  data: () => ({ input: null }),
  async asyncData({ $content, params, payload, route }) {
    if (payload) {
      console.log('PAYLOAD')
      return { recipes: payload }
    } else {
      console.log('CONTENT')
      const recipes = await $content('/recipes')
        .fetch()
        .catch(err => {
          error({ statusCode: 404, message: "Content not found" });
        });
        console.log('GETTING RECIPES')

        if (recipes) {
          return { recipes: recipes }
        } else {
          return { recipes: [], error: true}
        }
    }
  },
  computed: {
    searchResults() {
      const recipes = this.$data.recipes
      const input = this.$data.input 
      // console.log('searchResults', this.$data)
      if (input && input.length && recipes) {
        const filtered = recipes.filter((o) => {
          const nameMatches = o.title.includes(input)
          const slugMatchers = o.slug.includes(input)
          const recipeMatches = o.recipe.includes(input)
          return nameMatches || recipeMatches || slugMatchers
        })
        // const filtered = filter(this.$data.results, (o) => {
        //   const nameMatches = o.title.includes(input)
        //   const slugMatchers = o.slug.includes(input)
        //   const recipeMatches = o.recipe.includes(input)
        //   return nameMatches || recipeMatches || slugMatchers
        // })
        // console.log('filtered', filtered)
        return filtered
      } else {
        return []
      }
    }
  },
  methods: {
    onClickSearchResult(row, column, event) {
      console.log('clicked', row, column, event)
      this.$router.push({
        path: `/recipe/${row.slug}`
      })
      // navigateTo({ path: `/recipe/${row.slug}` })
    }
  }
}
</script>

<!-- <script setup>
import { computed, ref } from 'vue'
import { filter } from 'lodash'

const { data } = await useAsyncData('defaultLayout', () => {
  return queryContent('recipes').findOne().then(res => {
    const recipeObj = res.body
    return recipeObj
  })
})

const input = ref('')

function onClickSearchResult(row, column, event) {
  console.log('clicked', row, column, event)
  navigateTo({ path: `/recipe/${row.slug}` })
}

const searchResults = computed(() => {
  // console.log('searchResults', input)
      if (input.value && input.value.length) {
        const filtered = filter(data.value, (o) => {
          const nameMatches = o.title.includes(input.value)
          const slugMatchers = o.slug.includes(input.value)
          const recipeMatches = o.recipe.includes(input.value)
          return nameMatches || recipeMatches || slugMatchers
        })
        // console.log('filtered', filtered)
        return filtered
      } else {
        return []
      }
 })
</script> -->

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

:deep() .el-header {
  padding-left: 4rem !important;
  padding-right: 4rem !important;
}
</style>

<style>
/* html {
  font-family: "Noto Sans";
} */
</style>
