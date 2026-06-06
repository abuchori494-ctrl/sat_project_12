const fs = require('fs');

let code = fs.readFileSync('past-exams.html', 'utf8');

// The element we actually need to append after is the end of the main column, or right after math-list
const mathListRegex = /(<div class="ecl-cards-list" id="math-list"><\/div>\s*<\/div>)/;
const paginationHtml = `
          <div class="ecl-cards-list" id="math-list"></div>
        </div>

        <!-- Pagination Controls -->
        <div id="pagination-controls" style="display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 24px; grid-column: span 2; width: 100%;">
          <button id="prev-page-btn" class="btn-practice-pill" onclick="changePage(-1)" disabled style="padding: 8px 16px;">Previous</button>
          <span id="page-indicator" style="font-size: 14px; font-weight: 500;">Page 1</span>
          <button id="next-page-btn" class="btn-practice-pill" onclick="changePage(1)" style="padding: 8px 16px;">Next</button>
        </div>
`;

if (!code.includes('id="pagination-controls"')) {
  code = code.replace(mathListRegex, paginationHtml);
}

fs.writeFileSync('past-exams.html', code);
console.log('Fixed pagination injection in past-exams.html');
