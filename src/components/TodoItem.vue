<template>
  <div>
    <div class="task" :class="{ checked: todo.checked }">
      <a @click="checkTask"></a>
      <span v-if="!editing" @click="editableTask">{{ todo.todo }}</span>
      <input
        class="input-editing"
        v-else
        type="text"
        v-model="todo.todo"
        @blur="doneEdit"
        @keyup.enter="doneEdit"
        @keyup.esc="doneEdit"
      />
      <button class="close-image" @click="openModal">
        <img
          src="https://icons-for-free.com/iconfiles/png/512/delete+remove+trash+trash+bin+trash+can+icon-1320073117929397588.png"
        />
      </button>
    </div>
    <Modal
      v-if="showModal"
      :todo="todo"
      @remove-task="removeTask"
      @close-modal="closeModal"
    />
  </div>
</template>

<script>
import Modal from "@/components/Modal";
import gql from "graphql-tag";

export default {
  name: "TodoItem",
  props: {
    todo: Object,
    index: Number,
  },
  data() {
    return {
      showModal: false,
      editing: false,
      disableDraggable: true,
    };
  },
  components: {
    Modal,
  },
  computed: {
    findContainer() {
      if (this.todo.checked === true) {
        return "complete";
      } else {
        return "need";
      }
    },
  },
  methods: {
    openModal() {
      this.$emit("disable-drag");
      this.showModal = true;
    },
    checkTask() {
      this.todo.checked = !this.todo.checked;
      this.$emit("check-task", this.index, this.findContainer);
    },
    editableTask() {
      if (this.findContainer === "need") {
        this.editing = true;
      } else {
        return;
      }
    },
    doneEdit() {
      this.editing = false;

      this.$apollo
        .mutate({
          mutation: gql`
            mutation editTask($id: String!, $todo: String!) {
              editTask(id: $id, todo: $todo) {
                id
                todo
                checked
              }
            }
          `,
          variables: {
            id: this.todo.id,
            todo: this.todo.todo,
          },
        })
        .catch((error) => {
          const { message } = error;

          if (message === "GraphQL error: Unauthorized") {
            localStorage.clear();
            window.location.href = "";
          }
        });
    },
    removeTask() {
      this.showModal = false;
      this.$emit("remove-task", this.index, this.findContainer);
    },
    closeModal() {
      this.showModal = false;
      this.$emit("enable-drag");
    },
  },
  watch: {
    showModal: function () {
      if (this.isModalVisible) {
        document.body.style.overflow = "hidden";
        return;
      }
      document.body.style.overflow = "auto";
    },
  },
};
</script>

<style lang="scss" scoped>
.task {
  display: grid;
  grid-template-columns: 40px auto 30px;
  grid-gap: 15px;
  justify-items: baseline;
  align-items: center;
  padding: 5px;
  margin-bottom: 5px;
  cursor: move;
  @media (max-width: 500px) {
    display: grid;
    grid-template-columns: 30px auto 23px;
    grid-gap: 10px;
  }
  &.checked {
    text-decoration: line-through;
    &.checked a {
      background: #7fffd4;
      border: 1px solid #6cdcb6;
      &.checked a:hover {
        background: none;
        @media (max-width: 500px) {
          background: #7fffd4;
        }
      }
    }
  }
  a {
    width: 27px;
    height: 27px;
    border: 1px solid #7fffd4;
    border-radius: 50%;
    cursor: pointer;
    @media (max-width: 500px) {
      width: 24px;
      height: 24px;
    }
    &:hover {
      background: #7fffd450;
      transition: all 0.3s ease;
      @media (max-width: 500px) {
        background: none;
      }
    }
  }
  .input-editing {
    min-width: 100%;
    font-size: 18px;
    border: 1px solid #d3d3d3;
    color: #2c3e50;
    background-color: rgb(247, 247, 247);
  }
  .close-image img {
    display: block;
    height: 25px;
    width: 24px;
    background-color: rgb(247, 247, 247);
    pointer-events: none;
    @media (max-width: 500px) {
      width: 21px;
      height: 22px;
    }
  }
}
</style>