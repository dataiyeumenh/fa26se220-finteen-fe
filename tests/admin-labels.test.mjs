import test from "node:test";
import assert from "node:assert/strict";
import {
  adminRoleLabel,
  entitlementSourceLabel,
  learnerStatusLabel,
  planClassName,
  planLabel,
  providerLabel,
  transactionStatusLabel,
} from "../src/pages/Admin/Dashboard/adminLabels.js";

test("admin values keep API codes but show Vietnamese labels", () => {
  assert.equal(adminRoleLabel("GAME_REVIEWER"), "Kiểm duyệt viên");
  assert.equal(planLabel("TEACHER"), "Giáo viên");
  assert.equal(planClassName("PARENT"), "plan-parent");
  assert.equal(planClassName("TEACHER"), "plan-teacher");
  assert.equal(transactionStatusLabel("PAID"), "Đã thanh toán");
  assert.equal(learnerStatusLabel("ARCHIVED"), "Đã lưu trữ");
  assert.equal(entitlementSourceLabel("PAYMENT"), "Thanh toán");
  assert.equal(providerLabel("password"), "Email và mật khẩu");
});

test("unknown server values remain visible for diagnosis", () => {
  assert.equal(adminRoleLabel("NEW_ROLE"), "NEW_ROLE");
});
