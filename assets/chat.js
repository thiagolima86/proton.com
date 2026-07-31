(() => {
  const root = document.getElementById("proton-chat");
  if (!root) return;

  const endpoint = root.dataset.chatEndpoint;
  const whatsappUrl = root.dataset.chatWhatsapp || "https://exemplo.invalid/whatsapp";
  if (!endpoint) return;

  const toggle = root.querySelector("[data-chat-toggle]");
  const panel = root.querySelector("[data-chat-panel]");
  const backdrop = root.querySelector("[data-chat-backdrop]");
  const closeBtn = root.querySelector("[data-chat-close]");
  const form = root.querySelector("[data-chat-form]");
  const input = root.querySelector("[data-chat-input]");
  const messagesEl = root.querySelector("[data-chat-messages]");
  const statusEl = root.querySelector("[data-chat-status]");
  const fallbackEl = root.querySelector("[data-chat-fallback]");
  const whatsappLink = root.querySelector("[data-chat-whatsapp-link]");
  const sendBtn = root.querySelector("[data-chat-send]");

  if (!toggle || !panel || !form || !input || !messagesEl) return;

  if (whatsappLink) whatsappLink.href = whatsappUrl;

  const SESSION_KEY = "proton_chat_session_id";
  const HISTORY_KEY = "proton_chat_history";
  const MAX_HISTORY = 20;

  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  let history = loadHistory();

  let isOpen = false;
  let isLoading = false;
  let hasWelcomed = history.length > 0;

  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(-MAX_HISTORY) : [];
    } catch {
      return [];
    }
  }

  function saveHistory() {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
  }

  function renderHistory() {
    messagesEl.replaceChildren();
    for (const turn of history) {
      appendMessage(turn.role, turn.content, false);
    }
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function setOpen(open) {
    isOpen = open;
    panel.classList.toggle("hidden", !open);
    if (backdrop) backdrop.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", String(open));

    if (open) {
      document.body.classList.add("chat-panel-open");
      if (!hasWelcomed) {
        appendMessage(
          "assistant",
          "Olá! Posso ajudar com dúvidas sobre planos, teste de 7 dias e o que o Proton faz. Como posso ajudar?",
          false
        );
        hasWelcomed = true;
      }
      input.focus();
    } else {
      document.body.classList.remove("chat-panel-open");
      toggle.focus();
    }
  }

  function appendMessage(role, text, persist) {
    const item = document.createElement("div");
    item.className =
      role === "user"
        ? "ml-8 rounded-xl rounded-br-sm bg-proton-navy px-3 py-2 text-sm text-white"
        : "mr-8 rounded-xl rounded-bl-sm bg-slate-100 px-3 py-2 text-sm text-slate-800";
    item.textContent = text;
    messagesEl.appendChild(item);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    if (persist) {
      history.push({ role, content: text });
      if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);
      saveHistory();
    }
  }

  function showFallback(show) {
    if (!fallbackEl) return;
    fallbackEl.classList.toggle("hidden", !show);
  }

  function setLoading(loading) {
    isLoading = loading;
    if (sendBtn) sendBtn.disabled = loading;
    input.disabled = loading;
    setStatus(loading ? "Enviando mensagem…" : "");
  }

  async function sendMessage(text) {
    if (isLoading || !text.trim()) return;

    const trimmed = text.trim();
    input.value = "";
    appendMessage("user", trimmed, false);
    showFallback(false);
    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          session_id: sessionId,
          page: window.location.pathname + window.location.hash,
          history,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data.reply) throw new Error("Resposta inválida");

      appendMessage("assistant", data.reply, false);
      history.push({ role: "user", content: trimmed });
      history.push({ role: "assistant", content: data.reply });
      if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);
      saveHistory();

      showFallback(Boolean(data.fallback_whatsapp));
      setStatus("Nova resposta recebida.");
    } catch {
      appendMessage(
        "assistant",
        "Não consegui responder agora. Tente de novo ou fale conosco no WhatsApp.",
        false
      );
      showFallback(true);
      setStatus("Erro ao enviar mensagem.");
    } finally {
      setLoading(false);
      input.focus();
    }
  }

  if (history.length > 0) renderHistory();

  toggle.addEventListener("click", () => setOpen(!isOpen));
  if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));
  if (backdrop) backdrop.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      setOpen(false);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });
})();
