const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const test = require("node:test");
const ts = require("typescript");
const source = ts.transpileModule(fs.readFileSync("src/lib/vexui-settings.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function load(saved, blocked = false, server = false) {
  let stored = saved;
  const root = { dir: "", dataset: {}, classList: { toggle() {} } };
  const context = {
    exports: {},
    require: () => ({ useEffect() {}, useSyncExternalStore() {} }),
    ...(!server && {
      document: { documentElement: root },
      window: {
        localStorage: {
          getItem: () => stored,
          setItem: (_, value) => {
            if (blocked) throw Error("Storage blocked");
            stored = value;
          },
        },
        matchMedia: () => ({ matches: false }),
      },
    }),
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  return { settings: context.exports, root, context, stored: () => stored };
}
test("direction updates immediately, persists, reloads, and resets", () => {
  const app = load(null);
  assert.equal(app.settings.getSettings().direction, "ltr");
  app.settings.setSettings({ direction: "rtl" });
  assert.equal(app.root.dir, "rtl");
  assert.equal(JSON.parse(app.stored()).direction, "rtl");
  assert.equal(load(app.stored()).settings.getSettings().direction, "rtl");
  app.settings.setSettings({ mode: "dark" });
  assert.equal(app.root.dir, "rtl");
  app.settings.resetSettings();
  assert.equal(app.root.dir, "ltr");
  assert.equal(JSON.parse(app.stored()).direction, "ltr");
});
test("legacy, invalid, and malformed saved settings fall back to LTR", () => {
  for (const saved of ["{}", '{"direction":"invalid"}', "{", "null"]) {
    assert.equal(load(saved).settings.getSettings().direction, "ltr");
  }
});
test("bootstrap applies saved RTL before hydration", () => {
  for (const direction of ["rtl", "ltr"]) {
    const app = load(JSON.stringify({ direction }));
    vm.runInContext(app.settings.themeBootstrapScript, app.context);
    assert.equal(app.root.dir, direction);
  }
});
test("blocked storage still allows switching and resetting", () => {
  const app = load(null, true);
  app.settings.setSettings({ direction: "rtl" });
  assert.equal(app.root.dir, "rtl");
  app.settings.resetSettings();
  assert.equal(app.root.dir, "ltr");
});
test("settings are safe to read and update during server rendering", () => {
  const app = load(null, false, true);
  assert.equal(app.settings.getSettings().direction, "ltr");
  assert.doesNotThrow(() => app.settings.setSettings({ direction: "rtl" }));
});
