import tmp from "./auth.tmpl";
import Block from "../../components/block";
import Field from "../../components/fields/fields";
import Button from "../../components/buttons/button";
import checkField from "../../utils/checkField";
import blurFocusEvents from "../../utils/inputEventsHandler";
import Input from "../../components/inputs/inputs";
import UserController from "../../api/controlers/UserController";
import LoginController from "../../api/controlers/LoginController";
import connect from "../../api/connect-block";
import RouterManager from "../../../index";
import store from "../../api/store";
import Link from "../../components/links/link";

type LoginType = {
  wrapperClass?: string;
  method?: string;
  field1?: Field;
  field2?: Field;
  events?: {};
  link?: Link;
  btnContext?: Button;
  linkText?: string;
};

const loginTemp: LoginType = {
  wrapperClass: "login-wrapper",
  method: "Вход",
  field1: new Field({
    label: "Логин",
    input1: new Input({
      events: blurFocusEvents,
      name: "login",
      type: "text",
    }),
    text: "Неправильный логин",
  }),
  field2: new Field({
    label: "Пароль",
    input1: new Input({
      events: blurFocusEvents,
      name: "password",
      type: "password",
    }),
    text: "Неправильный пароль",
  }),
  btnContext: new Button({
    text: "Войти",
    wrapperClass: "btn btn-secondary",
  }),
  link: new Link({
    class: "link-auth",
    text: "Нет аккаунта?",
    events: {
      click: (e: Event) => {
        e.preventDefault();
        RouterManager.go("/signup");
      },
    },
  }),
};

class LoginP extends Block<LoginType> {
  constructor() {
    super("div", loginTemp);
    CheckLogged();
  }
  render(): HTMLMetaElement {
    const resEl = this.compile(tmp, this.props);
    resEl.querySelector("form")?.addEventListener("submit", (e: any) => {
      e.preventDefault();
      const inputs = e.target.querySelectorAll(".field-input");
      const formData = [...inputs].reduce((res: any, el: HTMLInputElement) => {
        checkField(el);
        res[el.name] = el.value;
        return res;
      }, {});
      LogIn(formData);
      console.log(formData);
    });
    return resEl;
  }
}

async function LogIn(formData: any) {
  await LoginController.logIn({
    data: JSON.stringify(formData),
  });
  UserController.getUser();
  if (store.getState().auth === "OK") RouterManager.go("/chats");
}

async function CheckLogged() {
  try {
    await UserController.getUser();
    console.log(store.getState().user?.id);
    if (store.getState().user?.id) {
      RouterManager.go("/chats");
    }
  } catch (err) {
    console.log(err);
  }
}

const withUser = connect((state) => ({ user: state.user }));
const LoginPC = withUser(LoginP);

export default LoginPC;
