<template>
  <div class="container">
    <div class="tasks">
      <div class="header-container">
        <button class="share-btn-url" @click="shortenLinkBitly">
          <i class="fa fa-share-alt"></i>
          Share list
        </button>
        <h2>
          <span class="red">{{ login }}</span
          >'s task list
        </h2>
        <button class="delete-button" @click="deleteAll">Delete all</button>
      </div>

      <Modal v-if="isShareModal">
        <template v-slot:data-modal>
          <div class="url-link-wrap">
            <span class="url-link">{{ shareUrl }}</span>
          </div>
        </template>
        <template v-slot:data-modal-btn>
          <button class="modal-btn" @click="copyUrl">Copy link</button>
        </template>
      </Modal>

      <div class="message">
        <div>{{ messageStatus }}</div>
      </div>

      <div class="unchecked-container">
        <draggable
          v-model="todoList"
          v-bind="dragOptions"
          :move="onMove"
          @start="isDragging = true"
          @end="isDragging = false"
        >
          <transition-group type="transition" name="flip-list">
            <TodoItem
              :todo="todo"
              :index="index"
              @disable-drag="disableDraggable = true"
              @enable-drag="disableDraggable = false"
              @check-task="checkTask"
              @remove-task="removeTodo"
              v-for="(todo, index) in todoList"
              :key="index"
            />
          </transition-group>
        </draggable>
      </div>

      <form class="add-task" method="POST" @submit.prevent="addTodo">
        <input
          type="text"
          class="new-task"
          placeholder="New task..."
          v-model="valueInput"
        />
      </form>

      <template v-if="!availabilityData">
        <Summary
          :todoArrLength="todoList.length"
          :completedArrLength="completedList.length"
        />
      </template>

      <div class="checked-container checked">
        <draggable
          v-model="completedList"
          v-bind="dragOptions"
          :move="onMove"
          @start="isDragging = true"
          @end="isDragging = false"
        >
          <transition-group type="transition" name="flip-list">
            <TodoItem
              class="checked"
              :todo="todo"
              :index="index"
              @disable-drag="disableDraggable = true"
              @enable-drag="disableDraggable = false"
              @check-task="checkTask"
              @remove-task="removeTodo"
              v-for="(todo, index) in completedList"
              :key="index"
            />
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import TodoItem from "@/components/TodoItem";
import Modal from "@/components/Modal";
import Summary from "@/components/Summary";
import draggable from "vuedraggable";
import gql from "graphql-tag";

