<template>
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <a class="modal-default-button" @click="$emit('close')">
              X
            </a>
            <div class="modal-header">
              <slot name="header">
                JSON data:
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
                <textarea :ref="'json'" v-model="data"></textarea>
              </slot>
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <button @click="copy()">Copy to buffer</button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    data: String
  },
  methods: {
    copy() {
      let copyText = this.$refs['json']
      copyText.select()
      copyText.setSelectionRange(0, 99999)
      document.execCommand('copy')
    }
  }
}
</script>

<style scoped>
textarea {
  width: 400px;
  height: 500px;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  width: 500px;
  height: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #444;
  border-radius: 5px;
  border: #999 solid 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header h3 {
  margin-top: 0;
}
.modal-body {
  margin: 20px 0;
}
.modal-default-button {
  float: right;
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
a {
  border: white solid 1px;
  background:
    radial-gradient(
      circle,
    rgba(138,0,0,1) 100%,
    rgba(70,0,0,1) 0%
    );
  width: 25px;
  cursor: pointer;
  font-size: 15pt;
  font-weight: bolder;
}
</style>
