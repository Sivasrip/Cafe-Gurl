document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    const header = document.querySelector('header');
    const logo = document.querySelector('.logo');
    const logoText = document.querySelector('.logo-text');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.4rem 5%';
            header.style.boxShadow = '0 6px 25px rgba(0,0,0,0.15)';
            if (logo) logo.style.height = '45px';
            if (logoText) logoText.style.fontSize = '1.1rem';
            header.style.transition = 'all 0.3s ease';
        } else {
            header.style.padding = '1rem 5%';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            if (logo) logo.style.height = '60px';
            if (logoText) logoText.style.fontSize = '1.5rem';
            header.style.transition = 'all 0.3s ease';
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const cursor = document.querySelector('.cursor');
    
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .btn, .menu-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }

    const progressBar = document.querySelector('.scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    });

    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        text.split(' ').forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.classList.add('word');
            span.style.transitionDelay = `${index * 0.1 + 1.5}s`; 
            heroTitle.appendChild(span);
            
            setTimeout(() => {
                span.classList.add('visible');
            }, 400);
        });
    }

    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-price');
    const cartCountElement = document.getElementById('cart-count');
    const orderBtns = document.querySelectorAll('.order-btn');

    let cart = [];

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

   orderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            const id = menuItem.dataset.id;
            const name = menuItem.dataset.name;
            const price = parseInt(menuItem.dataset.price);
            const qty = 1;

            addToCart({ id, name, price, qty });
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.pointerEvents = 'none';
            ripple.style.left = e.offsetX + 'px';
            ripple.style.top = e.offsetY + 'px';
            ripple.style.animation = 'ripple 0.6s ease-out';
            btn.parentElement.style.position = 'relative';
            btn.parentElement.style.overflow = 'hidden';
            
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 100);
        });
    });

    const checkoutBtn = document.querySelector('.checkout-btn');
    const successPopup = document.getElementById('order-success-popup');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;

            closeCart();

            createConfetti();

            setTimeout(() => {
                successPopup.classList.add('active');
                playOrderSound();
            }, 300);


            cart = [];
            updateCartUI();

            setTimeout(() => {
                successPopup.classList.remove('active');
            }, 4000);
        });
    }

    function createConfetti() {
        const colors = ['#5E2F13', '#A27244', '#FFD700', '#C8A882'];
        const confettiPieces = 30;

        for (let i = 0; i < confettiPieces; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '0';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9997';
            confetti.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
            document.body.appendChild(confetti);

            const duration = Math.random() * 2 + 2;
            const xVelocity = Math.random() * 300 - 150;
            const yVelocity = Math.random() * 300 + 100;
            const rotation = Math.random() * 360;

            confetti.animate([
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: 'translate(' + xVelocity + 'px, ' + yVelocity + 'px) rotate(' + rotation + 'deg)', opacity: 0 }
            ], { duration: duration * 1000, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }).onfinish = () => {
                confetti.remove();
            };
        }
    }

    function playOrderSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (err) {
            console.log('Audio not supported');
        }
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.qty += item.qty;
        } else {
            cart.push(item);
        }
        updateCartUI();
        openCart();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    function updateCartUI() {
        const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCountElement.textContent = totalCount;

        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartTotalElement.textContent = `₹${total}`;

        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name-price">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">₹${item.price * item.qty}</span>
                    </div>
                    <div class="cart-item-qty-controls">
                        <button class="cart-qty-btn minus" data-index="${index}">-</button>
                        <span class="cart-qty-val">${item.qty}</span>
                        <button class="cart-qty-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        document.querySelectorAll('.cart-qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const itemQuantity = e.target.closest('.cart-item-qty-controls');
                const qtyVal = itemQuantity.querySelector('.cart-qty-val');
                let currentQty = parseInt(qtyVal.textContent);

                if (e.target.classList.contains('minus')) {
                    if (currentQty > 1) {
                        cart[index].qty -= 1;
                        updateCartUI();
                    }
                } else if (e.target.classList.contains('plus')) {
                    cart[index].qty += 1;
                    updateCartUI();
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.remove-item').dataset.index);
                removeFromCart(index);
            });
        });
    }

    function initializeCartWithAllItems() {
        document.querySelectorAll('.menu-item').forEach(item => {
            const id = item.dataset.id;
            const name = item.dataset.name;
            const price = parseInt(item.dataset.price);
            const qty = 1;
            
            cart.push({ id, name, price, qty });
        });
        updateCartUI();
    }

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('menu-item')) {
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (entry.target.classList.contains('section-title')) {
                    entry.target.classList.add('visible');
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.menu-item, .about-text, .about-img, .section-title, .banner h2').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });

    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const floatingObjs = document.querySelectorAll('.floating-obj');
    
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 50;
            const y = (window.innerHeight - e.pageY * 2) / 50;
            
            if (heroContent) {
                heroContent.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateZ(20px)`;
            }

            floatingObjs.forEach((obj, index) => {
                const speed = (index + 1) * 2;
                const xPos = (window.innerWidth - e.pageX * speed) / 100;
                const yPos = (window.innerHeight - e.pageY * speed) / 100;
                obj.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${x * 2}deg)`;
            });
        });
        
        hero.addEventListener('mouseleave', () => {
             if (heroContent) {
                 heroContent.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
                 heroContent.style.transition = 'transform 0.5s ease';
             }
             floatingObjs.forEach(obj => {
                 obj.style.transform = 'translate(0, 0) rotate(0deg)';
                 obj.style.transition = 'transform 0.5s ease';
             });
        });
        
        hero.addEventListener('mouseenter', () => {
             if (heroContent) heroContent.style.transition = 'none';
             floatingObjs.forEach(obj => obj.style.transition = 'none');
        });
    }
});

window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    const splashLogo = document.querySelector('.splash-logo');
    const headerLogo = document.querySelector('.logo');
    const headerLogoText = document.querySelector('.logo-text');

    headerLogo.style.opacity = '0';
    headerLogoText.style.opacity = '0';

    setTimeout(() => {
        const splashRect = splashLogo.getBoundingClientRect();
        const headerRect = headerLogo.getBoundingClientRect();

        const currentCenterX = splashRect.left + splashRect.width / 2;
        const currentCenterY = splashRect.top + splashRect.height / 2;
        const targetCenterX = headerRect.left + headerRect.width / 2;
        const targetCenterY = headerRect.top + headerRect.height / 2;

        const moveX = targetCenterX - currentCenterX;
        const moveY = targetCenterY - currentCenterY;

        const scale = headerRect.height / splashRect.height;

        splashLogo.style.transition = 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
        splashLogo.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;

        setTimeout(() => {
            headerLogo.style.opacity = '1';
            headerLogoText.style.transition = 'opacity 0.5s ease';
            headerLogoText.style.opacity = '1';
            
            splashScreen.style.transition = 'opacity 0.5s ease';
            splashScreen.style.opacity = '0';
            
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500);
        }, 1200); 

    }, 800);
});
