<template>
  <div class="table-div">
    <table>
      <thead>
        <tr>
          <th v-for="(field, k) in fields" :key="k">
            {{ field }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in rows" :key="i">
          <td v-for="(cell, j) in fields"
            :key="j"
            @dblclick="editCell(i,j)"
            @focusout="saveCell(i,j)"
            @keyup.enter="saveCell(i,j)"
            @keyup.esc="cancelCell(i,j)"
            :ref="'cell' + i + j"
            :style="`width: ${100 / fields.length}%;height: 22px;`"
          >
            <span :ref="'cellText' + i + j" ></span>
            <input :ref="'input' + i + j" type="text" style="display:none;">
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
      <input id="after-row">
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
      json: null,
      textCellVar: null
    }
  },
  methods: {
    editCell(i,j) {
      let cell = this.$refs['cell' + i + j][0]
      let cellText = this.$refs['cellText' + i + j][0]
      let inputBox = this.$refs['input' + i + j][0]
      inputBox.style.width = '100%'
      this.textCellVar = cellText.innerText
      inputBox.value = cellText.innerText
      inputBox.style.display = "inline"
      cellText.style.display = "none"
      inputBox.focus()
      inputBox.select()
    },
    saveCell(i,j) {
      let cell = this.$refs['cell' + i + j][0]
      let cellText = this.$refs['cellText' + i + j][0]
      let inputBox = this.$refs['input' + i + j][0]
      cellText.innerText = inputBox.value
      cellText.style.display = "inline"
      inputBox.style.display = "none"
    },
    cancelCell(i,j) {
      let cell = this.$refs['cell' + i + j][0]
      let cellText = this.$refs['cellText' + i + j][0]
      let inputBox = this.$refs['input' + i + j][0]
      inputBox.style.display = "none"
      cellText.style.display = "inline"
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
