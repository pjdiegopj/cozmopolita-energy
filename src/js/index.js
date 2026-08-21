/**
 * Cozmopolita Energy - Interatividade e Animações
 */

document.addEventListener('DOMContentLoaded', () => {
  // Observador de Scroll para animação Reveal
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Uma vez animado, não precisa observar novamente
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Botões de Copiar Chave (PIX / Lightning)
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy-target');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback para contextos não-seguros ou navegadores legados
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
