import test from "node:test";
import assert from "node:assert/strict";
import { completeLogin } from "../src/features/auth/loginPolicy.js";
import { LOGIN_FAILURE_MESSAGE, loginErrorMessage, authServiceErrorMessage } from "../src/lib/authMessages.js";

function clientFor(actor, error = "") {
  let snapshot = { actor, error };
  return {
    getSnapshot: () => snapshot,
    logout: () => {
      snapshot = { actor: null, error: "" };
    },
  };
}

test("all internal roles require internal login, including accounts with user plans", () => {
  for (const role of [
    "ADMIN",
    "GAME_EDITOR",
    "GAME_REVIEWER",
    "GAME_MANAGER",
  ]) {
    const actor = { roles: [role], plans: ["PARENT"], role: "parent" };
    const allowed = clientFor(actor);
    assert.equal(completeLogin(allowed, true), "/internal");
    assert.equal(allowed.getSnapshot().actor, actor);
    const denied = clientFor(actor);
    assert.throws(() => completeLogin(denied, false), { message: LOGIN_FAILURE_MESSAGE });
    assert.equal(denied.getSnapshot().actor, null);
  }
});

test("normal users and children require public login; wrong portal clears session", () => {
  for (const role of ["guest", "parent", "teacher", "kid"]) {
    const actor = { role, roles: role === "kid" ? ["CHILD"] : [] };
    const allowed = clientFor(actor);
    assert.equal(
      completeLogin(allowed, false),
      role === "kid" ? "/dashboard/kid" : "/dashboard",
    );
    assert.equal(allowed.getSnapshot().actor, actor);
    const denied = clientFor(actor);
    assert.throws(
      () => completeLogin(denied, true),
      { message: LOGIN_FAILURE_MESSAGE },
    );
    assert.equal(denied.getSnapshot().actor, null);
  }
});

test("profile load failure clears session and never navigates", () => {
  const client = clientFor(null, "Profile unavailable");
  assert.throws(() => completeLogin(client, true), { message: LOGIN_FAILURE_MESSAGE });
  assert.equal(client.getSnapshot().actor, null);
});

test("login failures never disclose account existence, account roles or server-provided URLs", () => {
  for (const message of [
    "Tài khoản nội bộ phải đăng nhập tại /internal/login.",
    "Tài khoản không tồn tại.",
    "Sai mật khẩu.",
    "Email chưa được xác minh.",
    "Email này đã đăng ký bằng mật khẩu.",
    "Truy cập https://internal.example.com để tiếp tục.",
  ]) {
    for (const code of [3002, 3004, 3007, 3011, 3016, 3020, 9999]) {
      assert.equal(loginErrorMessage({ message, code, status: 401 }), LOGIN_FAILURE_MESSAGE);
      assert.equal(authServiceErrorMessage({ message, code, status: 401 }), null);
    }
  }
  assert.match(loginErrorMessage({ status: 0 }), /kiểm tra mạng/);
  assert.match(loginErrorMessage({ status: 429 }), /quá nhiều yêu cầu/);
  assert.match(loginErrorMessage({ status: 503 }), /tạm thời không khả dụng/);
});
