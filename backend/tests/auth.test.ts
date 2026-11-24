import test from "node:test";
import assert from "node:assert/strict";
import { AuthStore } from "../src/auth";

test("auth store initializes with pre-seeded demo user", () => {
  const store = new AuthStore(":memory:");
  const demo = store.getDemoAccount();

  assert.equal(demo.user.email, "demo@mam.edu.vn");
  assert.equal(demo.user.name, "Nguyễn An");
  assert.ok(demo.token.startsWith("mam_token_"));
  assert.equal(demo.user.progress.selectedCourseId, "tran");
  assert.equal(demo.user.progress.xp, 75);
  assert.equal(demo.user.progress.streak, 4);
  assert.ok(demo.user.progress.saved?.includes("tran:0:0"));
});

test("auth store handles registration and duplicate rejection", () => {
  const store = new AuthStore(":memory:");
  const res = store.register("learner@test.com", "pass1234", "Thử Nghiệm");

  assert.equal(res.user.email, "learner@test.com");
  assert.equal(res.user.name, "Thử Nghiệm");
  assert.ok(res.token);

  assert.throws(
    () => store.register("learner@test.com", "anotherpass", "Duplicate"),
    /Email này đã được đăng ký/,
  );
});

test("auth store validates login credentials and sessions", () => {
  const store = new AuthStore(":memory:");
  store.register("student@test.com", "secret123", "Học Sinh");

  const loginRes = store.login("student@test.com", "secret123");
  assert.equal(loginRes.user.name, "Học Sinh");

  assert.throws(
    () => store.login("student@test.com", "wrongpassword"),
    /Email hoặc mật khẩu không chính xác/,
  );

  const me = store.getUserByToken(loginRes.token);
  assert.equal(me?.email, "student@test.com");
});

test("auth store synchronizes user learning progress", () => {
  const store = new AuthStore(":memory:");
  const { token } = store.register("sync@test.com", "pass1234", "Người Học");

  const updated = store.syncProgress(token, {
    xp: 50,
    streak: 2,
    saved: ["space:0:1"],
    selectedCourseId: "space",
  });

  assert.equal(updated.progress.xp, 50);
  assert.equal(updated.progress.streak, 2);
  assert.deepEqual(updated.progress.saved, ["space:0:1"]);
});
