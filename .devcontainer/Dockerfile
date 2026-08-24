FROM mcr.microsoft.com/devcontainers/base:ubuntu

# non-interactive apt operations
ARG DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# ---------------------------------------------------------------------------
# base runtime packages
# ---------------------------------------------------------------------------
# bubblewrap setuid required for namespace sandboxes on restricted hosts.
RUN apt-get update && \
  apt-get install -y --no-install-recommends ca-certificates bubblewrap libcap2-bin && \
  bwrap_path="$(command -v bwrap)" && \
  chown root:root "$bwrap_path" && chmod 4755 "$bwrap_path" && \
  rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------------------------
# linuxbrew + tools + claude-code
# ---------------------------------------------------------------------------
RUN mkdir -p /home/linuxbrew/.linuxbrew && chown -R vscode:vscode /home/linuxbrew
ENV NONINTERACTIVE=1
USER vscode
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" \
  && /home/linuxbrew/.linuxbrew/bin/brew --version \
  && echo >> /home/vscode/.bashrc \
  && echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv bash)"' >> /home/vscode/.bashrc \
  && eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv bash)" \
  && /home/linuxbrew/.linuxbrew/bin/brew install node wget curl jq gnupg git-secret socat yq gh 1password-cli claude-code
USER root

# ---------------------------------------------------------------------------
# sandbox-runtime
# ---------------------------------------------------------------------------
RUN set -eux; \
  export PATH="/home/linuxbrew/.linuxbrew/bin:$PATH"; \
  npm install -g @anthropic-ai/sandbox-runtime; \
  npm cache clean --force; \
  mkdir -p /usr/local/share/sandbox-runtime/seccomp; \
  npm_root="$(npm root -g)"; \
  src="$npm_root/@anthropic-ai/sandbox-runtime/vendor/seccomp"; \
  test -d "$src"; \
  cp -a "$src/." /usr/local/share/sandbox-runtime/seccomp/; \
  chmod -R a+rX /usr/local/share/sandbox-runtime/seccomp;

# ---------------------------------------------------------------------------
# editor / browser
# ---------------------------------------------------------------------------
ENV EDITOR="code --wait"
ENV BROWSER=code

# ---------------------------------------------------------------------------
# gnupg home
# ---------------------------------------------------------------------------
ENV GNUPGHOME=/home/vscode/.gnupg-container

COPY --chmod=755 postStartCommand.sh /usr/local/bin/postStartCommand.sh
