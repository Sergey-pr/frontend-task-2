<template>
  <div class="table-div">
    <input class="input-search" v-model="searchField" placeholder="Search">
    <table>
      <thead>
        <tr>
          <th class="table-col-selected">
            <input
              type="checkbox"
              @click="selectAll()"
              :value="true"
              v-model="selectAllVar"
            >
          </th>
          <template
             v-for="(value, key) in paginatedData[0]"
          >
            <th
            :class="meta[0]"
            v-if="typeof value !== 'object'"
            :key="key"
            @click="sortData(key)"
            >
              <span>{{ key }}</span>
              <span v-if="sort === 'pos' && sortKey === key">&#x25BC;</span>
              <span v-if="sort === 'neg' && sortKey === key">&#x25B2;</span>
            </th>
            <th
              v-else
              v-for="(value1, key1) in value"
              :class="meta[0]"
              :key="key + '.' + key1"
              @click="sortData(key1, key)"
            >
              <span>{{ key + '.' + key1 }}</span>
              <span v-if="sort === 'pos' && sortKey === key1">&#x25BC;</span>
              <span v-if="sort === 'neg' && sortKey === key1">&#x25B2;</span>
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
            <td class="table-col-selected">
              <input type="checkbox" :value="i" v-model="selected">
            </td>
            <template v-for="(value, key, index) in paginatedData[i]">
              <td
                v-if="typeof value !== 'object'"
                :key="key+index"
                @dblclick="editCell(i, key)"
                @keydown.enter="saveCell(i, key)"
                @keyup.esc="cancelCell(i, key)"
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
                @dblclick="editCell(i, key1, key)"
                @keydown.enter="saveCell(i, key1, key)"
                @keyup.esc="cancelCell(i, key1, key)"
              >
                <span>{{ value1 }}</span>
                <textarea
                  @blur="saveCell(i, key1, key)"
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
    <div class="table-options">
      <button
        class="table-options-unit"
        @click="clean_table()"
        type="button"
      >
        Clear table
      </button>
      <button
        class="table-options-unit"
        @click="add_row()"
        type="button"
      >
        Add row
      </button>
      <span class="table-options-unit">Row:</span>
      <input class="table-options-input" v-model="row_after_index">
      <button
        class="table-options-unit"
        @click="insert_after_row(row_after_index)"
        type="button"
      >
        Add row after
      </button>
      <button
        class="table-options-unit"
        @click="removeRows()"
        type="button"
      >
        Remove Rows
      </button>
      <button
        class="table-options-unit"
        type="button"
        id="show-modal"
        @click="get_json()"
      >
        Get JSON
      </button>
      <Modal :data="json" v-if="showModal" @close="showModal = false"></Modal>
      <button
        class="table-options-unit"
        @click="removeTable()"
        type="button"
      >
        Remove table
      </button>
    </div>
    <div class="pagination">
      <a
        v-if="pageNumber > 0"
        @click="pageNumber--"
      >&#171;</a>
      <a
        v-for="i in pageCount"
        :key="i"
        @click="pageNumber = i - 1"
      >
        <span
          class="pagination-links"
          id="pagination-current"
          v-if="i === pageNumber + 1"
        >{{ i }}</span>
        <span
          class="pagination-links"
          v-if="(i === 1 && i !== pageNumber + 1) || (i === pageCount && i !== pageNumber + 1)"
        >{{ i }}</span>
        <span
          class="pagination-links"
          v-if="i > pageNumber - 5
            && i < pageNumber + 5
            && i !== pageNumber + 1
            && i !== pageCount
            && i !== 1"
        >{{ i }}</span>
      </a>
      <a
        v-if="pageNumber < pageCount - 1"
        @click="pageNumber++"
      >&#187;</a>
    </div>
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
      filteredData: this.data,
      selected: [],
      selectAllVar: false,
      bufferHeaders: {}
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
    editCell(i, key, upperKey) {
      let inputBox = this.$refs['input' + i + key][0]
      inputBox.style.width = '100%'
      if (upperKey) {
        this.cellVar = this.paginatedData[i][upperKey][key]
        inputBox.value = this.paginatedData[i][upperKey][key]
        this.paginatedData[i][upperKey][key] = ''
      } else {
        this.cellVar = this.paginatedData[i][key]
        inputBox.value = this.paginatedData[i][key]
        this.paginatedData[i][key] = ''
      }
      inputBox.style.display = 'inline'
      inputBox.focus()
    },
    saveCell(i, key, upperKey) {
      let inputBox = this.$refs['input' + i + key][0]
      if (this.escPressed === false) {
        if (upperKey) {
          if (this.paginatedData[i][upperKey]) {
            this.paginatedData[i][upperKey][key] = inputBox.value
          }
        } else {
          this.paginatedData[i][key] = inputBox.value
        }
      } else {
        this.escPressed = false
      }
      inputBox.style.display = 'none'
    },
    cancelCell(i, key, upperKey) {
      let inputBox = this.$refs['input' + i + key][0]
      this.escPressed = true
      inputBox.style.display = 'none'
      if (upperKey) {
        this.paginatedData[i][upperKey][key] = this.cellVar
      } else {
        this.paginatedData[i][key] = this.cellVar
      }
    },
    clean_table() {
      for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < Object.keys(this.data[i]).length; j++) {
          if (typeof this.data[i][Object.keys(this.data[0])[j]] !== 'object') {
            this.data[i][Object.keys(this.data[0])[j]] = ''
          } else {
            for (let k = 0; k < Object.keys(this.data[0][Object.keys(this.data[0])[j]]).length; k++) {
              this.data[i][Object.keys(this.data[0])[j]][Object.keys(this.data[i][Object.keys(this.data[0])[j]])[k]] = ''
            }
          }
        }
      }
    },
    add_row() {
      let dict = {}
      for (let i = 0; i < Object.keys(this.data[0]).length; i++) {
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
      for (let i = 0; i < Object.keys(this.data[0]).length; i++) {
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
    removeRows() {
      this.bufferHeaders = this.data[0]
      for (let i = 0; i < this.selected.length; i++) {
        this.data.splice(this.selected[i] - i, 1)
      }
      this.selected = []
      if (this.data.length < 1) {
        this.data.push(this.bufferHeaders)
        this.clean_table()
      }
    },
    removeTable() {
      delete this.$Tables[this.trueId]
      this.$emit('reRender')
    },
    get_json() {
      this.showModal = true
      this.json = JSON.stringify(this.$Tables[this.trueId].data)
    },
    sortData(key, upperKey) {
      this.filteredData = this.filteredData.sort((a, b) => {
        let aKey = a[key]
        let bKey = b[key]
        if (upperKey) {
          aKey = a[upperKey][key]
          bKey = b[upperKey][key]
        }
        if (!isNaN(+aKey)) {
          if (this.sort === 'pos') {
            return aKey - bKey
          } else {
            return bKey - aKey
          }
        } else {
          var nameA = aKey.toUpperCase()
          var nameB = bKey.toUpperCase()
          if (nameA < nameB) {
            if (this.sort === 'pos') {
              return -1
            } else {
              return 1
            }
          }
          if (nameA > nameB) {
            if (this.sort === 'pos') {
              return 1
            } else {
              return -1
            }
          }
          return 0
        }
      })
      if (this.sort === 'pos') {
        this.sort = 'neg'
      } else {
        this.sort = 'pos'
      }
      this.sortKey = key
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
    selectAll() {
      if (this.selectAllVar === false) {
        for (let i = 0; i < this.data.length; i++) {
          this.selected.push(i)
        }
      } else {
        this.selected = []
      }
    }
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
  min-width: 100px;
}
a {
  cursor: pointer;
  color: #999;
}
a:hover {
  color: #fff;
}
.pagination {
  border: grey solid 1px;
  border-radius: 5px;
  padding: 2px;
  margin: 0px 5%;
  float: right;
}
.pagination-links {
  margin: 0px 3px;
  font-size: 15pt;
}
#pagination-current {
  font-weight: 600;
  color: #fff;
}
.table-options {
  float: left;
  margin: 0px 5% 1% 5%;
}
.input-search {
  float: left;
  margin: 5px 5%;
  border-radius: 5px;
  width: 200px;
}
.table-options-unit {
  margin-left: 5px;
  border-radius: 5px;
}
.table-options-input {
  width: 35px;
}
.table-col-selected {
  max-width: 20px;
  min-width: 20px;
}
</style>
