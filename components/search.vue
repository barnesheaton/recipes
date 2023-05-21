<template>
    <section>
    <v-text-field
            @input="onChangeInput"
                v-model="search"
                label="Search"
                outlined
            >
        </v-text-field>
        {{ results }}
    <el-table
      class="max-h-[600px] overflow-y-auto"
      row-class-name="cursor-pointer hover:text-red-900 text-md font-bold text-black"
      :show-header="false"
      :data="results">
      <el-table-column
        prop="title"
        label="Name"
        width="100%">
      </el-table-column>
      <template #empty>
        <template v-if="search && search.length">
            <div class="w-full">
                We weren't able to find that!
            </div>
        </template>
        <template v-else>
            <div class="w-full">
                <body>
                    Try searching by name,
                </body>
                <body>
                    ingredients, cook time, etc.
                </body>
            </div>
        </template>
      </template>
    </el-table>
</section>
</template>

<script>
export default {
    name: 'Search',
    data: () => ({ results: []}),
    async asyncData({ $content, params, payload, route }) {
      // If a payload is provided, no request is made.
      if (payload) {
        // console.log('PAYLOAD')
        const recipe = payload.find(r => r.slug == route.params.slug) 
        return { allRecipes: payload, search: null }
      } else {
        // console.log('CONTENT')
        const recipes = await $content('/recipes')
          .fetch()
          .catch(err => {
            error({ statusCode: 404, message: "Content not found" });
          });

          if (recipes) {
            return {  allRecipes: recipes, search: null }
          } else {
            return {  error: true, search: null}
          }
      }
      // in development, load from local content
    },
    methods: {
        onChangeInput(value) {
            // console.log("onChangeInput", value)
            this.$data.search = value
            this.filterResults()
            this.$forceUpdate()
        },
        filterResults() {
            const recipes = this.$data.allRecipes
            const input = this.$data.search 
            if (input && input.length && recipes) {
                this.loading = true
                this.results = recipes.filter((recipe, index) => {
                    if (index == recipes.length - 1) { 
                        this.loading = false
                    }
                    return recipe.title.includes(input) || recipe.slug.includes(input) || recipe.recipe.includes(input)
                })
                // console.log('filterResults', this.results, input)
            } else {
                this.results = []
            }
        }
    }
}
</script>