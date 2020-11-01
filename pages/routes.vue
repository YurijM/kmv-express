<template>
  <v-card min-width="100%" color="green lighten-5">
    <v-dialog v-model="dialog" persistent max-width="350px">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-select
              class="pb-0"
              :items="statuses"
              v-model="editedItem.status_id"
              label="Статус"
              no-data-text="Статусы не заведены"
              autofocus
            />

            <v-textarea
              rows="1"
              label="Комментарий"
              auto-grow
              v-model="editedItem.comment"
              hide-details
            />
          </v-card-text>
        </v-form>

        <v-card-actions class="dark blue-grey darken-3 py-2 px-5">
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="close()"> Отмена </v-btn>
          <v-btn color="success" text :loading="loading" @click="save">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-title
      class="d-flex green accent-2 py-1 green--text text--darken-4"
      :style="{ borderBottom: '2px solid green !important' }"
    >
      <v-img src="logo.png" max-width="70" />
      <span class="ml-2 font-weight-bold">Курьер</span>

      <div v-if="!!courier" class="flex-grow-1 text-right">
        {{ courier.family }} {{ courier.name }}

        <v-btn icon @click="exit">
          <v-tooltip color="green darken-3" bottom>
            <template v-slot:activator="{ on }">
              <v-icon color="green darken-4" right v-on="on"
                >fas fa-sign-out-alt</v-icon
              >
            </template>
            <span>Выход</span>
          </v-tooltip>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-title class="py-1 body-1 green lighten-3 blue-grey--text">
      <span>Маршруты (</span>
      <span class="" v-if="range">{{ range }}&nbsp;</span>
      <span>за последние 2 месяца)</span>

      <v-spacer />

      <v-btn
        v-for="status in getStatuses"
        :key="status.id"
        x-small
        :color="status.color"
        class="mr-2"
        :disabled="status.status === range"
        @click="load(status.status)"
      >
        {{ status.status }}
      </v-btn>

      <v-btn x-small color="info" :disabled="!range" @click="load()">
        Все
      </v-btn>
    </v-card-title>

    <v-data-table
      dense
      class="mb-5 mx-auto green lighten-5"
      :headers="headers"
      :items="routes"
      item-key="order_id"
      group-by="route"
      no-data-text="Маршрутов нет"
      hide-default-footer
      :items-per-page="routes.length"
      mobile-breakpoint="350"
    >
      <template v-slot:group.header="{ items, isOpen, toggle }">
        <th :colspan="Object.keys(items[0]).length" class="green lighten-3">
          <v-icon class="ml-5" x-small @click="toggle">
            {{ isOpen ? "fas fa-minus" : "fas fa-plus" }}
          </v-icon>
          <span class="ml-1" :style="{ fontSize: '1.25em' }">{{
            items[0].route
          }}</span>
        </th>
      </template>

      <template v-slot:item.status="{ item }">
        <div class="d-flex" :class="`${item.color}--text`">
          <v-icon left small :color="item.color">
            {{ item.icon }}
          </v-icon>
          {{ item.status }}

          <v-tooltip
            v-if="item.comment.length > 0"
            max-width="400"
            :color="item.color"
            bottom
          >
            <template v-slot:activator="{ on }">
              <div v-on="on" class="ml-1">
                <v-icon small :color="item.color"> fas fa-ellipsis-h </v-icon>
              </div>
            </template>
            <span class="caption">{{ item.comment }}</span>
          </v-tooltip>
        </div>
      </template>

      <template v-slot:item.date="{ item }">
        {{ formatDate(item.date) }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          class="mr-2"
          title="Редактировать"
          x-small
          @click="editItem(item)"
          >fas fa-pen</v-icon
        >
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "routes",
  async asyncData({ store }) {
    await store.dispatch("status/loadStatuses");
    await store.dispatch("route/loadRoutes", {
      idCourier: store.getters["courier/getCourier"].id,
      status: "не выполнено",
    });
  },
  data() {
    return {
      test: 'Проверка Git',
      dialog: false,
      valid: true,
      loading: false,
      statuses: [],
      range: "не выполнено",
      headers: [
        { text: "Заявка", value: "order", sortable: false },
        { text: "Дата", value: "date", align: "center", sortable: false },
        { text: "Город", value: "city" },
        { text: "Адрес", value: "address", sortable: false },
        { text: "Статус", value: "status" },
        { text: "", value: "actions", align: "center", sortable: false },
      ],
      editedItem: {
        status_id: null,
        status: "",
        color: "",
        icon: "",
        comment: "",
      },
      defaultItem: {
        status_id: null,
        status: "",
        color: "",
        icon: "",
        comment: "",
      },
    };
  },
  created() {
    this.getStatuses.forEach((e) => {
      this.statuses.push({ value: e.id, text: e.status });
    });
  },
  computed: {
    ...mapGetters({
      courier: "courier/getCourier",
      routes: "route/getRoutes",
      getStatuses: "status/getStatuses",
    }),
  },
  methods: {
    ...mapActions({
      loadRoutes: "route/loadRoutes",
      updateStatus: "route/updateStatus",
      logout: "courier/logout",
    }),
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },
    async exit() {
      await this.logout();
      await this.$router.push("/");
    },
    editItem(item) {
      this.dialog = true;
      this.editedItem = Object.assign({}, item);
    },
    close() {
      this.$refs.form.reset();
      this.dialog = false;

      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },
    async load(range) {
      if (!range) range = "";

      await this.loadRoutes({
        idCourier: this.courier.id,
        status: range,
      });

      this.range = range;
    },
    async save() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;

      const status = this.getStatuses.find(
        (e) => e.id === this.editedItem.status_id
      );
      this.editedItem.status = status.status;
      this.editedItem.color = status.color;
      this.editedItem.icon = status.icon;

      await this.updateStatus({ order: this.editedItem, range: this.range });

      this.loading = false;

      this.close();
    },
  },
};
</script>

<style>
.v-list-item__content {
  padding: 5px 0;
}

.v-list-item {
  min-height: auto;
}
</style>
