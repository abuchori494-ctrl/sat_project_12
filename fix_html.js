const fs = require('fs');
let html = fs.readFileSync('study-planner.html', 'utf-8');

// 1. We know the file starts with:
// <title>Study Planner ?" SAT Platform</title>
// <script src="https://cdn.tailwindcss.com"></script>
// </section>
// <script>
// const API_BASE = '';
// ... huge JS block ...
// </script>
// <script>
//       tailwind.config = {

// Let's use regex to find the massive JS block that was injected at the top.
// The block starts with const API_BASE = ''; and ends with the first </script>.
const jsBlockMatch = html.match(/<script>\s*(const API_BASE = '';[\s\S]*?)<\/script>/);

if (jsBlockMatch) {
    const hugeJS = jsBlockMatch[1];
    
    // Remove it from the head
    html = html.replace(jsBlockMatch[0], '');
    
    // Also remove the errant </section> right before it
    html = html.replace('</section>\n', '');
    
    // We also replaced <script src="https://cdn.tailwindcss.com"></script> with the wrong thing earlier maybe?
    // Let's just make sure the head is clean.
    
    // Now put the huge JS block at the very end of the file, right before </body>
    // We also need to add <script> around it.
    // Wait, the end of the file currently has:
    // document.addEventListener("DOMContentLoaded", () => { navigate("dashboard"); });
    // </script>
    // </body>
    html = html.replace('</body>', '<script>\n' + hugeJS + '\n</script>\n</body>');
    
    // And what about the <section id="view-dashboard" class="hidden">? 
    // In my merge script, I replaced <script> with </section>\n<script>.
    // Wait, in my merge script I did:
    // planner_content = planner_content.replace('<script>', '</section>\n<script>');
    // Because I wanted to close the <section id="view-dashboard"> right before the scripts at the bottom!
    // Since I removed it from the head, I need to add </section> right before the final scripts.
    // Let's just find </body> and put </section> before the last <script>.
    
    // Wait, let's just do it cleanly:
    html = html.replace('</body>', '</section>\n</body>');
}

fs.writeFileSync('study-planner_fixed.html', html, 'utf-8');
console.log("Fixed!");