export default {
  name: "TodoList",
  props: {
    login: String,
  },
  data() {
    return {
      valueInput: "",
      todoList: [],
      completedList: [],
      isDragging: false,
      delayedDragging: false,
      isShareModal: false,
      shareUrl: "",
      bitlyUrl: "",
      disableDraggable: false,
      pako: require("pako"),
    };
  },
  components: {
    TodoItem,
    Modal,
    Summary,
    draggable,
  },
  computed: {
    messageStatus() {
      if (this.todoList.length === 0 && this.completedList.length === 0) {
        return "You don't have tasks to do.";
      }
      if (this.todoList.length === 0) {
        return "🎊 All done!";
      }
      return "";
    },
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        ghostClass: "ghost",
        disabled: this.disableDraggable,
      };
    },
    availabilityData() {
      return this.completedList.length === 0 && this.todoList.length === 0;
    },
  },
  methods: {
    addTodo() {
      if (this.valueInput !== "") {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation createTask($createTaskInput: CreateTaskInput!) {
                createTask(createTaskInput: $createTaskInput) {
                  id
                  todo
                  order
                  checked
                }
              }
            `,
            variables: {
              createTaskInput: {
                todo: this.valueInput,
              },
            },
          })
          .then((data) => {
            console.log("CREATE_TASK:", data.data.createTask);
            this.todoList.push(data.data.createTask);
            console.log(this.todoList);
          })
          .catch((error) => {
            const { message } = error;

            if (message === "GraphQL error: Unauthorized") {
              localStorage.clear();
              window.location.href = "";
            }
          });
      }
      this.valueInput = "";
    },
    checkTask(index, type) {
      this.disableDraggable = true;
      let todo = null;

      if (type === "complete") {
        todo = this.todoList.splice(index, 1);
        this.completedList.unshift(...todo);
      } else {
        todo = this.completedList.splice(index, 1);
        this.todoList.push(...todo);
      }
      this.disableDraggable = false;

      // Backend request
      this.$apollo
        .mutate({
          mutation: gql`
            mutation updateTaskStatus($id: String!, $checked: Boolean!) {
              updateTaskStatus(id: $id, checked: $checked) {
                id
                todo
                checked
                order
              }
            }
          `,
          variables: {
            id: todo[0].id,
            checked: todo[0].checked,
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
    removeTodo(index, type) {
      const todoList = type === "need" ? this.todoList : this.completedList;
      todoList.splice(index, 1);
      this.disableDraggable = false;
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;

      if (relatedElement.checked === true) {
        draggedElement.checked = true;
      } else {
        draggedElement.checked = false;
      }
      
      console.log(draggedElement.checked);

      this.$apollo
        .mutate({
          mutation: gql`
            mutation updateTaskStatus($id: String!, $checked: Boolean!) {
              updateTaskStatus(id: $id, checked: $checked) {
                id
                todo
                checked
                order
              }
            }
          `,
          variables: {
            id: draggedElement.id,
            checked: draggedElement.checked,
          },
        })
    },
    deleteAll() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation {
              deleteTasks
            }
          `,
        })
        .catch((error) => {
          const { message } = error;

          if (message === "GraphQL error: Unauthorized") {
            localStorage.clear();
            window.location.href = "";
          }
        });
      this.completedList = [];
      this.todoList = [];
    },
    async shortenLinkBitly() {
      const token = localStorage.getItem("apolloToken");
      const login = localStorage.getItem("userLogin");
      this.shareUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${login}?${token}`;

      // this.bitlyUrl = await fetch("https://api-ssl.bitly.com/v4/shorten", {
      //   method: "POST",
      //   headers: {
      //     Authorization: "Bearer 0116f9485f9469fe475c9cfc2e3f714469bdc138",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     long_url: this.shareUrl,
      //     domain: "bit.ly",
      //     group_guid: "Bl21i4gGSVh",
      //   }),
      // })
      //   .then((response) => response.json())
      //   .then((json) => json.id);

      this.isShareModal = true;
    },
    copyUrl() {
      navigator.clipboard.writeText(this.shareUrl);
      this.isShareModal = false;
    },
    async getTasks() {
      this.$apollo
        .query({
          query: gql`
            query {
              tasks {
                id
                todo
                checked
                order
              }
            }
          `,
        })
        .then((data) => {
          data.data.tasks.forEach((item) => {
            if (item.checked == true) {
              this.completedList.unshift(item);
            } else {
              this.todoList.push(item);
            }
          });
        })
        .catch((error) => {
          const { message } = error;

          if (message === "GraphQL error: Unauthorized") {
            localStorage.clear();
            window.location.href = "";
          }
        });
    },
  },
  mounted() {
    this.getTasks();
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  margin: 60px auto 80px auto;

  font-size: 18px;
  color: #2c3e50;
  width: 60%;
  border-radius: 5px;
  background-color: rgb(247, 247, 247);
  @media (max-width: 500px) {
    width: 100%;
    margin-top: 15%;
    margin-bottom: 110px;
    border-radius: 12px;
    font-size: 16px;
  }
  .tasks {
    padding: 18px;
    .sortable-drag {
      opacity: 0;
    }
    .header-container {
      display: grid;
      grid-template-columns: 120px auto 120px;
      justify-items: center;
      align-items: center;
      padding: 0 20px;
      @media (max-width: 500px) {
        grid-template-columns: 100px auto 100px;
        margin-bottom: 5px;
        padding: 0;
      }
      .share-btn-url {
        color: #2c3e50c5;
        background-color: rgb(247, 247, 247);
        border: none;
        font-size: 20px;
        transition: 0.5s;
        @media (max-width: 500px) {
          font-size: 18px;
          justify-self: start;
          grid-column: 1 / 3;
        }
      }
      .share-btn-url:hover {
        color: #00ffaa;
        transform: scale(1.1);
      }
      h2 {
        display: block;
        text-align: center;
        font-size: 1.5em;
        color: rgb(58, 58, 58);
        margin-block-start: 0.83em;
        margin-block-end: 0.83em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-weight: bold;
        @media (max-width: 500px) {
          white-space: pre-wrap;
          margin-block-end: 0.6em;
          font-size: 28px;
          grid-column: 1 / 4;
          order: -1;
        }
      }
      .red {
        color: rgb(180, 40, 40);
      }
      .delete-button {
        width: 100px;
        padding: 3px;
        font-size: 18px;
        border-radius: 5px;
        border: 1px solid #ff927fc9;
        color: rgb(134, 134, 134);
        background-color: rgb(247, 247, 247);
        transition: all 0.3s ease;
        @media (max-width: 500px) {
          width: 80px;
          padding: 2px;
          font-size: 15px;
          justify-self: end;
        }
      }
      .delete-button:hover {
        background: #ff927fc4;
        color: #fff;
        transform: scale(1.1);
      }
    }
    .url-link-wrap {
      overflow: hidden;
      width: 28vw;
      @media (max-width: 500px) {
        width: 65vw;
      }
      .url-link {
        justify-self: center;
        margin-bottom: 20px;
        font-size: 16px;
      }
    }
    .modal-btn {
      justify-self: center;
      padding: 5px;
      border: 1px solid #d3d3d3;
      border-radius: 2px;
      width: 120px;
      font-size: 16px;
      cursor: pointer;
    }
    .message {
      padding: 20px;
      display: grid;
      justify-items: center;
      align-items: center;
      line-height: 30px;
      color: grey;
      font-weight: 700;
      @media (max-width: 500px) {
        padding: 10px 0 15px 0;
      }
    }
    .add-task {
      display: grid;
      grid-template-columns: auto;
      @media (max-width: 500px) {
        display: grid;
        grid-template-columns: auto;
      }
      .new-task {
        width: calc(100% - 100px);
        font-size: 18px;
        margin-top: 14px;
        margin-left: 55px;
        padding: 1px 5px;
        border: none;
        border-bottom: 1px dashed #d3d3d3;
        color: #2c3e50;
        background-color: rgb(247, 247, 247);
        @media (max-width: 500px) {
          width: calc(100% - 40px);
          font-size: 16px;
          margin-left: 20px;
        }
      }
    }
    .ghost {
      background-color: rgb(238, 238, 238);
      box-shadow: 5px 5px 5px -1px rgb(0, 0, 0, 0.14);
    }
    .flip-list-move {
      transition: transform 0.5s;
    }

    .no-move {
      transition: transform 0s;
    }
  }
}
</style>