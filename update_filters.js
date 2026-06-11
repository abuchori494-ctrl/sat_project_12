const fs = require('fs');
let html = fs.readFileSync('question-bank/index.html', 'utf8');

const renderFiltersStart = html.indexOf('function renderFilters(type) {');
const renderFiltersEnd = html.indexOf('function toggleCat(btn) {');

if (renderFiltersStart === -1 || renderFiltersEnd === -1) {
  console.error("Could not find function bounds.");
  process.exit(1);
}

const newRenderFilters = `function renderFilters(type) {
      const isMath = type === 'math';
      const categories = isMath ? MATH_CATEGORIES : RW_CATEGORIES;
      const color = isMath ? '#0EA5E9' : '#7C69EF';
      const bg = isMath ? '#E0F2FE' : 'rgba(255,255,255,0.2)';
      
      let all = 0, notStarted = 0, inProg = 0, comp = 0;
      categories.forEach(cat => {
        cat.subTopics.forEach(sub => {
          all++;
          if (sub.completed === 0) notStarted++;
          else if (sub.completed === sub.total) comp++;
          else inProg++;
        });
      });

      const container = document.querySelector(\`.\${type}-filters\`);
      const { filter, search } = state[type];
      
      // Ensure row styling for container
      container.style.flexWrap = 'nowrap';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'space-between';
      container.style.gap = '8px';

      const makePill = (id, label, count) => {
        const isActive = filter === id;
        let pillStyle = '';
        if (isActive) {
          if (isMath) {
            pillStyle = 'background: #9FE1CB !important; border-color: #1D9E75 !important; color: #04342C !important; font-weight: 500;';
          } else {
            pillStyle = 'background: #CECBF6 !important; border-color: #7F77DD !important; color: #26215C !important; font-weight: 500;';
          }
        } else {
          pillStyle = 'background: #FFFFFF; border-color: #E8EAF2; color: #6B7280; font-weight: 400;';
        }
        return \`
          <button class="filter-btn shrink-0" data-filter="\${id}" style="\${pillStyle} padding: 4px 10px; border-radius: 99px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px; border-width: 0.5px; border-style: solid; margin: 0; outline: none;">
            \${label} <span style="font-weight: 600; color: inherit;">\${count}</span>
          </button>
        \`;
      };

      container.innerHTML = \`
        <div class="flex items-center shrink-0 no-scrollbar" style="gap: 5px; overflow-x: auto; padding-bottom: 2px;">
          \${makePill('all', 'All', all)}
          \${makePill('not-started', 'Not Started', notStarted)}
          \${makePill('in-progress', '<i class="ti ti-clock" style="font-size: 11px;"></i> In Progress', inProg)}
          \${makePill('completed', '<i class="ti ti-check" style="font-size: 11px;"></i> Completed', comp)}
        </div>
        <div class="flex-1 relative min-w-[100px]">
          <i class="ti ti-search absolute left-[10px] top-1/2 -translate-y-1/2 text-[#9CA3AF]" style="font-size: 14px; pointer-events: none;"></i>
          <input type="text" id="\${type}-search" value="\${search || ''}" placeholder="Search skills…" class="w-full bg-white border border-[#E8EAF2] rounded-full text-[12px] text-[#374151] placeholder-[#9CA3AF] focus:outline-none transition-colors" style="padding: 5px 28px 5px 30px; border-color: #E8EAF2;" onfocus="this.style.borderColor='\${color}'" onblur="this.style.borderColor='#E8EAF2'">
          <button id="\${type}-search-clear" onclick="clearSearch('\${type}')" class="absolute right-[8px] top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors" style="display: \${search ? 'block' : 'none'}; border: none; background: transparent; cursor: pointer; padding: 2px;">
            <i class="ti ti-x" style="font-size: 14px;"></i>
          </button>
        </div>
      \`;

      container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          state[type].filter = e.currentTarget.getAttribute('data-filter');
          renderFilters(type);
          renderList(type);
        });
      });
      
      const searchInput = document.getElementById(\`\${type}-search\`);
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          state[type].search = e.target.value;
          document.getElementById(\`\${type}-search-clear\`).style.display = e.target.value.length > 0 ? 'block' : 'none';
          debounceSearch(type);
        });
      }
    }

    `;

html = html.substring(0, renderFiltersStart) + newRenderFilters + html.substring(renderFiltersEnd);

// Fix empty state text
html = html.replace('No skills match this filter.', 'No skills match');

fs.writeFileSync('question-bank/index.html', html, 'utf8');
console.log('Successfully updated question-bank/index.html');
