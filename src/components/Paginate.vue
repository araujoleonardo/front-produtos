<template>
  <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between mt-4">
    <div class="pull-left" v-if="data">
      <div>
        <p class="text-sm text-gray-700">
          Mostrando
          <span class="font-medium">{{data.to}}</span>
          de
          <span class="font-medium">{{data.total}}</span>
          registros.
        </p>
      </div>
    </div>

    <div class="inline-flex text-sm">
      <button v-for="(link, k) in data.links"
              :key="k"
              class="rounded flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-400"
              :class="{'btn-active font-semibold': link.active}"
              @click="$event => emviaEmit(link.url)"
              v-html="link.label"
      />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['submit']);

defineProps({
  data: { type: Object, default: () => ({})}
});

const emviaEmit = (data) => {
  if (!data) {
    return;
  }

  emit('page', data);
}
</script>

<style scoped>
.btn-active{
  background: #ECF5FF;
  color: #409EFF;
  border: 1px solid #409EFF;
}
</style>
