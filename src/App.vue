<template>
  <div id="app">
    <template v-if="isShowModalSignInUp">
      <SignUpInModal @close-signInUp="closeSignInUp" />
    </template>

    <template v-else>
      <Social />
      <TodoList :login="login" />
    </template>

    <footer>
      <div class="block"></div>
      <div class="copyright">
        <span>© 2021 </span>
        <a href="https://digitalidea.studio/" target="_blank"> Digital Idea</a>
      </div>
    </footer>
  </div>
</template>

<script>
import TodoList from "@/components/TodoList";
import Social from "@/components/Social";
import SignUpInModal from "@/components/SignUpInModal";

export default {
  name: "App",
  components: {
    TodoList,
    Social,
    SignUpInModal,
  },
  data() {
    return {
      isShowModalSignInUp: true,
      login: "",
      id: 1,
    };
  },
  methods: {
    closeSignInUp(login) {
      this.isShowModalSignInUp = false;
      this.login = login;
    },
    // showSignModal() {
    //   this.isShowModalSignInUp = true;
    // },
    async decodingUrl() {
      const url = window.location.href.split("?"),
        urlLogin = url[1],
        urlToken = url[2];

      await localStorage.setItem("userLogin", urlLogin);
      await localStorage.setItem("apolloToken", urlToken);
      this.isShowModalSignInUp = false;
    },
  },
  beforeMount() {
    if (window.location.href.length > 25) {
      this.decodingUrl();
    }
  },
};
</script>

<style>
@import url("https://use.fontawesome.com/releases/v5.7.2/css/all.css");

* {
  padding: 0;
  margin: 0;
  border: 0;
  font-family: Arial, sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  height: 1vh;
  background-image: url(https://jkfinancialgroupinc.com/wp-content/uploads/2019/08/office-bg.jpg);
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
}

:focus,
:active {
  outline: none;
}

a:focus,
a:active {
  outline: none;
}

html,
body {
  height: 100%;
  font-size: 100%;
  line-height: 1;
  font-size: 14px;
}

input,
button,
textarea {
  font-family: Arial, sans-serif;
}

button {
  cursor: pointer;
}

footer {
  position: fixed;
  bottom: 10px;
  right: 10px;
}

footer,
footer a {
  color: rgb(0, 0, 0);
  font-size: 12px;
}

.block {
  height: 2rem;
}

@media (max-width: 500px) {
  footer {
    position: relative;
  }

  .copyright {
    position: fixed;
    bottom: 5px;
    right: 35%;
    z-index: 107;
  }

  .block {
    display: block;
  }
}
</style>
