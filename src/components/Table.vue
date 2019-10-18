<template>
  <div class="table-div">
    <input v-model="searchField">
    <table>
      <thead>
        <tr>
          <template
             v-for="(value, key) in paginatedData[0]">
          <th
           :class="meta[0]"
           v-if="typeof value !== 'object'"
           :key="key"
           @click="sortData(key)"
          >
            {{ key }}
          </th>
          <th
            v-else
            v-for="(value1, key1) in value"
            :class="meta[0]"
            :key="key1"
            @click="sortInnerData(key, key1)"
          >
            {{ key + '.' + key1 }}
          </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(dict, i) in paginatedData">
          <tr 
            :key="i"
            :class="meta[i % 2 + 1]"
          >
            <template v-for="(value, key, index) in paginatedData[i]">
              <td 
                v-if="typeof value !== 'object'"
                :key="key+index"
                @dblclick="editCell(i, key)"
                @keyup.enter="saveCell(i, key)"
                @keyup.esc="cancelCell(i, key)"
                :style="`width: ${100 / Object.keys(paginatedData[i]).length}%;height: 22px;`"
              >
                <span>{{ value }}</span>
                <textarea
                  @blur="saveCell(i, key, value)"
                  :ref="'input' + i + key"
                  type="text"
                  style="display:none;"
                >
                </textarea>
              </td>
              <td
                v-else
                v-for="(value1, key1) in value"
                :key="key1+index"
                @dblclick="editInnerCell(i, key1, key)"
                @keyup.enter="saveInnerCell(i, key1, key)"
                @keyup.esc="cancelInnerCell(i, key1, key)"
                :style="`width: ${100 / Object.keys(value).length}%;height: 22px;`"
              >
                <span>{{ value1 }}</span>
                <textarea
                  @blur="saveInnerCell(i, key1, key)"
                  :ref="'input' + i + key1"
                  type="text"
                  style="display:none;"
                >
                </textarea>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <button
      @click="clean_table()"
      type="button"
    >Clear table</button>
    <button
      @click="insert_after_row(row_after_index)"
      type="button"
    >Add row after</button>
    <span>Row:</span>
    <input v-model="row_after_index">
    <button
      @click="add_row()"
      type="button"
    >Add row</button>
    <button
      type="button"
      id="show-modal"
      @click="get_json()"
    >Get JSON</button>
    <Modal :data="json" v-if="showModal" @close="showModal = false"></Modal>
    <button
      @click="removeTable()"
      type="button"
    >Remove table</button>
    <button
      v-if="pageNumber > 0"
      @click="prevPage()"
      type="button"
    >&lt;&lt;</button>
    <button
      v-if="pageNumber < pageCount - 1"
      @click="nextPage()"
      type="button"
    >&gt;&gt;</button>
  </div>
</template>

<script>
import Modal from './Modal.vue'

