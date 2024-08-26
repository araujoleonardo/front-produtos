<template>
  <el-dialog
    :model-value="visible"
    :before-close="handleClose"
    :title="title"
    width="40%"
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

      <el-form-item label="Descrição" class="font-medium text-sm text-gray-800">
        <el-input
            id="description"
            v-model="form.description"
            type="textarea"
            size="large"
        />
        <InputError class="mt-1" v-if="validate.description" :message="validate.description[0]" />
      </el-form-item>

      <el-form-item label="Preço" class="font-medium text-sm text-gray-800">
        <el-input
            id="price"
            v-model="form.price"
            type="text"
            size="large"
            v-mask="['R$ #,##', 'R$ ##,##', 'R$ ###,##', 'R$ #.###,##', 'R$ ##.###,##', 'R$ ###.###,##']"
            placeholder="R$ 00,00"
        />
        <InputError class="mt-1" v-if="validate.price" :message="validate.price[0]" />
      </el-form-item>

      <el-form-item label="Validade" class="font-medium text-sm text-gray-800">
        <el-input
            id="expiry_date"
            v-model="form.expiry_date"
            v-mask="['##/##/####']"
            placeholder="99/99/9999"
            type="text"
            size="large"
        />
        <InputError class="mt-1" v-if="validate.expiry_date" :message="validate.expiry_date[0]" />
      </el-form-item>

      <el-form-item label="Imagem" class="font-medium text-sm text-gray-800">
        <ul class="el-upload-list el-upload-list--picture w-full">
          <li class="el-upload-list__item" style="margin: 0">
            <input ref="imageInput" type="file" class="hidden" @change="updatePhotoPreview" >
            <div v-show="imagePreview">
              <span
                  class="block rounded w-20 h-20 bg-cover bg-no-repeat bg-center"
                  :style="'background-image: url(\'' + imagePreview + '\');'"
              />
            </div>

            <div v-if="form.image">
              <div v-show="!imagePreview">
                <span
                    class="block rounded w-20 h-20 bg-cover bg-no-repeat bg-center"
                    :style="'background-image: url(\'' + imageUrl + '\');'"
                />
              </div>
            </div>

            <div class="el-upload-list__item-info">
              <el-button @click.prevent="selectNewPhoto" type="success" link>
                <el-icon class="me-1">
                  <font-awesome-icon :icon="['fas', 'upload']" />
                </el-icon>
                Selecionar Imagem
              </el-button>
            </div>
          </li>
        </ul>
        <span class="text-sm text-lime-500">
          jpg/png arquivo com tamanho máximo de 2mb.
        </span>
        <InputError class="mt-1" v-if="validate.image" :message="validate.image[0]" />
      </el-form-item>

      <el-form-item label="Categoria" class="font-medium text-sm text-gray-800">
        <el-select
            id="category"
            v-model="form.category_id"
            placeholder="Selecione a categoria"
            class="w-full"
            size="large"
        >
          <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
        <InputError class="mt-1" v-if="validate.category_id" :message="validate.category_id[0]" />
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
let categories = reactive({});
const imagePreview = ref(null);
const imageInput = ref(null);
const imageUrl = ref(null);
const form = reactive({
  id: '',
  name: '',
  description: '',
  price: null,
  expiry_date: null,
  image: '',
  category_id: null
});
const emit = defineEmits(['reload']);

const props = defineProps({
  tipoForm: { type: String, default: '' },
  product: { type: Object, default: {} },
  visible: { type: Boolean },
  handleClose: { type: Function },
});

const selectNewPhoto = () => {
  imageInput.value.click();
};

const updatePhotoPreview = () => {
  const photo = imageInput.value.files[0];

  if (! photo) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };

  reader.readAsDataURL(photo);
};

const submit = () => {
  loading.value = true;

  if (imageInput.value) {
    form.image = imageInput.value.files[0];
  }

  const tokenAuth = 'Bearer '+ auth.token;
  console.log(urlSubmit.value)
  api.post(urlSubmit.value, form, {headers:{
      'Content-Type': 'multipart/form-data',
      Authorization: tokenAuth
    }}).then((response) => {
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

const getCategories = (): void => {
  const tokenAuth = 'Bearer '+ auth.token;

  api.get('/list-categories', {
    headers:{
      Authorization: tokenAuth
    }
  }).then((response) => {
    categories = response.data.categories;
  }).catch((error) => {
    ElNotification.error({
      title: 'Erro',
      message: 'Erro ao carregar dados!',
      offset: 50,
    });
  }).finally(() => {
    loading.value = false;
  });
};

watch(() => props.visible,
  (newVisible) => {
    if (newVisible) {
      getCategories()

      if (props.tipoForm === 'novo') {
        title.value = 'Novo Produto'
        btnTitulo.value = 'Salvar'
        urlSubmit.value = '/product-create'
        form.id = ''
        form.name = ''
        form.description = ''
        form.price = null
        form.expiry_date = null
        form.image = ''
        imageUrl.value = null
        imagePreview.value = null
        form.category_id = null
      }

      if (props.tipoForm === 'update') {
        title.value = 'Editar Produto'
        btnTitulo.value = 'Atualizar'
        urlSubmit.value = '/product-update'
        form.id = props.product.id
        form.name = props.product.name
        form.description = props.product.description
        form.price = props.product.price
        form.expiry_date = props.product.expiry_date
        form.image = props.product.image
        imageUrl.value = props.product.image_url
        form.category_id = props.product.category?.id
      }
    }
  }
);
</script>
