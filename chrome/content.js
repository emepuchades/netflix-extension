// === chrome/content.js ===

(function () {
    chrome.storage.local.get('netflixPanelMode', (data) => {
      const panelMode = data.netflixPanelMode || 'always';
      initPanel(panelMode);
    });
  
    function initPanel(panelMode) {
      if (document.getElementById('netflix-filter-toggle') || document.getElementById('netflix-filter-panel')) return;
  
      const createElement = (tag, styles = {}, props = {}) => {
        const el = document.createElement(tag);
        Object.assign(el.style, styles);
        Object.entries(props).forEach(([k, v]) => (el[k] = v));
        return el;
      };
  
      const createToggleButton = () => {
        const btn = createElement('button', {
          position: 'fixed', top: '60px', right: '20px', zIndex: '10000',
          padding: '0.5rem 1rem', border: 'none', borderRadius: '20px',
         backgroundColor: 'rgba(40, 40, 40, 0.8)', color: 'white', cursor: 'pointer', fontWeight: 'bold'
        }, {
          id: 'netflix-filter-toggle', textContent: '⚙️ Filtros'
        });
        document.body.appendChild(btn);
        return btn;
      };
  
      const createDropdown = (label, options) => {
        const container = document.createElement('div');
        const select = createElement('select', {
            width: '100%',
            padding: '10px 14px',
            paddingRight: '36px',
            appearance: 'none',
            backgroundColor: 'rgba(40, 40, 40, 0.8)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        });
        const defaultOption = createElement('option', {}, {
          textContent: label, disabled: true, selected: true, value: ''
        });
        select.appendChild(defaultOption);
        options.forEach(opt => {
          const option = createElement('option', {}, { textContent: opt, value: opt });
          select.appendChild(option);
        });
        container.appendChild(select);
  
        // Añadimos manejador de cambio para filtros en vivo
        select.addEventListener('change', () => {
          applySeenFilter();
        });
  
        return container;
      };
  
      const createFilterSection = () => {
        const section = createElement('div', {
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem'
        });
        section.appendChild(createDropdown('⏱️ Duración', ['<30min', '30-60min', '>60min']));
        section.appendChild(createDropdown('🎭 Género', ['Comedia', 'Drama', 'Terror', 'Docu']));
        section.appendChild(createDropdown('⭐ Valoración', ['1★+', '2★+', '3★+', '4★+', '5★']));
        section.appendChild(createDropdown('👁️ Estado de visualización', ['Visto', 'No visto']));
        section.appendChild(createDropdown('📅 Año', ['2024', '2023', '2022', '2021', 'Antes de 2020']));
        //section.appendChild(createDropdown('📂 Tipo', ['Película', 'Serie', 'Documental']));
        section.appendChild(createDropdown('🆕 Nuevas temporadas pronto', ['Sí', 'No']));
        return section;
      };
  
      const createListSection = () => {
        const title = createElement('h4', { margin: '1rem', color: '#ffffff' }, {
          textContent: '📝 Mis listas'
        });
        const lists = ['😢 Días tristes', '💪 Motivación', '🎉 Risas', '⏳ Retomar', '➕ Nueva lista'];
        const container = createElement('div', {
            display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '0.75rem', width: '100%'
        });
        lists.forEach(name => {
          const btn = createElement('button', {
            all: 'unset', padding: '0.6rem', backgroundColor: 'rgba(40, 40, 40, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', cursor: 'pointer',
            textAlign: 'center', color: '#ffffff'
          }, { textContent: name });
          container.appendChild(btn);
        });
        return [title, container];
      };
  
      const createPanel = () => {
        const isModal = panelMode === 'modal';
        const panel = createElement('div', isModal
          ? {
              position: 'fixed', top: '110px', right: '20px', zIndex: '10000',
              backgroundColor: '#fff', padding: '1rem', borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'sans-serif',
              width: '360px', color: '#000', display: 'none'
          }
          : {
            width: '90%',
            padding: '10px 14px',
            paddingRight: '36px',
            appearance: 'none',
            backgroundColor: 'rgba(40, 40, 40, 0.8)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginLeft: '40px',
          },
          { id: 'netflix-filter-panel' });
  
        const title = createElement('h3', { marginBottom: '0.5rem', color: '#000' }, {
          textContent: '🎬 Filtros Netflix'
        });
        const filters = createFilterSection();
        const [listTitle, listSection] = createListSection();
  
        if (isModal) panel.appendChild(title);
        panel.appendChild(filters);
        panel.appendChild(listTitle);
        panel.appendChild(listSection);
  
        const galleryHeader = document.querySelector('.sub-header');
        if (galleryHeader && galleryHeader.parentElement) {
          galleryHeader.parentElement.insertBefore(panel, galleryHeader.nextSibling);
        } else {
          const h1 = document.querySelector('h1');
          if (h1 && h1.parentElement) {
            h1.parentElement.insertBefore(panel, h1.nextSibling);
          } else {
            document.body.insertBefore(panel, document.body.firstChild);
          }
        }
  
        return panel;
      };
      const panel = createPanel();
    
      function applySeenFilter() {
        const selects = document.querySelectorAll('#netflix-filter-panel select');
        let hideSeen = false;
        selects.forEach(select => {
          if (select.value === 'No visto') {
            hideSeen = true;
          }
        });
  
        const cards = document.querySelectorAll('.slider-item');
        console.log('cards', cards);
        cards.forEach(card => {
          const trackingData = card.closest('.ptrack-content')?.dataset?.uiTrackingContext || '{}';
          const isSeen = trackingData.includes('"location":"continueWatching"');
  
          if (hideSeen && isSeen) {
            card.style.display = 'none';
          } else {
            card.style.display = '';
          }
        });
      }

      if (panelMode === 'modal') {
        const toggleBtn = createToggleButton();
        toggleBtn.addEventListener('click', () => {
          const panel = document.getElementById('netflix-filter-panel');
          if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          }
        });
      }
    }
  
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'REFRESH_PANEL') {
        const existing = document.getElementById('netflix-filter-panel');
        const toggle = document.getElementById('netflix-filter-toggle');
        if (existing) existing.remove();
        if (toggle) toggle.remove();
        chrome.storage.local.get('netflixPanelMode', (data) => {
          const panelMode = data.netflixPanelMode || 'always';
          initPanel(panelMode);
        });
      }
    });
  })();
  