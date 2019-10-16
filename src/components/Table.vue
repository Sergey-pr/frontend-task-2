<template>
  <div class="table-div">
    <table>
      <thead>
        <tr>
          <th v-for="field in fields" :key="field">
            {{ field }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in rows" :key="i">
          <td v-for="(cell, j) in fields"
            :key="cell"
            @dblclick="editCell(i,j)"
            @focusout="saveCell(i,j)"
            @keyup.enter="blurCell(i,j)"
            @keyup.esc="cancelCell(i,j)"
            :ref="'cell' + i + j"
            :style="`width: ${100 / fields.length}%;height: 22px;`"
          >
            <span :ref="'cellText' + i + j" ></span>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      onclick="tbl.clean_table()"
      type="button"
    >Clear table</button>
    <button
      onclick="tbl.insert_row(rowAfter.value)"
      type="button"
    >Add row after</button>
    <div class="input-group-prepend">
      <span >Row</span>
      <input type="text" id="after-row">
    </div>
    <button
      onclick="tbl.add_row()"
      type="button"
    >Add row</button>
    <button
      onclick="getJSON()"
      type="button"
    >Get JSON</button>
    <div
      v-if="json"
      id="json-modal"
    >
      <div class="modal-header">
        <h5 id="exampleModalLabel">JSON Data</h5>
        <button
          type="button"
        >
        </button>
      </div>
      <div class="modal-body">
        <textarea
          class="form-control"
          aria-label="With textarea"
          id="json-data"
        ></textarea>
      </div>
    </div>
    <button
      onclick="removeTable()"
      type="button"
    >Remove table</button>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    fields: Array,
    rows: Number,
    meta: Array
  },
  data() {
    return {
      json: null
    }
  },
  methods: {
    editCell(i,j) {
      let cell = this.$refs['cell' + i + j]
      let cellText = this.$refs['cellText' + i + j]
      let inputBox = document.createElement('input')
      inputBox.style.width = '100%'
      inputBox.ref = 'inputBox' + i + j
      inputBox.setAttribute('type', 'text')
      inputBox.setAttribute('value', cellText.innerText);
      cellText.style.display = "none"
      cell.appendChild(inputBox)
      inputBox.focus()
      inputBox.select()
    },
    saveCell(i,j) {
      let cell = this.$refs['cell' + i + j]
      let cellText = this.$refs['cellText' + i + j]
      let inputBox = this.$refs['inputBox' + i + j]
      cellText.innerText = inputBox.value
      cellText.style.display = "inline"
      inputBox.remove()
    },
    blurCell(i,j) {
      let inputBox = document.getElementById('inputBox' + i + j)
      inputBox.blur()
    },
    cancelCell(i,j) {
      let cellText = document.getElementById('cellText' + i + j)
      let inputBox = document.getElementById('inputBox' + i + j)
      cellText.style.display = "inline"
      let temp = cellText.innerText
      inputBox.blur()
      cellText.innerText = temp
    }
  }
}
</script>

<style scoped>
table {
  border: 2px solid #999;
  border-collapse: collapse;
  width: 90%;
  margin: 5%;
  background-color: #444;
  color: #ddd;
}
th, td {
  padding: 15px;
  border: 2px solid #999;
}
</style>
