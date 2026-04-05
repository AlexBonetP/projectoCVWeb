fetch('./js/cvData.json')
  .then(res => res.json())
  .then(cvData => {

    /* ====== DADES PERSONALS ====== */
    const personal = document.getElementById('personal-container');
    if (personal) {
      personal.innerHTML = `
        <p>${cvData.dades_personals}</p>
        <p>${cvData.cp}</p>
        <p>${cvData.Tlf}</p>
        <p>Email: <a href="mailto:${cvData.email}">${cvData.email}</a></p>
        <p>${cvData["altres"]}</p>
      `;
    }

    /* ====== FOTO ====== */
    const foto = document.getElementById('foto-perfil');
    if (foto && cvData.foto) {
      foto.src = cvData.foto;
    }

    /* ====== FUNCIONS UTILITÀRIES ====== */
    const setBlocks = (id, items, className, templateFn) => {
      const container = document.getElementById(id);
      if (container && Array.isArray(items)) {
        container.innerHTML = "";
        items.forEach(item => {
          const div = document.createElement('div');
          div.className = className;
          div.innerHTML = templateFn(item);
          container.appendChild(div);
        });
      }
    };

    const setList = (id, items) => {
      const el = document.getElementById(id);
      if (el && Array.isArray(items)) {
        el.innerHTML = `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
      }
    };

    /* ====== EXPERIÈNCIA ====== */
    setBlocks(
      'experience-container',
      cvData.experiencia,
      'job',
      exp => `
        <strong>${exp.anys}</strong> — <span>${exp.empresa}</span> <em>${exp.carrec}</em>
        <ul>${exp.descripcio.map(d => `<li>${d}</li>`).join('')}</ul>
      `
    );

    /* ====== FORMACIÓ ====== */
    setBlocks(
      'training-container',
      cvData.formacio,
      'training',
      form => `<strong>${form.anys}</strong> — <span>${form.titol}</span>`
    );

    /* ====== FORMACIÓ COMPLEMENTÀRIA ====== */
    setBlocks(
      'extra-training-container',
      cvData.formacio_complementaria,
      'extra-training',
      form => `
        <strong>${form.anys}</strong> — <span>${form.titol}</span>
        ${form.descripcio?.length ? `<ul>${form.descripcio.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
      `
    );

    /* ====== IDIOMES ====== */
    setList('languages-container', cvData.idiomes);

    /* ====== HABILITATS: assignatures de la carrera ====== */
    const skillContainer = document.getElementById('skill-container');
    const carrera = cvData.formacio.find(f => f.assignatures && f.assignatures.length > 0);
    if (skillContainer && carrera) {
      skillContainer.innerHTML = `<ul>${carrera.assignatures.map(a => `<li>${a}</li>`).join('')}</ul>`;
    }

    /* ====== INFORMATICA ======  */
    const otherContainer = document.getElementById('other-container');
    if (otherContainer && Array.isArray(cvData.informatica)) {
      otherContainer.innerHTML = `<ul>${cvData.informatica.map(i => `<li>${i.nom}</li>`).join('')}</ul>`;
    }

    /* ====== PROJECTES ======  */
    const projectsContainer = document.getElementById('projects-container');

    if (projectsContainer && cvData.proyectos) {
      const { descripcion, prs } = cvData.proyectos; // destructuring clar

      projectsContainer.innerHTML = `
    <p>${descripcion}</p>  <!-- text introductori -->
    <ul>
      ${Array.isArray(prs) ? prs.map(p => `<li>${p.pr}</li>`).join('') : ''}
    </ul>
  `;
    }
    /* ====== FOOTER ====== */
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail) {
      footerEmail.innerHTML = `<a href="mailto:${cvData.email}">Estoy a tu disposición clicando en este enlace</a>`;
    }
    /* ====== ACORDIÓ EXCLUSIU ====== */
    const sections = document.querySelectorAll('main section');

    sections.forEach(sec => {
      const title = sec.querySelector('h2');
      const content = sec.querySelector('div');

      title.addEventListener('click', () => {

        // Si aquesta secció ja està oberta → tanquem
        if (content.classList.contains('container-visible')) {
          content.classList.remove('container-visible');
          title.classList.remove('active'); // per la fletxa
          return;
        }

        // Tanquem totes les altres seccions
        sections.forEach(s => {
          s.querySelector('div').classList.remove('container-visible');
          s.querySelector('h2').classList.remove('active');
        });

        // Obrim aquesta
        content.classList.add('container-visible');
        title.classList.add('active'); // per la fletxa
      });
    });

  })
  .catch(err => console.error('Error carregant dades:', err));