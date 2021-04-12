<template>
  <div class="container">
    <div class="row">
      <div class="modal-sign mx-auto">
        <div class="btns" data-toggle="buttons">
          <button
            type="button"
            :disabled="isActiveSignIn"
            :class="[
              isActiveSignIn ? 'btn-secondary btn-block' : 'btn-success ',
            ]"
            class="btn"
            @click.prevent="changeSignBlocks"
          >
            Log In
          </button>
          <button
            type="button"
            :disabled="!isActiveSignIn"
            :class="[
              !isActiveSignIn ? 'btn-secondary btn-block' : 'btn-success ',
            ]"
            class="btn mt-0 ml-2"
            @click.prevent="changeSignBlocks"
          >
            Sign Up
          </button>
        </div>

        <div v-if="isActiveSignIn" class="form-text mb-4">
          Welcome, bro 😉
          <div v-if="isErrorSignIn" class="error-message">
            Invalid login or password
          </div>
        </div>
        <div v-else class="form-text mb-4">
          Let's start 😊
          <div v-if="isErrorSignUp" class="error-message">
            This login already exists
          </div>
        </div>

        <div class="step">
          <form>
            <div class="mb-3">
              <input
                v-model="login"
                type="text"
                class="form-control"
                id="login"
                placeholder="Login"
                @blur="$v.login.$touch()"
                :class="{ 'is-invalid': $v.login.$error }"
              />
              <div v-if="!$v.login.required" class="invalid-feedback">
                Please provide a login
              </div>
              <div v-if="!$v.login.minLength" class="invalid-feedback">
                Minimum length 4 characters
              </div>
              <div v-if="!$v.login.maxLength" class="invalid-feedback">
                Maximum length 12 characters
              </div>
            </div>

            <div class="input-group mb-3">
              <input
                v-model="password"
                :type="[showPassword ? 'text' : 'password']"
                class="form-control"
                placeholder="Password"
                @blur="$v.password.$touch()"
                :class="{ 'is-invalid': $v.password.$error }"
              />
              <div class="input-group-append">
                <span
                  class="input-group-text"
                  @click="showPassword = !showPassword"
                >
                  <i
                    class="fa"
                    :class="[showPassword ? 'fa-eye' : 'fa-eye-slash']"
                    aria-hidden="true"
                  ></i>
                </span>
              </div>
              <div v-if="!$v.password.required" class="invalid-feedback">
                Please provide a password
              </div>
              <div v-if="!$v.password.minLength" class="invalid-feedback">
                Minimum length 6 characters
              </div>
              <div v-if="!$v.password.maxLength" class="invalid-feedback">
                Maximum length 12 characters
              </div>
            </div>

            <template v-if="!isActiveSignIn">
              <div class="input-group mb-3">
                <input
                  v-model="passwordConfirm"
                  :type="[showPassword ? 'text' : 'password']"
                  class="form-control"
                  placeholder="Password confirmation"
                  @blur="$v.passwordConfirm.$touch()"
                  :class="{ 'is-invalid': $v.passwordConfirm.$error }"
                />
                <div class="input-group-append">
                  <span
                    class="input-group-text"
                    @click="showPassword = !showPassword"
                  >
                    <i
                      class="fa"
                      :class="[showPassword ? 'fa-eye' : 'fa-eye-slash']"
                      aria-hidden="true"
                    ></i>
                  </span>
                </div>
                <div v-if="!$v.password.sameAs" class="invalid-feedback">
                  Passwords mismatch
                </div>
              </div>
            </template>
          </form>

          <template v-if="isActiveSignIn">
            <button
              type="submit"
              class="btn btn-primary btn-block mt-4"
              :disabled="disableBtnSignIn"
              @click="signIn"
            >
              Log In
            </button>
          </template>

          <template v-else>
            <div class="mb-4">Remember your login and password 😉</div>
            <button
              type="submit"
              class="btn btn-primary btn-block"
              :disabled="disableBtnSignUp"
              @click="signUp"
            >
              Sign Up
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  required,
  minLength,
  maxLength,
  sameAs,
} from "vuelidate/lib/validators";
import gql from "graphql-tag";
import { onLogin } from "../vue-apollo";

export default {
  data() {
    return {
      isActiveSignIn: true,
      showPassword: false,
      isErrorSignIn: false,
      isErrorSignUp: false,
      login: "",
      loginUpper: "",
      password: "",
      passwordConfirm: "",
      tasks: [],
    };
  },
  computed: {
    disableBtnSignIn() {
      return this.$v.login.$invalid || this.$v.password.$invalid;
    },
    disableBtnSignUp() {
      return (
        this.$v.login.$invalid ||
        this.$v.password.$invalid ||
        this.$v.passwordConfirm.$invalid
      );
    },
  },
  methods: {
    changeSignBlocks() {
      this.isActiveSignIn = !this.isActiveSignIn;
    },
    signIn() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation signIn($authCredentionalInput: AuthCredentionalInput!) {
              signIn(authCredentionalInput: $authCredentionalInput) {
                accessToken
              }
            }
          `,
          variables: {
            authCredentionalInput: {
              nickname: this.login,
              password: this.password,
            },
          },
        })
        .then((data) => {
          onLogin(
            this.$apollo.provider.defaultClient,
            data.data.signIn.accessToken,
            this.loginUpper
          );
          this.$emit("close-signInUp", this.loginUpper);
          window.location.href = "";
        })
        .catch(() => {
          this.isErrorSignIn = true;
          console.log("This data is not curectly");
        });
    },
    signUp() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation signUp($authCredentionalInput: AuthCredentionalInput!) {
              signUp(authCredentionalInput: $authCredentionalInput) {
                id
                nickname
                password
                registDate
              }
            }
          `,
          variables: {
            authCredentionalInput: {
              nickname: this.login,
              password: this.password,
            },
          },
        })
        .then((data) => {
          console.log(data);
          localStorage.setItem("userLogin", this.loginUpper);
          this.$emit("close-signInUp", this.loginUpper);
        })
        .catch(() => {
          this.isErrorSignUp = true;
          console.log("Username is ");
        });
    },
  },
  beforeMount() {
    if (localStorage.apolloToken) {
      localStorage.getItem("apolloToken");
      this.loginUpper = localStorage.getItem("userLogin");
      this.$emit("close-signInUp", this.loginUpper);
    }
  },
  watch: {
    login(newValue) {
      this.loginUpper = newValue.charAt(0).toUpperCase() + newValue.slice(1);
    },
  },
  validations: {
    login: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(12),
    },
    password: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(12),
    },
    passwordConfirm: {
      required,
      sameAs: sameAs("password"),
    },
  },
};
</script>


<style lang="scss" scoped>
.container {
  margin-top: 25vh;
}
.modal-sign {
  width: 350px;
  border: 1px solid #d3d3d3;
  border-radius: 5px;
  background: #fff;
  padding: 30px;
  box-shadow: 0 0 1px 2px #eee;
}

.btns {
  display: flex;
  margin-bottom: 30px;
}

.form-text {
  color: rgba(0, 0, 0, 0.623);
  font-size: 30px;
  font-weight: bold;
}

.error-message {
  margin: 10px 0;
  font-size: 14px;
  font-weight: normal;
  color: red;
}
</style>