export default {
  name: 'Table',
  components: {
    Modal
  },
  props: {
    data: Array,
    meta: Array,
    id: Number
  },
  data() {
    return {
      json: null,
      escPressed: false,
      trueId: this.id,
      cellVar: null,
      row_after_index: null,
      showModal: false,
      pageNumber: 0,
      size: 10,
      sort: 'pos',
      sortKey: null,
      searchField: null,
      filteredData: this.data
    }
  },
  computed: {
    pageCount() {
      let l = this.filteredData.length
      let s = this.size
      return Math.ceil(l / s)
    },
    paginatedData() {
      const start = this.pageNumber * this.size
      const end = start + this.size
      return this.filteredData.slice(start, end)
    }
  },
  watch: {
    searchField: function (newSearchField, oldSearchField) {
      this.getFilteredData()
    }
  },
  methods: {
    editCell(i, key) {
      let inputBox = this.$refs['input' + i + key][0]
      inputBox.style.width = '100%'
      this.cellVar = this.paginatedData[i][key]
      inputBox.value = this.paginatedData[i][key]
      this.paginatedData[i][key] = ''
      inputBox.style.display = "inline"
      inputBox.focus()
      inputBox.select()
    },
    saveCell(i, key) {
      let inputBox = this.$refs['input' + i + key][0]
      if (this.escPressed === false) {
        this.paginatedData[i][key] = inputBox.value
      } else {
        this.escPressed = false
      }
      inputBox.style.display = "none"
    },
    cancelCell(i, key) {
      let inputBox = this.$refs['input' + i + key][0]
      this.escPressed = true
      inputBox.style.display = "none"
      this.paginatedData[i][key] = this.cellVar
    },
    editInnerCell(i, key, upperKey) {
      let inputBox = this.$refs['input' + i + key][0]
      inputBox.style.width = '100%'
      this.cellVar = this.paginatedData[i][upperKey][key]
      inputBox.value = this.paginatedData[i][upperKey][key]
      this.paginatedData[i][upperKey][key] = ''
      inputBox.style.display = "inline"
      inputBox.focus()
      inputBox.select()
    },
    saveInnerCell(i, key, upperKey) {
      let inputBox = this.$refs['input' + i + key][0]
      if (this.escPressed === false) {
        this.paginatedData[i][upperKey][key] = inputBox.value
      } else {
        this.escPressed = false
      }
      inputBox.style.display = "none"
    },
    cancelInnerCell(i, key, upperKey) {
      let inputBox = this.$refs['input' + i + key][0]
      this.escPressed = true
      inputBox.style.display = "none"
      this.paginatedData[i][upperKey][key] = this.cellVar
    },
    clean_table() {
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < Object.keys(this.data[i]).length; j++) {
          this.data[i][Object.keys(this.data[0])[j]] = ''
        }
      }
    },
    add_row() {
      let dict = {}
      for (let i = 0; i < Object.keys(this.data[i]).length; i++) {
        if (typeof this.data[0][Object.keys(this.data[0])[i]] === 'object') {
          dict[Object.keys(this.data[0])[i]] = {}
          for (let j = 0; j < Object.keys(this.data[0][Object.keys(this.data[0])[i]]).length; j++) {
            dict[Object.keys(this.data[0])[i]][Object.keys(this.data[0][Object.keys(this.data[0])[i]])[j]] = ''
          }
        } else {
          dict[Object.keys(this.data[0])[i]] = ''
        }
      }
      this.data.push(dict)
    },
    insert_after_row(row_after_index) {
      let dict = {}
      for (let i = 0; i < Object.keys(this.data[i]).length; i++) {
        if (typeof this.data[0][Object.keys(this.data[0])[i]] === 'object') {
          dict[Object.keys(this.data[0])[i]] = {}
          for (let j = 0; j < Object.keys(this.data[0][Object.keys(this.data[0])[i]]).length; j++) {
            dict[Object.keys(this.data[0])[i]][Object.keys(this.data[0][Object.keys(this.data[0])[i]])[j]] = ''
          }
        } else {
          dict[Object.keys(this.data[0])[i]] = ''
        }
      }
      this.data.splice(row_after_index, 0, dict)
    },
    removeTable() {
      delete this.$Tables[this.trueId]
      this.$emit('reRender')
    },
    get_json() {
      this.showModal = true
      this.json = JSON.stringify(this.$Tables[this.trueId].data)
    },
    nextPage() {
      this.pageNumber++;
    },
    prevPage() {
      this.pageNumber--;
    },
    sortData(key) {
      if (this.sort === 'pos') {
        this.data = this.data.sort((a, b) => {
          if (!isNaN(+a[key]))  {
            return a[key] - b[key]
          } else {
            var nameA = a[key].toUpperCase()
            var nameB = b[key].toUpperCase()
            if (nameA < nameB) {
              return -1
            }
            if (nameA > nameB) {
              return 1
            }
            return 0
          }
        })
        this.sort = 'neg'
      } else {
        this.data = this.data.sort((a, b) => {
          if (!isNaN(+a[key])) {
            return b[key] - a[key]
          } else {
            var nameA = a[key].toUpperCase()
            var nameB = b[key].toUpperCase()
            if (nameA < nameB) {
              return 1
            }
            if (nameA > nameB) {
              return -1
            }
            return 0
          }
        })
        this.sort = 'pos'
      }
      if (this.sortKey !== key) {
        this.sortKey = key
      }
    },
    sortInnerData(key, key1) {
      if (this.sort === 'pos') {
        this.data = this.data.sort((a, b) => {
          if (!isNaN(+a[key][key1]))  {
            return a[key][key1] - b[key][key1]
          } else {
            var nameA = a[key][key1].toUpperCase()
            var nameB = b[key][key1].toUpperCase()
            if (nameA < nameB) {
              return -1
            }
            if (nameA > nameB) {
              return 1
            }
            return 0
          }
        })
        this.sort = 'neg'
      } else {
        this.data = this.data.sort((a, b) => {
          if (!isNaN(+a[key][key1])) {
            return b[key][key1] - a[key][key1]
          } else {
            var nameA = a[key][key1].toUpperCase()
            var nameB = b[key][key1].toUpperCase()
            if (nameA < nameB) {
              return 1
            }
            if (nameA > nameB) {
              return -1
            }
            return 0
          }
        })
        this.sort = 'pos'
      }
      if (this.sortKey !== key) {
        this.sortKey = key
      }
    },
    getWholeRow(row) {
      let rowArr = []
      for (let i = 0; i < Object.keys(row).length; i++) {
        if (typeof row[Object.keys(row)[i]] === 'object') {
          rowArr.push(row[Object.keys(row)[i]])
          for (let j = 0; j < Object.keys(row[Object.keys(row)[i]]).length; j++) {
            rowArr.push(row[Object.keys(row)[i]][Object.keys(row[Object.keys(row)[i]])[j]])
          }
        } else {
          rowArr.push(row[Object.keys(row)[i]])
        }
      }
      return rowArr.join('')
    },
    getFilteredData() {
      let varData = []
      if (this.searchField) {
        for (let i = 0; i < this.data.length; i++) {
          if (this.getWholeRow(this.data[i]).toLowerCase().includes(this.searchField.trim())) {
            varData.push(this.data[i])
          }
        }
      } else {
        varData = this.data
      }
      this.filteredData = varData
    },
  }
}
</script>

<style scoped>
table {
  border: 2px solid #999;
  border-collapse: collapse;
  width: 90%;
  margin: 1% 5%;
  background-color: #444;
  color: #ddd;
}
th, td {
  padding: 15px;
  border: 2px solid #999;
}
</style>
