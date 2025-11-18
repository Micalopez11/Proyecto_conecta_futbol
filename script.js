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

        // Seleccion del tipo de usuario en registro
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

        
        async function handleLogin(e) {
            e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) { notyf.error('Por favor, ingresa credenciales.'); return; }

  const submitBtn = loginForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true; submitBtn.textContent = 'Iniciando sesión...';

  const { data, error } = await window.supabase.auth.signInWithPassword({
    email,
    password
  });

  submitBtn.disabled = false; submitBtn.textContent = 'Iniciar sesión';

  if (error) {
    notyf.error('Error de login: ' + error.message);
    return;
  }

  // data.session contiene info; data.user tiene id
  const user = data.user;
  // Cargar profile
  const { data: profiles, error: pErr } = await window.supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (pErr && pErr.code !== 'PGRST116') { // si hay error inesperado
    notyf.error('No se pudo cargar el perfil: ' + pErr.message);
    return;
  }

  // Establecer currentUser en memoria con la info del profile
  currentUser = Object.assign({}, profiles || {}, { email: user.email, id: user.id });
  userType = currentUser.user_type;
  // Guardar en localStorage lo mínimo (opcional, Supabase mantiene sesión via cookies)
  localStorage.setItem('authToken', 'supabase-session'); 
  localStorage.setItem('userType', userType);
  localStorage.setItem('userName', currentUser.username || currentUser.full_name || '');
  localStorage.setItem('userEmail', currentUser.email || '');

  notyf.success('Inicio de sesión correcto');
  hideAuthModal();
  showDashboard();
}



async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById('register-name').value;
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  // Detectar el tipo de usuario
  const userType = document.querySelector('input[name="user-type"]:checked')?.value;

  if (!userType) { notyf.error('Selecciona un tipo de usuario.'); return; }
  if (password !== confirmPassword) { notyf.error('Las contraseñas no coinciden.'); return; }

  const submitBtn = registerForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true; 
  submitBtn.textContent = 'Registrando...';

  // 1️⃣ Crear cuenta en Supabase Auth
  const { data: signUpData, error: signUpError } = await window.supabase.auth.signUp({
    email,
    password
  });

  if (signUpError) {
    console.error(signUpError);
    notyf.error('Error creando usuario: ' + signUpError.message);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Registrarse';
    return;
  }

  // 2️⃣ Insertar datos en la tabla "profiles"
  const userId = signUpData.user.id;

  const { error: insertError } = await window.supabase
    .from("profiles")
    .insert([
      {
        id: userId,        // ⚠️ IMPORTANTE: debe coincidir con el ID de auth.users
        full_name: name,
        username: username,
        email: email,
        user_type: userType
      }
    ]);

  if (insertError) {
    console.error(insertError);
    notyf.error('Error guardando datos del perfil');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Registrarse';
    return;
  }

  // 3️⃣ Registro exitoso
  notyf.success('Registro exitoso. ¡Bienvenido!');
  submitBtn.textContent = 'Completado';

  // Opcional: Redirigir al login
  //setTimeout(() => {
  //  window.location.href = 'login.html';
 // }, 1500);
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

        

        async function handleProfileSubmit(e) {
  e.preventDefault();
  notyf.success('Guardando perfil...');

  // Determinar campos según userType
  let payload = {};
  if (userType === 'player') {
    payload.username = document.getElementById('player-username').value;
    payload.age = parseInt(document.getElementById('player-age').value) || null;
    payload.height_cm = parseInt(document.getElementById('player-height').value) || null;
    payload.weight_kg = parseInt(document.getElementById('player-weight').value) || null;
    payload.preferred_positions = Array.from(document.querySelectorAll('.player-position:checked')).map(i => i.value);
    payload.dominant_foot = document.querySelector('input[name="dominant-foot"]:checked').value;
    payload.location = document.getElementById('player-location').value;
    payload.experience = document.getElementById('player-experience').value;
  }
  // Añade club/agent fields según corresponda (club-username, agent-region, etc.)

  // 1) Si file seleccionado, subir a Storage
  const photoInput = (userType === 'player') ? document.getElementById('player-photo') :
                     (userType === 'club') ? document.getElementById('club-logo') :
                     document.getElementById('agent-photo');
  if (photoInput && photoInput.files && photoInput.files[0]) {
    const file = photoInput.files[0];
    const filename = `${currentUser.id}/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadErr } = await window.supabase
      .storage.from('avatars')
      .upload(filename, file, { cacheControl: '3600', upsert: false });

    if (uploadErr) {
      notyf.error('Error subiendo la imagen: ' + uploadErr.message);
      return;
    }
    // Obtener URL pública (si bucket público)
    const { data: publicUrlData } = window.supabase.storage.from('avatars').getPublicUrl(uploadData.path);
    payload.photo_url = publicUrlData.publicUrl;
  }

  payload.updated_at = new Date().toISOString();

  // 2) Update en la tabla profiles (usa auth.uid() == id)
  const { data: updated, error: updateErr } = await window.supabase
    .from('profiles')
    .upsert([{ id: currentUser.id, ...payload }], { returning: 'representation' });

  if (updateErr) {
    notyf.error('Error guardando perfil: ' + updateErr.message);
    return;
  }

  // Actualizar currentUser y UI
  currentUser = { ...currentUser, ...updated[0] };
  if (currentUser.photo_url && userProfilePicture) userProfilePicture.src = currentUser.photo_url;

  notyf.success('Perfil guardado correctamente.');
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

        // Verifica si el usuario esta logueado (con supabase)
async function checkAuthState() {
  try {
    // 1️⃣ Consultar si existe una sesión activa
    const { data: { session }, error } = await window.supabase.auth.getSession();

    if (error) {
      console.error('Error obteniendo sesión:', error.message);
    }

    // 2️⃣ Si hay sesión activa (usuario autenticado)
    if (session && session.user) {
      const user = session.user;

      // 3️⃣ Buscar el perfil del usuario en la tabla "profiles"
      const { data: profile, error: profileError } = await window.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error cargando perfil:', profileError.message);
        notyf.error('No se pudo cargar tu perfil.');
        return;
      }

      // 4️⃣ Guardar el usuario actual en memoria
      currentUser = {
        ...profile,
        email: user.email,
        id: user.id,
      };
      userType = profile.user_type;

      // 5️⃣ Mostrar el dashboard del usuario
      showDashboard();

      // 6️⃣ Actualizar la foto y el nombre en la interfaz si existen
      if (currentUser.photo_url && userProfilePicture) {
        userProfilePicture.src = currentUser.photo_url;
      }
      if (userProfileName) {
        userProfileName.textContent = currentUser.full_name || currentUser.username || '';
      }

    } else {
      // 7️⃣ Si no hay sesión, volver al inicio
      homePage.classList.remove('hidden');
      dashboard.classList.add('hidden');
      subscriptionPage.classList.add('hidden');
      navButtons.classList.remove('hidden');
      document.getElementById('user-nav').classList.add('hidden');
    }
  } catch (err) {
    console.error('Error en checkAuthState:', err);
  }
}

        // Call this on page load
        checkAuthState();

const { data, error } = await supabase.auth.signUp({
  email,
  password,
});
