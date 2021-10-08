import normal from "./component/normal.san";
import ts from "./component/ts.san";
import less from "./component/less.san";
import parent from "./component/parent.san";
import klass from "./component/klass.san";
import jsc from "./component/js-comp";
import { mount } from "san-test-utils";

test("normal .san file", () => {
  const wrapper = mount(normal);
  expect(wrapper.data("name")).toEqual("San.js");
});

test("typescript .san file", () => {
  const wrapper = mount(ts);
  expect(wrapper.data("name")).toEqual("San.js");
});

test("less .san file", () => {
  const wrapper = mount(less);
  expect(wrapper.classes()).toContain("green");
});

test("parent.san & child.san exits", () => {
  const wrapper = mount(parent);
  expect(wrapper.isSanInstance()).toBe(true);
});

test("class component .san test", () => {
  const wrapper = mount(klass);
  expect(wrapper.isSanInstance()).toBe(true);
  expect(wrapper.data("name")).toEqual("class component");
});

test(".san exits", () => {
  const wrapper = mount(jsc);
  expect(wrapper.exists()).toBe(true);
});
