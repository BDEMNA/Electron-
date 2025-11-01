// ===== Fonction principale pour acheter un produit via WhatsApp =====
function acheterProduit(id, nom, prix) {
    const pageUrl = window.location.href;
    const prixFormate = prix.toLocaleString('fr-FR');
    
    const message = `Bonjour, je souhaite commander :\n\n📦 *${nom}*\n💰 Prix : ${prixFormate} FCFA\n🔗 Lien : ${pageUrl}#produit-${id}\n\n📍 Livraison souhaitée : [À préciser]`;
    
    const whatsappUrl = `https://wa.me/241065292923?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ===== Gestion des filtres de catégories =====
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            
            // Filtrer les produits
            productCards.forEach(card => {
                if (category === 'tous') {
                    card.style.display = 'block';
                } else {
                    if (card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // ===== Navigation active au scroll =====
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ===== Bouton Scroll to Top =====
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== Gestion du modal de recherche =====
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Ouvrir le modal
    searchBtn.addEventListener('click', () => {
        searchModal.classList.add('active');
        searchInput.focus();
    });

    // Fermer le modal
    closeSearch.addEventListener('click', () => {
        searchModal.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    // Fermer en cliquant en dehors
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });

    // ===== Recherche en temps réel =====
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        searchResults.innerHTML = '';

        if (searchTerm.length < 2) return;

        // Récupérer tous les produits du DOM
        const allProducts = document.querySelectorAll('.product-card');
        const results = [];

        allProducts.forEach(card => {
            const name = card.querySelector('.product-name').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                results.push({
                    id: card.getAttribute('data-id'),
                    name: card.querySelector('.product-name').textContent,
                    price: card.querySelector('.product-price').textContent,
                    category: card.querySelector('.product-category').textContent
                });
            }
        });

        // Afficher les résultats
        if (results.length === 0) {
            searchResults.innerHTML = '<p style="padding: 1rem; text-align: center; color: #999;">Aucun produit trouvé</p>';
            return;
        }

        results.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.style.cssText = 'padding: 1rem; border-bottom: 1px solid #e2e8f0; cursor: pointer; transition: background 0.3s;';
            resultItem.innerHTML = `
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="width: 60px; height: 60px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-${product.category.includes('Ménager') ? 'blender' : 'mobile-alt'}" style="font-size: 1.5rem; color: #2563eb;"></i>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 0.3rem; color: #1e293b;">${product.name}</h4>
                        <p style="font-size: 0.9rem; color: #64748b;">${product.price}</p>
                    </div>
                </div>
            `;
            
            resultItem.addEventListener('mouseenter', () => {
                resultItem.style.background = '#f8fafc';
            });
            
            resultItem.addEventListener('mouseleave', () => {
                resultItem.style.background = 'white';
            });

            resultItem.addEventListener('click', () => {
                // Faire défiler jusqu'au produit
                const productCard = document.querySelector(`.product-card[data-id="${product.id}"]`);
                if (productCard) {
                    searchModal.classList.remove('active');
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                    
                    productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Effet de highlight
                    productCard.style.transform = 'scale(1.05)';
                    productCard.style.boxShadow = '0 20px 25px -5px rgba(37, 99, 235, 0.3)';
                    
                    setTimeout(() => {
                        productCard.style.transform = '';
                        productCard.style.boxShadow = '';
                    }, 1000);
                }
            });

            searchResults.appendChild(resultItem);
        });
    });

    // ===== Menu mobile =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');

    mobileMenuBtn.addEventListener('click', () => {
        if (nav.style.display === 'flex') {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'flex';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.background = 'white';
            nav.style.flexDirection = 'column';
            nav.style.padding = '1rem';
            nav.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            nav.style.zIndex = '999';
        }
    });

    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 968) {
                nav.style.display = 'none';
            }
        });
    });

    // ===== Smooth Scrolling pour tous les liens d'ancrage =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== Formulaire de contact =====
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[type="text"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const message = contactForm.querySelector('textarea').value;

        const whatsappMessage = `Bonjour, je m'appelle *${name}*\n📞 Téléphone : ${phone}\n\n💬 Message :\n${message}`;
        const whatsappUrl = `https://wa.me/241065292923?text=${encodeURIComponent(whatsappMessage)}`;
        
        window.open(whatsappUrl, '_blank');
        contactForm.reset();
        
        // Message de confirmation
        alert('Merci ! Vous allez être redirigé vers WhatsApp.');
    });

    // ===== Newsletter Form =====
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Message pour WhatsApp
            const message = `Je souhaite m'inscrire à la newsletter avec l'email : ${email}`;
            const whatsappUrl = `https://wa.me/241065292923?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
            newsletterForm.reset();
            
            alert(`Merci pour votre inscription ! Nous vous contacterons sur ${email}`);
        });
    }

    // ===== Animations au scroll (Intersection Observer) =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les cartes de fonctionnalités et de produits
    document.querySelectorAll('.feature-card, .product-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // ===== Préchargement des images =====
    const images = document.querySelectorAll('.product-image img');
    images.forEach(img => {
        // Ajouter un loader pendant le chargement
        const parent = img.parentElement;
        
        img.addEventListener('load', () => {
            parent.style.background = 'transparent';
        });
        
        img.addEventListener('error', () => {
            // Si l'image ne charge pas, afficher l'icône de fallback
            img.style.display = 'none';
            const icon = document.createElement('i');
            icon.className = 'fas fa-image';
            icon.style.fontSize = '3rem';
            icon.style.color = '#cbd5e1';
            parent.appendChild(icon);
        });
    });

    // ===== Compteur de produits par catégorie =====
    function updateProductCount() {
        const menagerCount = document.querySelectorAll('.product-card[data-category="menager"]').length;
        const electroniqueCount = document.querySelectorAll('.product-card[data-category="electronique"]').length;
        
        console.log(`📊 Produits Ménagers: ${menagerCount}`);
        console.log(`📊 Appareils Électroniques: ${electroniqueCount}`);
        console.log(`📊 Total: ${menagerCount + electroniqueCount}`);
    }
    
    updateProductCount();

    // ===== Gestion du redimensionnement de fenêtre =====
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Réinitialiser le menu mobile si on passe en desktop
            if (window.innerWidth > 968) {
                nav.style.display = 'flex';
                nav.style.position = 'static';
                nav.style.flexDirection = 'row';
                nav.style.padding = '0';
                nav.style.boxShadow = 'none';
            } else {
                nav.style.display = 'none';
            }
        }, 250);
    });

    // ===== Message de bienvenue (optionnel) =====
    console.log('🛍️ Boutique en ligne chargée avec succès!');
    console.log('📱 WhatsApp: +241 065 29 29 23');
});

// ===== Fonction utilitaire pour formater les nombres =====
function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(num);
}

// ===== Détection du navigateur pour optimisations =====
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isAndroid = /Android/.test(navigator.userAgent);

if (isIOS || isAndroid) {
    // Optimisations pour mobile
    document.body.style.webkitTapHighlightColor = 'transparent';
}

// ===== Performance: Lazy loading pour les images =====
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback pour les navigateurs qui ne supportent pas le lazy loading natif
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}