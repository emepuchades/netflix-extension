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
            position: 'fixed',
            top: '81px',
            right: '47px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'rgba(229, 9, 20, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: '100',
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
  
      const createListSection = (isModal) => {
        const title = createElement(isModal ? 'h2' : 'h4', { marginTop: '1rem', color: '#ffffff',  marginBottom: '1.5rem'}, {
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
              position: 'fixed', 
              top: '130px', 
              right: '43px', 
              zIndex: '10000',
              backgroundColor: 'rgba(20, 20, 20, 0.95)',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              backdropFilter: "blur(10px)",
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '25px 25px',
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
  
        const title = createElement('h2', { marginBottom: '1.5rem', color: '#ffffff' }, {
          textContent: '🎬 Filtros Netflix'
        });
        const filters = createFilterSection();
        const [listTitle, listSection] = createListSection(isModal);
  
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
        if (isModal) panel.style.display = 'none';

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
  