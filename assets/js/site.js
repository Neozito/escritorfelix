/* Landing page Félix Augusto Pazuch - HTML/CSS/JS puro, sem frameworks */
(() => {
  'use strict';
  const WHATSAPP_SHORT_LINK = 'https://wa.me/message/CO7FMBPQRCO2O1';
  // Opcional: adicione aqui o número comercial do autor, com DDI e DDD, somente dígitos.
  // Ex.: '5545999999999'. Com o número configurado, o formulário já abre com o texto preenchido.
  const WHATSAPP_NUMBER = '';

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#nav');
  if (menuButton && nav) {
    const closeMenu = () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Abrir menu'); };
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if(event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => { if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
  }

  document.querySelector('#year').textContent = String(new Date().getFullYear());
  const form = document.querySelector('#contactForm');
  const status = document.querySelector('#formStatus');
  const phone = document.querySelector('#telefone');
  phone.addEventListener('input', () => {
    let digits = phone.value.replace(/\D/g, '').slice(0,11);
    if (!digits) { phone.value = ''; return; }
    if (digits.length >= 3) digits = '(' + digits.slice(0,2) + ') ' + digits.slice(2);
    if (digits.length > 10) digits = digits.slice(0,10) + '-' + digits.slice(10);
    phone.value = digits;
  });
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => { el.removeAttribute('aria-invalid'); if(status.classList.contains('error')) status.textContent = ''; });
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const name = form.nome.value.trim();
    const telephone = phone.value.replace(/\D/g,'');
    const email = form.email.value.trim();
    const message = form.mensagem.value.trim();
    let invalid = null;
    if(name.length < 2) invalid = form.nome;
    else if(telephone.length < 10 || telephone.length > 11) invalid = phone;
    else if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid = form.email;
    else if(message.length < 5) invalid = form.mensagem;
    if(invalid){ invalid.setAttribute('aria-invalid','true'); invalid.focus(); status.classList.add('error'); status.textContent='Confira os campos obrigatórios antes de enviar.'; return; }
    const text = ['Olá, Félix! Vim pelo site do livro A Incrível Capacidade de se Organizar no Caos.','',`*Nome:* ${name}`,`*WhatsApp:* ${phone.value}`,...(email ? [`*E-mail:* ${email}`] : []),'',`*Mensagem:* ${message}`].join('\n');
    if (WHATSAPP_NUMBER) {
      const target = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      status.classList.remove('error');
      status.textContent='Abrindo o WhatsApp com a sua mensagem...';
      window.open(target, '_blank', 'noopener,noreferrer');
    } else {
      // O link curto do WhatsApp Business do autor oculta o número e não garante
      // o preenchimento automático. Copiamos a mensagem e abrimos o chat real.
      let copied = false;
      try { await navigator.clipboard.writeText(text); copied = true; }
      catch (e) {
        const temp = document.createElement('textarea');
        temp.value = text;temp.style.position='fixed';temp.style.opacity='0';document.body.appendChild(temp);temp.select();
        try {copied = document.execCommand('copy');} catch (_) {} temp.remove();
      }
      status.classList.remove('error');
      status.textContent = copied ? 'Mensagem copiada! Na conversa que abrir, cole e envie seu texto.' : 'O WhatsApp será aberto. Copie seu texto para a conversa.';
      window.open(WHATSAPP_SHORT_LINK, '_blank', 'noopener,noreferrer');
      if(!copied){window.prompt('Copie esta mensagem e cole na conversa do WhatsApp:',text);}
    }
  });
})();
