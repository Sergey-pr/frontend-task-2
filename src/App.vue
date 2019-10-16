<template>
  <div id="app">
      <h1>The Table</h1>
          <div>
            <span>Headers</span>
            <input v-model="fields" type="text" id="headers">
          </div>
          <div>
            <span>Rows</span>
            <input v-model="rows" type="text" id="rows">
          </div>
          <div>
            <span>Styles</span>
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
            <span>CSS</span>
            <textarea
              id="css"
            ></textarea>
          </div>
        </div>
    <div id="table-div">
      <Table
        v-for="(table, i) in tables"
        :key="i" 
        :fields="table.fields"
        :rows="table.rows"
        :meta="table.meta"
      />
    </div>
  </div>

</template>

<script>
import Table from './components/Table.vue'

export default {
  name: 'app',
  components: {
    Table
  },
  data() {
    return {
      fields: 'Eeny, Meeny, Miny, Moe',
      rows: 6,
      meta: 'red, green, blue',
      tables: []
    }
  },
  methods: {
    createTable() {
      this.tables.push({
        fields: this.fields.split(','),
        rows: +this.rows,
        meta: this.meta.split(',')
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-color: #222;
}
</style>
