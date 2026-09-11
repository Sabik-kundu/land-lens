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

/**
 * data = {
 *      title: "",
 *      category: "",
 *      description: "",
 *      image: "",
 *      viewLink: "",
 *      downloadLink: "".
 * };
 */

const datasets = [
    {
        title: "Soil Health Mapping 2023-24",
        category: "Agriculture",
        description: "High-resolution spatial data detailing soil nutrient profiles, pH levels, and moisture indices across primary agricultural zones.",
        image: "./url/filler.jpg",
        viewLink: "#view-soil",
        downloadLink: "#download-soil"
    },
    {
        title: "Groundwater Assessment Index",
        category: "Hydrology",
        description: "Quarterly updated dataset tracking groundwater depletion rates and recharge zones using satellite telemetry.",
        image: "./url/filler.jpg",
        viewLink: "#view-water",
        downloadLink: "#download-water"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    },
    {
        title: "Forest Cover Deforestation Metrics",
        category: "Land Use",
        description: "Comparative analytics highlighting changes in forest density and protected land boundaries over the last decade.",
        image: "./url/filler.jpg",
        viewLink: "#view-forest",
        downloadLink: "./url/OFL.txt"
    }
];

const ITEMS_PER_PAGE = 6;
let currentDatasetList = datasets;
let currentPage = 1;

const renderDatasets = (items) => {
    const gridContainer = document.getElementById('dataset-grid');
    gridContainer.innerHTML = "";

    if(items.length === 0) {
        gridContainer.innerHTML = `<p style="color: #666; grid-column: 1/-1; text-align: center;">No Dataset found matching your search.</p>`;
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
                    <a href="${item.viewLink}" class="icon-btn view-btn" title="View Map"><ion-icon name="eye-outline"></ion-icon></a>
                    <a href="${item.downloadLink}" class="icon-btn download-btn" title="Download" download><ion-icon name="download-outline"></ion-icon></a>
                </div>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

const renderPagination = (totalItems) => {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return;

    const makeButton = (label, page, { disabled = false, active = false, isArrow = false } = {}) => {
        const btn = document.createElement('button');
        btn.classList.add('page-btn');
        if (isArrow) btn.classList.add('arrow-btn');
        if (active) btn.classList.add('active');
        if (disabled) btn.disabled = true;
        btn.innerHTML = label;
        btn.addEventListener('click', () => goToPage(page));
        return btn;
    };

    paginationContainer.appendChild(
        makeButton('<ion-icon name="chevron-back-outline"></ion-icon>', currentPage - 1, {
            disabled: currentPage === 1,
            isArrow: true
        })
    );

    for (let page = 1; page <= totalPages; page++) {
        paginationContainer.appendChild(
            makeButton(String(page), page, { active: page === currentPage })
        );
    }

    paginationContainer.appendChild(
        makeButton('<ion-icon name="chevron-forward-outline"></ion-icon>', currentPage + 1, {
            disabled: currentPage === totalPages,
            isArrow: true
        })
    );
}

const goToPage = (page) => {
    const totalPages = Math.ceil(currentDatasetList.length / ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayCurrentPage();

    const datasetSection = document.getElementById('dataset-section');
    if (datasetSection) datasetSection.scrollIntoView({ behavior: 'smooth' });
}

const displayCurrentPage = () => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = currentDatasetList.slice(start, start + ITEMS_PER_PAGE);

    renderDatasets(pageItems);
    renderPagination(currentDatasetList.length);
}

document.addEventListener('DOMContentLoaded', () => {
    currentDatasetList = datasets;
    currentPage = 1;
    displayCurrentPage();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            currentDatasetList = datasets.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
            currentPage = 1;
            displayCurrentPage();
        });
    }
})

const header = document.getElementById('main-header');
const heroSection = document.getElementById('home-section');
const datasetSection = document.getElementById('dataset-section');

const headerSizeStart = { top: 20, left: 3, width: 45, height: 75, radius: 12, paddingX: 30 };
const headerSizeEnd = { top: 0, left: 7, width: 90, height: 75, radius: 12, paddingX: 50 };

const lerp = (start, end, t) => start + (end - start) * t;

let growDistance = datasetSection.offsetTop || heroSection.offsetHeight;
let headerTicking = false;

const applyHeaderSize = () => {
    const progress = Math.min(Math.max(window.scrollY / growDistance, 0), 0.9);

    header.style.top = `${lerp(headerSizeStart.top, headerSizeEnd.top, progress)}px`;
    header.style.left = `${lerp(headerSizeStart.left, headerSizeEnd.left, progress)}%`;
    header.style.width = `${lerp(headerSizeStart.width, headerSizeEnd.width, progress)}%`;
    header.style.height = `${lerp(headerSizeStart.height, headerSizeEnd.height, progress)}px`;
    header.style.borderRadius = `${lerp(headerSizeStart.radius, headerSizeEnd.radius, progress)}px`;
    header.style.paddingLeft = `${lerp(headerSizeStart.paddingX, headerSizeEnd.paddingX, progress)}px`;
    header.style.paddingRight = `${lerp(headerSizeStart.paddingX, headerSizeEnd.paddingX, progress)}px`;

    headerTicking = false;
};

const onHeaderScroll = () => {
    if (!headerTicking) {
        requestAnimationFrame(applyHeaderSize);
        headerTicking = true;
    }
};

window.addEventListener('scroll', onHeaderScroll);
window.addEventListener('resize', () => {
    growDistance = datasetSection.offsetTop || heroSection.offsetHeight;
    applyHeaderSize();
});

applyHeaderSize();

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