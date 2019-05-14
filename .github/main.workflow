workflow "New workflow" {
  on = "push"
  resolves = [
    "NPM test",
    "GitHub Action for Zeit",
    "NPM lint",
  ]
}

action "NPM install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "NPM test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "test"
  needs = "NPM install"
}

action "Filter only tags" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "tag"
  needs = "NPM test"
}

action "GitHub Action for Zeit" {
  uses = "actions/zeit-now@5c51b26db987d15a0133e4c760924896b4f1512f"
  needs = ["Filter only tags"]
  secrets = ["ZEIT_TOKEN"]
}
