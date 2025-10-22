// Inicializar el sistema de notificaciones
        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top',
            },
            types: [
                {
                    type: 'success',
                    background: '#1a472a',
                    icon: {
                        className: 'fas fa-check-circle',
                        tagName: 'i',
                        color: 'white'
                    }
                },
                {
                    type: 'error',
                    background: '#FF0000',
                    icon: {
                        className: 'fas fa-times-circle',
                        tagName: 'i',
                        color: 'white'
                    }
                }
            ]
        });

        // DOM Elementos
        const subscribeBtn = document.getElementById('subscribe-btn');
        const loginBtn = document.getElementById('login-btn');
        const homeRegisterBtn = document.getElementById('home-register-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const navButtons = document.getElementById('nav-buttons');
        const userNav = document.getElementById('user-name'); 
        const userProfilePicture = document.getElementById('user-profile-picture'); // ¡Nuevo elemento para la foto!
        const homePage = document.getElementById('home-page');
        const subscriptionPage = document.getElementById('subscription-page');
        const dashboard = document.getElementById('dashboard');
        const authModal = document.getElementById('auth-modal');
        const closeAuthModal = document.getElementById('close-auth-modal');
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');
        const loginFormContainer = document.getElementById('login-form-container');
        const registerFormContainer = document.getElementById('register-form-container');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const sidebarNav = document.getElementById('sidebar-nav'); 

        // Estado de usuario 
        let currentUser = null;
        let userType = null;

        // Array para simular la base de datos de usuarios registrados
        // Se inicializa cargando desde localStorage, o como un array vacío si no hay datos
        let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        // Escuchadores de eventos
        subscribeBtn.addEventListener('click', showSubscriptionPage);
        loginBtn.addEventListener('click', showAuthModal);
        homeRegisterBtn.addEventListener('click', () => {
            showAuthModal();
            showRegisterForm();
        });
        logoutBtn.addEventListener('click', logout);
        closeAuthModal.addEventListener('click', hideAuthModal);
        showRegister.addEventListener('click', showRegisterForm);
        showLogin.addEventListener('click', showLoginForm);
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handleRegister);

        // Seleccion del plan de sucripcion
        document.querySelectorAll('.subscription-select').forEach(button => {
            button.addEventListener('click', function() {
                const plan = this.getAttribute('data-plan');
                if (plan === 'basic') {
                    // El plan gratuito no necesita pago
                    notyf.success('Te has suscrito exitosamente al plan Básico!');
                    if (currentUser) {
                        showDashboard();
                    } else {
                        showAuthModal();
                    }
                } else {
                    // Mostrar formulario de pago para los planes pagos
                    document.querySelectorAll('.subscription-select').forEach(btn => {
                        btn.parentElement.classList.remove('bg-green-50', 'transform', 'scale-105');
                    });
                    this.parentElement.classList.add('bg-green-50', 'transform', 'scale-105');
                    
                    const paymentPlan = document.getElementById('payment-plan');
                    const paymentAmount = document.getElementById('payment-amount');
                    
                    if (plan === 'pro') {
                        paymentPlan.textContent = 'Pro';
                        paymentAmount.textContent = '$9.99';
                    } else if (plan === 'elite') {
                        paymentPlan.textContent = 'Elite';
                        paymentAmount.textContent = '$19.99';
                    }
                    
                    document.querySelectorAll('.subscription-select').forEach(btn => {
                        btn.classList.remove('hidden');
                    });
                    document.getElementById('payment-form-container').classList.remove('hidden');
                }
            });
        });

        // Boton de volver a planes
        document.getElementById('back-to-plans').addEventListener('click', function() {
            document.getElementById('payment-form-container').classList.add('hidden');
        });

        // Envio del formulario de pago
        document.getElementById('payment-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Mostrar el estado de carga
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Procesando...';
            
            // Simular el proceso de pago
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Pago exitoso
                notyf.success('¡Pago exitoso! Tu suscripción está activa.');
                document.getElementById('payment-form-container').classList.add('hidden');
                
                if (currentUser) {
                    showDashboard();
                } else {
                    showAuthModal();
                }
            }, 1500);
        });

        // Seleccion del tipo deusuario en registro
        document.querySelectorAll('.user-type-radio').forEach(radio => {
            radio.addEventListener('change', function() {
                document.querySelectorAll('.user-type-radio').forEach(r => {
                    r.parentElement.classList.remove('border-football', 'bg-green-50');
                });
                if (this.checked) {
                    this.parentElement.classList.add('border-football', 'bg-green-50');
                    userType = this.value;
                }
            });
        });

        // Perfil descuchadores de eventos
        document.getElementById('player-profile-form').addEventListener('submit', handleProfileSubmit);
        document.getElementById('club-profile-form').addEventListener('submit', handleProfileSubmit);
        document.getElementById('agent-profile-form').addEventListener('submit', handleProfileSubmit);

        // Formulario de busqueda de escuchadores de enventos
        document.getElementById('player-search-form').addEventListener('submit', handleSearchSubmit);
        document.getElementById('club-search-form').addEventListener('submit', handleSearchSubmit);
        document.getElementById('agent-search-form').addEventListener('submit', handleSearchSubmit);

        // Control de rango para la busqueda de jugadores
        setupRangeSlider('age-min-slider', 'age-max-slider', 'age-min', 'age-max');
        setupRangeSlider('height-min-slider', 'height-max-slider', 'height-min', 'height-max');

        // Vista previa de carga de archivos
        setupFileUploadPreview('player-photo', 'player-photo-preview');
        setupFileUploadPreview('club-logo', 'club-logo-preview');
        setupFileUploadPreview('agent-photo', 'agent-photo-preview');

        // Funciones
        function showSubscriptionPage() {
            homePage.classList.add('hidden');
            dashboard.classList.add('hidden');
            subscriptionPage.classList.remove('hidden');
        }

        function showAuthModal() {
            authModal.classList.remove('hidden');
            document.body.classList.add('modal-active');
            showLoginForm(); // Default to login form when modal opens
        }

        function hideAuthModal() {
            authModal.classList.add('hidden');
            document.body.classList.remove('modal-active');
            // Clear all auth forms when modal is hidden
            loginForm.reset();
            registerForm.reset();
            document.querySelectorAll('.user-type-radio').forEach(r => r.checked = false); // Deselect user type radios
            document.querySelectorAll('.user-type-radio').forEach(r => r.parentElement.classList.remove('border-football', 'bg-green-50')); // Remove highlight
        }

        function showRegisterForm() {
            loginFormContainer.classList.add('hidden');
            registerFormContainer.classList.remove('hidden');
            document.getElementById('auth-modal-title').textContent = 'Registrarse';
            loginForm.reset(); // Clear login form when switching to register
        }

        function showLoginForm() {
            registerFormContainer.classList.add('hidden');
            loginFormContainer.classList.remove('hidden');
            document.getElementById('auth-modal-title').textContent = 'Iniciar sesión';
            registerForm.reset(); // Clear register form when switching to login
            document.querySelectorAll('.user-type-radio').forEach(r => r.checked = false); // Deselect user type radios
            document.querySelectorAll('.user-type-radio').forEach(r => r.parentElement.classList.remove('border-football', 'bg-green-50')); // Remove highlight
        }

        function handleLogin(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Basic validation
            if (!email || !password) {
                notyf.error('Por favor, ingresa tu email y contraseña.');
                return;
            }

            // Mostrar el estado de carga
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Iniciando sesión...';
            
            // Simulate llamada API para el inicio de sesión 
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Validar contra usuarios registrados
                const foundUser = registeredUsers.find(user => user.email === email && user.password === password);

                if (foundUser) {
                    currentUser = {
                        username: foundUser.username,
                        email: foundUser.email,
                        name: foundUser.name, 
                        userType: foundUser.userType,
                        photoUrl: foundUser.photoUrl || 'https://placehold.co/40x40/cccccc/ffffff/png?text=User' // Usar la foto guardada o un placeholder
                    };
                    
                    userType = foundUser.userType; 
                    
                    localStorage.setItem('authToken', 'demo-token-xyz'); 
                    localStorage.setItem('userType', userType);
                    localStorage.setItem('userName', currentUser.name); 
                    localStorage.setItem('userUsername', currentUser.username); // Guardar el nombre de usuario
                    localStorage.setItem('userEmail', currentUser.email); 
                    localStorage.setItem('userPhotoUrl', currentUser.photoUrl); // ¡Guardar la URL de la foto!

                    notyf.success('¡Inicio de sesión exitoso!');
                    hideAuthModal();
                    showDashboard();
                } else {
                    notyf.error('Email o contraseña incorrectos. Por favor, verifica tus credenciales o regístrate.'); 
                }
            }, 1000);
        }

        function handleRegister(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            // Validacion basica
            if (!userType) {
                notyf.error('Por favor, selecciona un tipo de usuario (Jugador, Club o Representante).');
                return;
            }
            
            if (!name || !username || !email || !password || !confirmPassword) {
                notyf.error('Por favor, completa todos los campos.');
                return;
            }

            if (password !== confirmPassword) {
                notyf.error('Las contraseñas no coinciden.');
                return;
            }

            // Verificar si el email ya está registrado
            if (registeredUsers.some(user => user.email === email)) {
                notyf.error('Este email ya está registrado. Por favor, inicia sesión o usa otro email.');
                return;
            }
            // Verificar si el nombre de usuario ya está en uso
            if (registeredUsers.some(user => user.username === username)) {
                notyf.error('Este nombre de usuario ya está en uso. Elige otro.');
                return;
            }
            // Mostrar el estado de carga
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registrando...';
            
            // Simular el llamado a la API para el registro
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Registro exitoso
                currentUser = {
                    name: name,
                    username: username,
                    email: email,
                    password: password, 
                    userType: userType,
                    photoUrl: 'https://placehold.co/40x40/cccccc/ffffff/png?text=User' // Asignar una foto por defecto al registrarse
                };

                // Añadir el nuevo usuario al array de usuarios registrados
                registeredUsers.push(currentUser);
                // Guardar el array actualizado en localStorage
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                localStorage.setItem('authToken', 'demo-token-xyz');
                localStorage.setItem('userType', userType);
                localStorage.setItem('userName', currentUser.name); 
                localStorage.setItem('userName', currentUser.username);
                localStorage.setItem('userEmail', currentUser.email); 
                localStorage.setItem('userPhotoUrl', currentUser.photoUrl); // ¡Guardar la URL de la foto!
                
                notyf.success('¡Registro exitoso!');
                hideAuthModal();
                showDashboard();
            }, 1000);
        }

        function logout() {
            currentUser = null;
            userType = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('userType');
            localStorage.removeItem('userName'); 
            localStorage.removeItem('userEmail'); 
            localStorage.removeItem('userPhotoUrl'); // ¡Eliminar la URL de la foto al cerrar sesión!
            
            navButtons.classList.remove('hidden');
            document.getElementById('user-nav').classList.add('hidden'); 
            
            homePage.classList.remove('hidden'); 
            dashboard.classList.add('hidden');
            subscriptionPage.classList.add('hidden');
            
            notyf.success('Has cerrado sesión.');
        }

        function showDashboard() {
            homePage.classList.add('hidden');
            subscriptionPage.classList.add('hidden');
            dashboard.classList.remove('hidden');
            
            // Actualizar la navegacion
            navButtons.classList.add('hidden');
            document.getElementById('user-nav').classList.remove('hidden'); 
            userNav.textContent = currentUser.username; 
            
            // Asegúrate de que userProfilePicture no sea null antes de usarlo
            if (userProfilePicture && currentUser.photoUrl) {
                userProfilePicture.src = currentUser.photoUrl; // ¡Mostrar la foto de perfil!
            } else if (userProfilePicture) {
                // Fallback a un placeholder si no hay photoUrl
                userProfilePicture.src = 'https://placehold.co/40x40/cccccc/ffffff/png?text=User'; 
            }
            
            // Configurar la barra lateral segun el tipo de usuario
            setupSidebar();
            
            // Mostrar el formulario de perfil apropiado
            showProfileForm(); 
        }

        // NUEVAS FUNCIONES PARA EL DASHBOARD Y NAVEGACIÓN (ya existentes, no modificadas)
        function showPage(id) {
            document.querySelectorAll('#dashboard > div > div.md\\:w-4\\/5 > div').forEach(p => p.classList.add('hidden'));
        
            const targetElement = document.getElementById(id);
            if (targetElement) {
                targetElement.classList.remove('hidden');
                // Actualizar email en configuración
            if (id === 'settings') {
                const emailInput = document.getElementById('setting-email');
                if (emailInput && currentUser && currentUser.email) {
                    emailInput.value = currentUser.email;
                }
            }
            // Autocompletar nombre en perfil de jugador
            if (id === 'player-profile' && currentUser && currentUser.name) {
                const nameInput = document.getElementById('player-name');
                if (nameInput) {
                    nameInput.value = currentUser.name;
                }
            }
            if (id === 'club-profile' && currentUser && currentUser.name) {
                const nameInput = document.getElementById('club-name');
                if (nameInput) {
                    nameInput.value = currentUser.name;
                }
            }
            if (id === 'agent-profile' && currentUser && currentUser.name) {
                const nameInput = document.getElementById('agent-name');
                if (nameInput) {
                    nameInput.value = currentUser.name;
                }
            }
            if (id === 'player-profile' && currentUser && currentUser.photoUrl) {
                const preview = document.getElementById('player-photo-preview');
                if (preview) {
                    preview.innerHTML = `<img src="${currentUser.photoUrl}" class="w-full h-full object-cover rounded-full">`;
                }
            }
            if (id === 'club-profile' && currentUser && currentUser.photoUrl) {
                const preview = document.getElementById('club-logo-preview');
                if (preview) {
                    preview.innerHTML = `<img src="${currentUser.photoUrl}" class="w-full h-full object-cover rounded-full">`;
                }
            }
            if (id === 'agent-profile' && currentUser && currentUser.photoUrl) {
                const preview = document.getElementById('agent-photo-preview');
                if (preview) {
                    preview.innerHTML = `<img src="${currentUser.photoUrl}" class="w-full h-full object-cover rounded-full">`;
                }
            }

            } else {
                console.warn(`Elemento con ID "${id}" no encontrado. Asegúrate de que existe en tu HTML.`);
            }
        }

        function setupSidebar() {
            sidebarNav.innerHTML = ''; 

            let sidebarLinksHtml = '';
            if (userType === 'player') {
                sidebarLinksHtml = `
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="player-profile"><i class="fas fa-user mr-2"></i> Mi perfil</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="club-search"><i class="fas fa-shield-alt mr-2"></i> Buscar clubes</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="agent-search"><i class="fas fa-briefcase mr-2"></i> Buscar representantes</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="messages"><i class="fas fa-envelope mr-2"></i> Mensajes</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="settings"><i class="fas fa-cog mr-2"></i> Configuración</a></li>
                `;
            } else if (userType === 'club') {
                sidebarLinksHtml = `
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="club-profile"><i class="fas fa-shield-alt mr-2"></i> Perfil del club</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="player-search"><i class="fas fa-user mr-2"></i> Buscar jugadores</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="agent-search"><i class="fas fa-briefcase mr-2"></i> Buscar representantes</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="messages"><i class="fas fa-envelope mr-2"></i> Mensajes</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="settings"><i class="fas fa-cog mr-2"></i> Configuración</a></li>
                `;
            } else if (userType === 'agent') {
                sidebarLinksHtml = `
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="agent-profile"><i class="fas fa-briefcase mr-2"></i> Mi perfil</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="player-search"><i class="fas fa-user mr-2"></i> Buscar jugadores</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="club-search"><i class="fas fa-shield-alt mr-2"></i> Buscar clubes</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="messages"><i class="fas fa-envelope mr-2"></i> Mensajes</a></li>
                    <li><a href="javascript:void(0)" class="block px-4 py-2 rounded hover:bg-gray-100 sidebar-link" data-page="settings"><i class="fas fa-cog mr-2"></i> Configuración</a></li>
                `;
            }
            sidebarNav.innerHTML = sidebarLinksHtml;

            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.addEventListener('click', function() {
                    const page = this.getAttribute('data-page');
                    showPage(page);
                });
            });

            showProfileForm(); 
        }

        function showProfileForm() {
            showPage(userType + '-profile');
        }

        function handleProfileSubmit(e) {
            e.preventDefault();
            notyf.success('¡Perfil guardado exitosamente!');
            console.log('Profile saved!');

            // Simulación: Si se sube una foto en el perfil, actualiza la foto del usuario actual
            // Esto es muy básico; en un entorno real, la URL de la imagen se guardaría en el backend.
            let photoInput;
            let photoPreview;

            if (userType === 'player') {
                photoInput = document.getElementById('player-photo');
                photoPreview = document.getElementById('player-photo-preview');
                newUsername = document.getElementById('player-username').value;
            } else if (userType === 'club') {
                photoInput = document.getElementById('club-logo');
                photoPreview = document.getElementById('club-logo-preview');
                newUsername = document.getElementById('club-username').value;
            } else if (userType === 'agent') {
                photoInput = document.getElementById('agent-photo');
                photoPreview = document.getElementById('agent-photo-preview');
                newUsername = document.getElementById('agent-username').value;
            }
           if (newUsername && currentUser.username !== newUsername) {
                currentUser.username = newUsername;
                const userIndex = registeredUsers.findIndex(u => u.email === currentUser.email);
                if (userIndex !== -1) {
                    registeredUsers[userIndex].username = newUsername;
                    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                }
                localStorage.setItem('userUsername', newUsername);
            }

            // 3. Actualizar el navbar
            if (userNav && currentUser.username) {
                userNav.textContent = currentUser.username;
            }

            if (photoInput && photoInput.files && photoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newPhotoUrl = e.target.result;
                    if (currentUser) {
                        currentUser.photoUrl = newPhotoUrl;
                        localStorage.setItem('userPhotoUrl', newPhotoUrl);
                        // También actualizar el usuario en registeredUsers si lo tienes en localStorage
                        const userIndex = registeredUsers.findIndex(u => u.email === currentUser.email);
                        if (userIndex !== -1) {
                            registeredUsers[userIndex].photoUrl = newPhotoUrl;
                            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                        }
                        // Actualizar la foto en el navbar inmediatamente
                        if (userProfilePicture) {
                            userProfilePicture.src = newPhotoUrl;
                        }
                    }
                };
                reader.readAsDataURL(photoInput.files[0]);
            }
        }

        function handleSearchSubmit(e) {
            e.preventDefault();
            notyf.success('Buscando...');
            console.log('Searching...');
            const resultsContainer = e.target.closest('div').querySelector('.grid');
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="bg-gray-100 p-4 rounded-lg shadow-sm text-center card-hover">
                        <img src="https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg" alt="Result" class="w-24 h-24 rounded-full mx-auto mb-2 object-cover">
                        <h4 class="font-bold text-lg">Resultado Ficticio 1</h4>
                        <p class="text-gray-600 text-sm">Descripción breve del resultado.</p>
                        <button class="mt-3 bg-football text-white text-sm px-4 py-2 rounded">Ver Detalles</button>
                    </div>
                    <div class="bg-gray-100 p-4 rounded-lg shadow-sm text-center card-hover">
                        <img src="https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 100)}.jpg" alt="Result" class="w-24 h-24 rounded-full mx-auto mb-2 object-cover">
                        <h4 class="font-bold text-lg">Resultado Ficticio 2</h4>
                        <p class="text-gray-600 text-sm">Descripción breve del resultado.</p>
                        <button class="mt-3 bg-football text-white text-sm px-4 py-2 rounded">Ver Detalles</button>
                    </div>
                `;
            }
        }

        function setupRangeSlider(minSliderId, maxSliderId, minTextId, maxTextId) {
            const minSlider = document.getElementById(minSliderId);
            const maxSlider = document.getElementById(maxSliderId);
            const minValue = document.getElementById(minTextId);
            const maxValue = document.getElementById(maxTextId);

            if (!minSlider || !maxSlider || !minValue || !maxValue) return;

            minValue.textContent = minSlider.value;
            maxValue.textContent = maxSlider.value;

            minSlider.addEventListener('input', () => {
                if (parseInt(minSlider.value) > parseInt(maxSlider.value)) {
                    minSlider.value = maxSlider.value;
                }
                minValue.textContent = minSlider.value;
            });

            maxSlider.addEventListener('input', () => {
                if (parseInt(maxSlider.value) < parseInt(minSlider.value)) {
                    maxSlider.value = minSlider.value;
                }
                maxValue.textContent = maxSlider.value;
            });
        }

        function setupFileUploadPreview(inputId, previewId) {
            const input = document.getElementById(inputId);
            const preview = document.getElementById(previewId);
            
            if (!input || !preview) return;
            
            input.addEventListener('change', function() {
                if (input.files && input.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover rounded-full">`;
                    };
                    
                    reader.readAsDataURL(input.files[0]);
                } else {
                    // Restaurar el ícono predeterminado si no se selecciona ningún archivo
                    if (inputId === 'player-photo') {
                        preview.innerHTML = '<i class="fas fa-user text-4xl text-gray-400"></i>';
                    } else if (inputId === 'club-logo') {
                        preview.innerHTML = '<i class="fas fa-shield-alt text-4xl text-gray-400"></i>';
                    } else if (inputId === 'agent-photo') {
                        preview.innerHTML = '<i class="fas fa-user-tie text-4xl text-gray-400"></i>';
                    }
                }
            });
        }

        // Check if user is already logged in (from localStorage)
        function checkAuthState() {
            const token = localStorage.getItem('authToken');
            if (token) {
                userType = localStorage.getItem('userType') || 'player';
                const storedUserName = localStorage.getItem('userName'); // nombre de usuario
                const storedUserEmail = localStorage.getItem('userEmail');
                const storedUserPhotoUrl = localStorage.getItem('userPhotoUrl');

                // Buscar el usuario completo en registeredUsers para obtener el nombre real y username
                const userData = registeredUsers.find(u => u.email === storedUserEmail);
                currentUser = userData ? {...userData} : {
                    username: storedUserName || 'DemoUser',
                    name: '',
                    email: storedUserEmail || 'demo@example.com',
                    photoUrl: storedUserPhotoUrl || 'https://placehold.co/40x40/cccccc/ffffff/png?text=User'
                };
                showDashboard();
            } else {
                homePage.classList.remove('hidden');
                dashboard.classList.add('hidden');
                subscriptionPage.classList.add('hidden');
                navButtons.classList.remove('hidden'); 
                document.getElementById('user-nav').classList.add('hidden'); 
            }
        }

        // Call this on page load
        checkAuthState();