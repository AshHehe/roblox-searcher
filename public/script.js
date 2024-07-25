document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const keywords = document.getElementById('keywords').value;
    
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            keywords: keywords.split(',')
        })
    })
    .then(response => response.json())
    .then(data => {
        const linksDiv = document.getElementById('links');
        linksDiv.innerHTML = '';
        data.forEach(link => {
            const a = document.createElement('a');
            a.href = link;
            a.textContent = link;
            a.target = '_blank';
            linksDiv.appendChild(a);
        });
    });
});
