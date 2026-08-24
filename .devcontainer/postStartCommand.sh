#!/usr/bin/env bash
set -euo pipefail

# postStartCommand for the devcontainer.
# - run npm install if package.json exists at the project root
# - optionally bootstrap a dotfiles repo if DOTFILES_GIT_URL is provided
# - optionally bring up Tailscale when an auth key is injected

log() { echo "postStartCommand: [$1] ${*:2}" >&2; }

run_npm_install() {
  [ -f package.json ] || return
  command -v npm >/dev/null || return
  log INFO "running npm install"
  # --ignore-scripts: prevent arbitrary code execution from malicious package.json at startup
  npm install --ignore-scripts || log WARN "npm install failed"
}

bootstrap_dotfiles() {
  local url="${DOTFILES_GIT_URL:-}"
  [ -z "$url" ] && return

  command -v npx >/dev/null || { log WARN "npx not available, skipping bootstrap"; return; }

  # strip .git suffix
  url="${url%.git}"
  log INFO "bootstrapping dotfiles from $url"
  npm_config_allow_git=root npx --yes "$url" || log WARN "npx bootstrap failed"
}

setup_tailscale() {
  local key="${TAILSCALE_AUTHKEY:-}"
  [ -z "$key" ] && return
  command -v tailscale >/dev/null || { log WARN "tailscale not in PATH"; return; }

  log INFO "bringing up Tailscale"
  sudo tailscale up --accept-routes --authkey "$key" --advertise-tags tag:devcontainer \
    || log WARN "tailscale up failed"
}

main() {
  run_npm_install
  bootstrap_dotfiles
  setup_tailscale
}

main
