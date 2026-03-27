const fs = require('fs');
fetch('https://shihanmenuka.online/')
  .then(r => r.text())
  .then(html => {
    const parts = html.split('id="skills"');
    if (parts.length > 1) {
      console.log(parts[1].substring(0, 1500).replace(/<svg[\s\S]*?<\/svg>/g, '<SVG>'));
    } else {
      console.log("No skills ID found in HTML");
      console.log(html.substring(0, 500));
    }
  });
