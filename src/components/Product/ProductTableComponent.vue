<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header flex justify-between">
          <div class="flex">
            <div class="me-2">
              <el-button v-loading="loading" @click="getData(currentUrl)">
                <el-icon>
                  <font-awesome-icon :icon="['fas', 'rotate']" />
                </el-icon>
              </el-button>
            </div>

            <div class="me-2">
              <el-button @click="dialogOpen">
                <el-icon class="me-1">
                  <font-awesome-icon :icon="['fas', 'circle-plus']"/>
                </el-icon>
                Novo
              </el-button>
            </div>
          </div>

          <div>
            <el-input v-model="search" placeholder="Pesquisar registro" style="width: 200px" @keyup.enter.prevent="btnPesquisar"/>
            <el-button @click.prevent="btnPesquisar">
              <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="dataSet.data" v-loading="loading" style="width: 100%" border>
        <el-table-column label="Produto" prop="name" sortable/>
        <el-table-column label="Descrição" prop="description" sortable/>
        <el-table-column label="Preço" prop="description" sortable/>
        <el-table-column label="Validade" prop="expiry_date" sortable/>
        <el-table-column width="130" label="Criado em" prop="created_at" sortable/>
        <el-table-column width="100" align="center">
          <template #header>
            Ações
          </template>
          <template #default="scope">
            <el-dropdown>
              <el-button type="primary" text>
                <font-awesome-icon size="2x" :icon="['fas', 'ellipsis']" />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleEdit(scope.$index, scope.row)">
                    <el-icon>
                      <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                    </el-icon>
                    Editar
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDelete(scope.$index, scope.row)">
                    <el-icon>
                      <font-awesome-icon :icon="['fas', 'trash-can']" />
                    </el-icon>
                    Excluir
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <Paginate :data="dataSet" @page="getData" v-if="dataSet.total > 0"/>

    </el-card>

    <FormProduct
      :visible="openForm.isOpen"
      :handleClose="
        () => {
          openForm.isOpen = false
        }
      "
      :tipoForm="openForm.tipoForm"
      :product="product"
      @reload="getData(currentUrl)"
    />
  </div>
</template>

<script setup lang="ts">
  import {ref, onMounted, reactive} from 'vue';
  import { ElNotification, ElMessageBox } from 'element-plus';
  import Paginate from "@/components/Paginate.vue";
  import api from "@/plugins/axios";
  import {useAuthStore} from "@/stores/auth";
  import FormCategory from "@/components/Category/FormCategory.vue";
  import FormProduct from "@/components/Product/FormProduct.vue";

  const auth = useAuthStore();

  interface OpenDialog {
    isOpen: boolean;
    tipoForm: string;
  }

  let dataSet = reactive({
    links: []
  });

  let product = reactive({});
  const loading = ref<boolean>(false);
  const currentUrl = ref<string>('/product?page=1');
  const openForm = ref<OpenDialog>({ isOpen: false, tipoForm: 'novo' });
  const search = ref<string>('');

  onMounted((): void => {
    getData(currentUrl.value);
  });

  const getData = (url: string): void => {
    loading.value = true;
    currentUrl.value = url;

    const tokenAuth = 'Bearer '+ auth.token;

    api.get(currentUrl.value, {
      headers:{
        Authorization: tokenAuth
      }
    }).then((response) => {
      dataSet = response.data.product;
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

  const dialogOpen = (): void => {
    openForm.value.tipoForm = 'novo';
    openForm.value.isOpen = true;
  };

  const handleEdit = (index: number, row): void => {
    openForm.value.tipoForm = 'update';
    product = row;
    openForm.value.isOpen = true;
  };

  const handleDelete = (index: number, row): void => {
    ElMessageBox.confirm(
      'Esta ação não poderá ser desfeita. Continuar?',
      'Atenção',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        type: 'warning',
      }
    )
      .then(() => {
        const tokenAuth = 'Bearer '+ auth.token;

        api.delete(`/product-delete/${row.id}`, {
          headers:{
            Authorization: tokenAuth
          }
        }).then((response) => {
          ElNotification.success({
            title: 'Success',
            message: response.data.success,
            offset: 50,
          });
          getData(currentUrl.value);
        }).catch((error) => {
          ElNotification.error({
            title: 'Erro',
            message: error.response.data.error,
            offset: 50,
          });
        });
      })
      .catch(() => {
        ElNotification.info({
          title: 'Info',
          message: 'Ação cancelada!',
          offset: 50,
        });
      });
  };

  const btnPesquisar = (): void => {
    const url = `/product?pesquisa=${search.value}`;
    getData(url);
  };
</script>
<style scoped>
  .card-header {
    display: flex;
  }

  .dialog-footer button:first-child {
    margin-right: 10px;
  }
</style>
