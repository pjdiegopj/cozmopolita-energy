/**
 * Cozmopolita Energy - Interatividade e Animações
 */

document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  let deferredPrompt = null;

  const installButton = document.createElement('button');
  installButton.type = 'button';
  installButton.textContent = 'Instalar app';
  installButton.setAttribute('aria-label', 'Instalar app');
  installButton.style.position = 'fixed';
  installButton.style.right = '16px';
  installButton.style.bottom = '16px';
  installButton.style.zIndex = '9999';
  installButton.style.display = 'none';
  installButton.style.border = 'none';
  installButton.style.borderRadius = '999px';
  installButton.style.padding = '12px 18px';
  installButton.style.background = '#5dade2';
  installButton.style.color = '#06131b';
  installButton.style.fontWeight = '700';
  installButton.style.cursor = 'pointer';
  installButton.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      console.log('Usuário aceitou instalar o app');
    }

    deferredPrompt = null;
    installButton.style.display = 'none';
  });

  document.body.appendChild(installButton);

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.style.display = 'block';
  });

  window.addEventListener('appinstalled', () => {
    installButton.style.display = 'none';
  });

  if (window.matchMedia('(display-mode: standalone)').matches) {
    installButton.style.display = 'none';
  }

  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy-target');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const tempInput = document.createElement('textarea');
          tempInput.value = textToCopy;
          tempInput.style.position = 'fixed';
          tempInput.style.left = '-9999px';
          tempInput.style.top = '-9999px';
          document.body.appendChild(tempInput);
          tempInput.focus();
          tempInput.select();
          document.execCommand('copy');
          tempInput.remove();
        }

        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined">check</span><span class="copy-label">Copiado!</span>';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove('copied');
        }, 2200);
      } catch (err) {
        console.error('Falha ao copiar:', err);
      }
    });
  });
});
