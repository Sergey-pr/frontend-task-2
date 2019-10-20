<template>
  <div id="app">
      <h1>Table Settings:</h1>
      <div class="table-options">
        <div class="table-options-main">
          <input type="radio" id="radio-methods" value="methods" v-model="input">
          <label for="radio-methods">Methods:</label>
          <div class="table-options-unit">
            <span>Fields: </span>
            <input v-model="fields" type="text" id="headers">
          </div>
          <div class="table-options-unit">
            <span>Rows: </span>
            <input v-model="rows" type="text" id="rows">
          </div>
          <div class="table-options-unit">
            <span>Meta: </span>
            <input v-model="meta" type="text" id="meta">
          </div>
          <div class="table-options-unit">
            <button
              @click="createTable()"
              type="button"
            >
              Create Table
            </button>
          </div>
        </div>
      <div class=table-options-secondary>
        <span>CSS:</span>
        <div class="table-options-unit">
          <textarea
            v-model="css"
            id="css"
          ></textarea>
        </div>
      </div>
      <div class=table-options-secondary>
        <input type="radio" id="radio-api" value="api" v-model="input">
        <label for="radio-api">Public API Endpoint:</label>
        <div class="table-options-unit">
          <textarea
            v-model="api"
          ></textarea>
        </div>
      </div>
      <div class=table-options-secondary>
        <input type="radio" id="radio-json" value="json" v-model="input">
        <label for="radio-json">Data from json:</label>
        <div class="table-options-unit">
          <textarea
            v-model="json"
          ></textarea>
        </div>
      </div>
    </div>
    <div id="table-div">
      <div class="loader" v-if="loader"></div>
      <div class="error" v-if="error">{{ error }}</div>
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
      api: 'https://jsonplaceholder.typicode.com/comments',
      loader: false,
      error: null,
      json: null,
      input: 'methods'
    }
  },
  computed: {
    ...mapGetters([
      'DATA'
    ])
  },
  methods: {
    async createTable() {
      this.error = null
      this.style.innerHTML = this.css
      if (this.input === 'api') {
        this.loader = true
        try {
          await this.$store.dispatch('GET_DATA', this.api)
            .then(() => {
              this.$Tables[this.id] = {
                data: this.DATA,
                meta: this.meta.split(','),
                id: this.id
              }
              this.loader = false
              this.reRender()
            })
        } catch (e) {
          this.loader = false
          this.error = 'API Error'
        }
      } else if (this.input === 'json') {
        try {
          this.$Tables[this.id] = {
            data: JSON.parse(this.json),
            meta: this.meta.split(','),
            id: this.id
          }
        } catch (e) {
          this.error = 'JSON Error'
        }
      } else {
        let data = []
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
  margin: 5% 45%;
  border: 16px solid #444;
  border-top: 16px solid #999;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.table-options {
  text-align: center;
  display: inline-block;
}
.table-options-main, .table-options-secondary {
  float: left;
}
.table-options-unit {
  margin: 2px;
}
textarea {
  height: 85px;
  width: 250px;
  border-radius: 5px;
  resize: none;
}
input {
  border-radius: 5px;
}
.table-div {
  clear: left;
}
.error {
  font-size: 30pt;
  color: red;
}
</style>
