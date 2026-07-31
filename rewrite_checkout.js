const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

// Remove ideal
code = code.replace(/method: 'ideal'/g, "method: 'paypal'");
code = code.replace(/<option value="ideal">iDEAL \(Stripe\/Mollie\)<\/option>\n\s*/g, '');
code = code.replace(/{formData.method === 'ideal' && \(\s*<button[\s\S]*?<\/button>\s*\)}/g, '');

// Fix PayPal to add payee and remove the method select completely (or just keep it with paypal only)
code = code.replace(/<div className="form-field">\s*<label>{t\('payment_method'\)}<\/label>\s*<select name="method" value={formData.method} onChange={handleChange}>\s*<option value="paypal">PayPal<\/option>\s*<\/select>\s*<\/div>/g, '');

// Also we can remove `{formData.method === 'paypal' && (` since it's the only one now
code = code.replace(/{formData.method === 'paypal' && \(/g, '{true && (');

// Add address validation in handlePreSubmit
const validationCode = `
  const handlePreSubmit = async () => {
    setAttemptedSubmit(true);
    if (!isValid) return false;
    
    // Address validation
    try {
      setLoading(true);
      const query = encodeURIComponent(\`\${formData.street} \${formData.houseNumber}, \${formData.postalCode} \${formData.city}, \${formData.country}\`);
      const res = await fetch(\`https://nominatim.openstreetmap.org/search?format=json&q=\${query}\`);
      const data = await res.json();
      if (!data || data.length === 0) {
        alert("Het ingevoerde adres kon niet worden gevalideerd. Controleer de straat, huisnummer, postcode en woonplaats.");
        setLoading(false);
        return false;
      }
      setLoading(false);
    } catch (e) {
      console.warn("Address validation error", e);
      setLoading(false);
    }

    return true;
  };

  // Keep original handlePreSubmit signature but it's async now, so we need to handle that in createOrder.
  // Wait, createOrder can return a Promise.
`;
fs.writeFileSync('rewrite_checkout.js_temp', code);
