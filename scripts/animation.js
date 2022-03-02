// animation for map burger menu toggle-btn
function showSearchMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    const btn = document.getElementsByClassName('toggle-btn');
    for (let i of btn) {
        i.classList.toggle('active')
    }
}

let hoverEvent = document.getElementsByClassName('toggle-btn')
for (let hover of hoverEvent) {
    hover.addEventListener('mouseenter', function(event) {
        event.target.style.backgroundColor = "#6dcc93";
    })
    hover.addEventListener('mouseleave', function (event) {
        event.target.style.backgroundColor = "#00ff0000"
    })
}