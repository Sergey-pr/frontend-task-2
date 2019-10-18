<template>
  <div id="app">
      <h1>The Table</h1>
          <div>
            <span>Headers:</span>
            <input v-model="fields" type="text" id="headers">
          </div>
          <div>
            <span>Rows:</span>
            <input v-model="rows" type="text" id="rows">
          </div>
          <div>
            <span>Styles:</span>
            <input v-model="meta" type="text" id="meta">
          </div>
          <div>
            <button 
              @click="createTable()"
              type="button"
            >Create Table</button>
        </div>
        <div>
          <div>
            <span>CSS:</span>
            <textarea
              v-model="css"
              id="css"
            ></textarea>
          </div>
          <div>
            <span>Data from api:</span>
            <textarea
              v-model="api"
            ></textarea>
          </div>
        </div>
    <div id="table-div">
      <div class="loader" v-if="loader"></div>
      <Table
        v-for="value in $Tables"
        :key="value.id" 
        :data="value.data"
        :meta="value.meta"
        :id="value.id"
        @reRender="reRender()"
      />
    </div>
  </div>
</template>

<script>
import Table from './components/Table.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    Table
  },
  data() {
    return {
      id: 0,
      fields: 'Eeny,Meeny,Miny,Moe',
      rows: 6,
      meta: 'red,green,blue',
      css: `.red {\n\tcolor: lightcoral;\n}
.green {\n\t  color: lightgreen;\n}
.blue {\n\t  color: lightblue;\n}`,
      style: null,
      api: null,
      loader: false
    }
  },
  computed: {
    ...mapGetters([
      'DATA'
    ])
  },
  methods: {
    createTable() {
      this.style.innerHTML = this.css
      if (!this.api) {
        let data = []
        let dict = {}
        for (let i = 0; i < +this.rows; i++) {
          let dict = {}
          for (let j = 0; j < this.fields.split(',').length; j++) {
            dict[this.fields.split(',')[j]] = ''
          }
          data.push(dict)
        }
        this.$Tables[this.id] = {
          data: data,
          meta: this.meta.split(','),
          id: this.id
        } 
      } else {
        this.loader = true
        this.$store.dispatch('GET_DATA', this.api)
          .then(() => {
            this.$Tables[this.id] = {
              data: this.DATA,
              meta: this.meta.split(','),
              id: this.id
            }
            this.loader = false
            this.reRender()
          })
      }
      this.id++
      this.reRender()
    },
    reRender() {
      this.$forceUpdate()
    }
  },
  created() {
    this.style = document.createElement('style')
    this.style.type = 'text/css'
    document.getElementsByTagName('head')[0].appendChild(this.style)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  margin-top: 60px;
}
body {
  background-color: #222;
}
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
