<script setup>
import { ref } from "vue";

const items = ref(["C Major", "D Minor", "E Phrygian"]);
const trashBin = ref([]);

// 1. Pack the data when dragging starts
const onDragStart = (event, index) => {
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("itemIndex", index);
};

// 2. Unpack the data when dropped
const onDrop = (event) => {
  const index = event.dataTransfer.getData("itemIndex");
  const item = items.value.splice(index, 1)[0];
  trashBin.value.push(item);
};
</script>

<template>
  <div class="container">
    <div class="list">
      <div
        v-for="(item, index) in items"
        :key="item"
        draggable="true"
        @dragstart="onDragStart($event, index)"
        class="drag-item"
      >
        {{ item }}
      </div>
    </div>

    <div class="drop-zone" @dragover.prevent @drop="onDrop($event)">
      Drop here to delete
    </div>
  </div>
</template>

<style scoped>
.drag-item {
  padding: 10px;
  background: #eee;
  cursor: grab;
  margin-bottom: 5px;
}
.drop-zone {
  width: 200px;
  height: 100px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
