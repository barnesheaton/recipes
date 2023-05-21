<template>
    <section>
    <el-header
      class="flex bg-white flex-row fixed top-0 left-0 right-0 items-center border-b border-gray-400 z-50"
      height="80px"
    >
    <el-menu
    height="100%"
    class="bg-white border-none w-full h-full items-center flex max-w-screen-2xl mx-auto sm:px-16 px-4"
  mode="horizontal"
  background-color="#fff"
  text-color="#000"
  active-text-color="#DC2626">
  <!-- <NuxtLink to="/" class="h-[80%]"> -->
    <a href="/" class="h-[80%]">
        <img class="h-full" src="../assets/images/logo.png" alt="Discover Nuxt 3" />
    </a>
  <!-- </NuxtLink> -->
  <div class="flex-1 justify-end items-center flex">
    <el-menu-item class="mx-4 text-md font-bold text-black" index="1"><a href="/">Popular</a></el-menu-item>
    </div>
<!-- <div class="flex-1 justify-end items-center sm:hidden flex">

    <el-menu-item @click="onClickMenu" class="flex items-center" index="1"><Menu /></el-menu-item>
</div> -->
  </el-menu>  
</el-header>
</section>
</template>

<script>
import Magnify from 'vue-material-design-icons/Magnify.vue'
import Menu from 'vue-material-design-icons/Menu.vue'

export default {
    name: 'Header',
    components: {
      Magnify,
      Menu
    },
    // watch: {
    //         search (val) {
    //             // Items have already been loaded
    //             // if (this.results.length > 0) return
    //             this.loading = true
    //             this.filterResults(val)
    //     },
    // },
    methods: {
        onChangeInput(value) {
            // console.log("onChangeInput", value)
            this.$data.search = value
            this.filterResults()
        },
        onClickMenu() {
            // console.log("CLICKED MENU", this.$data)
            this.drawer = true;
        },
        onClickSearchResult(row, column, event) {
            this.$router.push({
                path: `/recipe/${row.slug}`
            })
        },
        onClickPopular() {
            this.$router.push({
                path: `/`
            })
        },
        filterResults() {
            const recipes = this.$props.recipes
            const input = this.$data.input 
            // console.log('filterResults', this.recipes, input)
            if (input && input.length && recipes) {
                this.loading = true
                this.results = recipes.filter((recipe, index) => {
                    if (index == recipes.length - 1) { 
                        this.loading = false
                    }
                    return recipe.title.includes(input) || recipe.slug.includes(input) || recipe.recipe.includes(input)
                })
            } else {
                this.results = []
            }
        }
    },
    computed: {
    searchResults() {
      const recipes = this.$props.recipes
      const input = this.$data.input 
    //   console.log('COMPUTED', this.recipes, input)
      if (input && input.length && recipes) {
        this.loading = true
        return recipes.filter((recipe, index) => {
            if (index == recipes.length - 1) { 
                // console.log("EO Filter")
                this.loading = false
            }
            return recipe.title.includes(input) || recipe.slug.includes(input) || recipe.recipe.includes(input)
        })
      } else {
        return []
      }
    }
  },
}
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

:deep() .v-menu {
  display: inline-block !important;
}

:deep() .el-menu--horizontal  {
  max-width: 1536px !important;
}

:deep() .el-drawer__body {
    padding-left: 8px;
    padding-right: 8px;
}
</style>