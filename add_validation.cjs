const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

const oldHandlePreSubmit = `  const handlePreSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAttemptedSubmit(true);
    
    if (!validate(formData, true)) {
      return false; // Invalid
    }
    return true; // Valid
  };`;

const newHandlePreSubmit = `  const handlePreSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAttemptedSubmit(true);
    
    if (!validate(formData, true)) {
      return false;
    }
    
    try {
      setLoading(true);
      const query = encodeURIComponent(\`\${formData.street} \${formData.houseNumber}, \${formData.postalCode} \${formData.city}\`);
      const res = await fetch(\`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=\${query}\`);
      const data = await res.json();
      
      let isValidAddress = false;
      if (data && data.length > 0) {
        isValidAddress = data.some((d) => {
          if (!d.address) return false;
          const normalize = (s) => (s || '').toLowerCase().trim();
          const countryName = normalize(formData.country);
          const resCountry = normalize(d.address.country);
          const resCode = normalize(d.address.country_code);
          
          if (countryName === resCountry) return true;
          
          const codeMap = {
            "nederland": "nl", "belgië": "be", "duitsland": "de", "frankrijk": "fr", 
            "verenigd koninkrijk": "gb", "spanje": "es", "italië": "it", 
            "verenigde staten": "us", "canada": "ca", "australië": "au"
          };
          
          if (codeMap[countryName] === resCode) return true;
          return false;
        });
      }
      
      setLoading(false);
      
      if (!isValidAddress) {
        alert("Het ingevoerde adres komt niet overeen met het geselecteerde land. Controleer je adres en land.");
        return false;
      }
      
    } catch (err) {
      setLoading(false);
      console.warn("Geocoding failed", err);
    }

    return true;
  };`;

code = code.replace(oldHandlePreSubmit, newHandlePreSubmit);

code = code.replace(/onApprove={\(data, actions\) => {\s*return actions\.order!\.capture\(\)\.then\(\(details\) => {\s*if \(handlePreSubmit\(\)\) {\s*finalizeOrder\('paypal'\);\s*}\s*}\);\s*}}/g, 
`onApprove={(data, actions) => {
  return actions.order!.capture().then(async (details) => {
    const preSubmitValid = await handlePreSubmit();
    if (preSubmitValid) {
      finalizeOrder('paypal');
    }
  });
}}`);

fs.writeFileSync('src/pages/Checkout.tsx', code);
