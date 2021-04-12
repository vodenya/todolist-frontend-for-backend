<template>
  <div class="delete-modal-overlay">
    <div class="delete-modal">
      <div>
        <slot name="data-modal">
          Are you sure you want to delete task
          <span v-if="todo" :class="{ checked: todo.checked }"
            >"{{ todo.todo }}"</span
          >?
        </slot>
      </div>
      <div class="buttons" :class="{ gap: todo }">
        <slot name="data-modal-btn">
          <button class="modal-btn" @click="yesButton">Yes</button>
          <button class="modal-btn" @click="noButton">No</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
  props: {
    todo: Object,
  },
  methods: {
    noButton() {
      this.$emit("close-modal");
    },
    yesButton() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation deleteTask($id: String!) {
              deleteTask(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: this.todo.id,
          },
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          const { message } = error;

          if (message === "GraphQL error: Unauthorized") {
            localStorage.clear();
            window.location.href = "";
          }
        });
      this.$emit("remove-task");
    },
  },
};
</script>

<style lang="scss" scoped>
.delete-modal-overlay {
  background: rgba(0, 0, 0, 0.35);
  z-index: 100;
  position: absolute;
  border-radius: 5px;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  @media (max-width: 500px) {
    border-radius: 12px;
  }
  .delete-modal {
    position: absolute;
    border: 1px solid #d3d3d3;
    border-radius: 5px;
    background: #fff;
    padding: 30px;
    display: grid;
    grid-template-rows: auto min-content;
    -webkit-box-shadow: 0 0 1px 2px #eee;
    box-shadow: 0 0 1px 2px #eee;
    left: 22%;
    right: 22%;
    top: 37%;
    z-index: 101;
    @media (max-width: 500px) {
      left: 10%;
      right: 10%;
      top: 25%;
      font-size: 14px;
      line-height: 1.5;
    }
    .buttons {
      margin-top: 20px;
      display: grid;
      grid-template-columns: min-content min-content;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      button {
        padding: 5px;
        border: 1px solid #d3d3d3;
        border-radius: 2px;
        width: 50px;
        font-size: 16px;
        cursor: pointer;
      }
      .modal-btn {
        justify-self: center;
        padding: 5px;
        border: 1px solid #d3d3d3;
        border-radius: 2px;
        width: 120px;
        font-size: 16px;
        cursor: pointer;
        @media (max-width: 500px) {
          width: 80px;
        }
      }
    }
    .gap {
      grid-gap: 20px;
    }
  }
  .checked {
    text-decoration: line-through;
  }
}
</style>