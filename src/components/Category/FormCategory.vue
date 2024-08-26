<template>
  <el-dialog
    :model-value="visible"
    :before-close="handleClose"
    :title="title"
    width="30%"
    draggable>
    <hr class="mb-3">
    <el-form
      ref="ruleFormRef"
      v-model="form"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="Nome" class="font-medium text-sm text-gray-800">
        <el-input
          id="name"
          v-model="form.name"
          type="text"
          size="large"
        />
        <InputError class="mt-1" v-if="validate.name" :message="validate.name[0]" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">
          Cancelar
        </el-button>

        <el-button :loading="loading" type="primary" @click.prevent="submit">
          {{ btnTitulo }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from 'vue'
import { ElNotification } from 'element-plus'
import alertValidate from "@/plugins/validate.ts";
import InputError from "@/components/InputError.vue";
import {useAuthStore} from "@/stores/auth";
import api from "@/plugins/axios";

const auth = useAuthStore();

const title = ref('');
const btnTitulo = ref('Submit');
const urlSubmit = ref('');
const loading = ref(false);
const validate = ref({});
const form = reactive({
  id: '',
  name: '',
});
const emit = defineEmits(['reload']);

const props = defineProps({
  tipoForm: { type: String, default: '' },
  category: { type: Object, default: {} },
  visible: { type: Boolean },
  handleClose: { type: Function },
});

const submit = () => {
  loading.value = true;

  const tokenAuth = 'Bearer '+ auth.token;

  api.post(urlSubmit.value, form, {
    headers:{
      Authorization: tokenAuth
    }
  }).then((response) => {
    ElNotification.success({
      title: 'Success',
      message: response.data.success,
      offset: 50,
    });
    emit('reload');
    props.handleClose();
  }).catch((error) => {
    validate.value = error.response.data.errors
    if (!validate.value){
      ElNotification.error({
        title: 'Erro',
        message: error.response.data.error,
        offset: 50,
      });
    }else{
      alertValidate(error);
    }
  }).finally(() => {
    loading.value = false;
  });
}

watch(() => props.visible,
  (newVisible) => {
    if (newVisible) {
      if (props.tipoForm === 'novo') {
        title.value = 'Nova Categoria'
        btnTitulo.value = 'Salvar'
        urlSubmit.value = '/category-create'
        form.id = ''
        form.name = ''
      }

      if (props.tipoForm === 'update') {
        title.value = 'Editar Categoria'
        btnTitulo.value = 'Atualizar'
        urlSubmit.value = '/category-update'
        form.id = props.category.id
        form.name = props.category.name
      }
    }
  }
);
</script>
