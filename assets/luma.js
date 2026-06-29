(() => {
  const header = document.querySelector('[data-luma-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    if (menu) menu.hidden = isOpen;
    document.documentElement.classList.toggle('menu-open', !isOpen);
  });

  menu?.addEventListener('click', (event) => {
    if (event.target === menu || event.target.closest('a')) {
      toggle?.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      document.documentElement.classList.remove('menu-open');
    }
  });

  document.querySelectorAll('[data-product-form]').forEach((form) => {
    const sectionId = form.getAttribute('data-product-form');
    const variantData = document.getElementById(`ProductVariants-${sectionId}`);
    const variants = variantData ? JSON.parse(variantData.textContent) : [];
    const selects = Array.from(form.querySelectorAll('[data-option-position]'));
    const variantInput = form.querySelector('[data-variant-id]');
    const submit = form.querySelector('[data-product-submit]');

    const updateVariant = () => {
      const selectedOptions = selects.map((select) => select.value);
      const variant = variants.find((candidate) => {
        return selectedOptions.every((value, index) => candidate.options[index] === value);
      });

      if (!variant || !variantInput || !submit) return;

      variantInput.value = variant.id;
      submit.disabled = !variant.available;
      submit.textContent = variant.available ? 'Add to bag' : 'Sold out';
    };

    selects.forEach((select) => select.addEventListener('change', updateVariant));
  });
})();
