const fs = require('fs');
let code = fs.readFileSync('src/pages/Product.tsx', 'utf-8');

const regex = /const data = await res\.json\(\)\.catch\(\(\) => null\);[\s\S]*?\} catch \(err\) \{/g;
code = code.replace(regex, `const data = await res.json().catch(() => null);
        (window as any).showToast((data && data.error) ? data.error : (t('restock_err') || 'Fout bij aanmelden.'));
      }
    } catch (err) {`);

fs.writeFileSync('src/pages/Product.tsx', code);
