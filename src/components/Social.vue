<template>
  <div class="share-container">
    <div class="share-btn">
      <a class="telegram-btn">
        <ShareNetwork
          network="telegram"
          title="Hello! Create your todo list."
          url="https://vue-todo-list.tk/"
        >
          <i class="fab fa-telegram"></i>
        </ShareNetwork>
      </a>
      <a href="#" class="facebook-btn">
        <ShareNetwork
          network="facebook"
          url="https://vue-todo-list.tk/"
          title="Hello! Create your todo list."
        >
          <i class="fab fa-facebook" />
        </ShareNetwork>
      </a>
      <a href="#" class="linkedin-btn">
        <ShareNetwork
          network="linkedin"
          url="https://vue-todo-list.tk/"
          title="Hello! Create your todo list."
        >
          <i class="fab fa-linkedin"></i>
        </ShareNetwork>
      </a>
      <a href="#" class="whatsapp-btn">
        <ShareNetwork
          network="whatsapp"
          url="https://vue-todo-list.tk/"
          title="Hello! Create your todo list."
        >
          <i class="fab fa-whatsapp"></i>
        </ShareNetwork>
      </a>
      <a href="#" class="twitter-btn">
        <ShareNetwork
          network="twitter"
          url="https://vue-todo-list.tk/"
          title="Hello! Create your todo list."
        >
          <i class="fab fa-twitter"></i>
        </ShareNetwork>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Social",
};
</script>

<style lang="scss" scoped>
.share-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 25%;
  @media (max-width: 500px) {
    width: 100%;
    top: inherit;
    bottom: 0;
    z-index: 103;
  }
  .share-btn {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 9px;
    border-radius: 0 15px 15px 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background: rgb(241, 241, 241);
    @media (max-width: 500px) {
      flex-direction: row;
      padding: 9px 25px 15px 25px;
      border-radius: 15px 15px 0 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      z-index: 104;
    }
    & a {
      margin: 10px 0;
      transition: 0.5s;
    }
    & a:hover {
      transform: scale(1.15);
    }
    & a i {
      font-size: 32px;
      @media (max-width: 500px) {
        font-size: 36px;
      }
    }
    .fa-facebook {
      color: #3b5998;
    }
    .fa-twitter {
      color: #1da1f2;
    }
    .fa-whatsapp {
      color: #25d366;
    }
    .fa-linkedin {
      color: #0077b5;
    }
    .fa-telegram {
      color: #0088cc;
    }
  }
}
</style>