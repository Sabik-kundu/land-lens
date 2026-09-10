const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-list a");

window.addEventListener('scroll', () => {
    let currectSection = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if(window.scrollY >= sectionTop-150 && 
            window.scrollY < sectionTop + sectionHeight - 150
        ) currectSection = section.id;
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        const href = link.getAttribute("href").substring(1);
        if(href == currectSection) link.classList.add("active");
    });
});

const datasets = [
    {
        title: "Soil Health Mapping 2023-24",
        category: "Agriculture",
        description: "High-resolution spatial data detailing soil nutrient profiles, pH levels, and moisture indices across primary agricultural zones.",
        image: "https://images.unsplash.com/photo-1592982537447-6f296d9b15b3?auto=format&fit=crop&q=80&w=400",
        viewLink: "#view-soil",
        downloadLink: "#download-soil"
    },
    {
        title: "Groundwater Assessment Index",
        category: "Hydrology",
        description: "Quarterly updated dataset tracking groundwater depletion rates and recharge zones using satellite telemetry.",
        image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=400",
        viewLink: "#view-water",
        downloadLink: "#download-water"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "https://images.unsplash.com/photo-1416879572688-661413a96cd8?auto=format&fit=crop&q=80&w=400",
        viewLink: "#view-forest",
        downloadLink: "#download-forest"
    }
];

const renderDatasets = (items) => {
    const gridContainer = document.getElementById('dataset-grid');
    gridContainer.innerHTML = "";

    if(items.length === 0) {
        gridContainer.innerHTML = `<p style="color: #666; grid-coloumn: 1/-1; text-aling: center;">No Dataset found matching your search.</p>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('dataset-card');

        card.innerHTML = `
            <div class="card-image">
                <img src="${item.image}" alt="${item.title}">
                <span class="card-badge">${item.category}</span>
            </div>
            <div class="card-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="card-actions">
                    <a href="${item.viewLink}" class="icon-btn view-btn" title="View Map"><i class="fa-solid fa-eye"></i></a>
                    <a href="${item.downloadLink}" class="icon-btn download-btn" title="Download"><i class="fa-solid fa-download"></i></a>
                </div>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDatasets(datasets);

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = datasets.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
            renderDatasets(filtered);
        });
    }
})

const header = document.getElementById('main-header');

const observer = new IntersectionObserver(
    (entires) => {
        entires.forEach(entry => {
            if(entry.isIntersecting) {
                if(entry.target.id === "home-section") header.classList.remove('blue');
                else header.classList.add('blue');
            }
        });
    }, {
        threshold: 0.5
    }
)

sections.forEach(section => observer.observe(section));