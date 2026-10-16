'use strict';
/**
 * Staging-only account experience.
 * Passwords and sessions are handled by Managed Better Auth on Neon.
 * Do not mirror the password or session token into localStorage, analytics or logs.
 * NOTE: SameSite/third-party cookie behavior still requires genuine browser testing.
 */
(function () {
    const cfg = window.MUSCLE_MAP_ACCOUNT_CONFIG || {};
    if (!/^https:\/\/[a-z0-9.-]+\/[a-z0-9_/-]+$/i.test(cfg.authUrl || '')) {
        return showBootError();
    }

    const translations = {
        ru: {
            back:'Вернуться к Muscle Map',testLabel:'ТЕСТОВЫЙ ВХОД · НЕ PRODUCTION',
            title:'Ваш аккаунт Muscle Map',
            lead:'Войдите, чтобы в будущем синхронизировать подписку и тренировки между устройствами.',
            notice:'Существующие Premium-подписки пока НЕ привязываются автоматически. Текущий дневник остаётся на устройстве.',
            login:'Войти',register:'Регистрация',name:'Ваше имя',email:'Электронная почта',
            password:'Пароль', signedIn:'Вы вошли в Muscle Map', premium:'Premium',
            notConnected:'Проверка подписки станет доступна после подключения защищённого backend.',
            claimWarn:'Если у вас уже была подписка Premium, она останется у прежнего аккаунта до подтверждения владения через платёжного провайдера.',
            logout:'Выйти из аккаунта',
            privacy:'Пароль передаётся только сервису Neon Auth. Он не записывается в Muscle Map, localStorage или аналитику.',
            busy:'Отправляем запрос…',missing:'Заполните обязательные поля. Пароль должен содержать минимум 8 символов.',
            signing:'Проверяем сессию…',created:'Аккаунт создан. Войдите, если сессия не открылась автоматически.',
            loggedOut:'Вы вышли из аккаунта.', unknown:'Не получилось войти. Проверьте данные или попробуйте позднее.',
            noSession:'Сессия не сохранилась. Проверьте разрешение cookie для сервиса Neon Auth в этом браузере.',
            apiError:'Сервис авторизации недоступен. Попробуйте позднее.',
            premiumActive:'Premium активен до',premiumFree:'Premium не активен',
            verifyTitle:'Подтвердите электронную почту',verifyHint:'Мы отправим одноразовый код на указанный адрес. Введите его ниже.',
            verifyCode:'Код из письма',verifyAction:'Подтвердить адрес',verifyResend:'Отправить код повторно',verifyBack:'Вернуться ко входу',
            verifySent:'Новый код запрошен. Используйте только последнее письмо.',verifySuccess:'Адрес подтверждён. Теперь можно войти.',
            openVerify:'Подтвердить e-mail с кодом',
            verifyAwait:'Проверьте почту. Если кода нет, нажмите «Отправить код повторно».',
            verifyInvalid:'Неверный или устаревший код. Проверьте последнее письмо.',
            verifyExpired:'Срок действия кода истёк. Запросите новый код.',
            verifyLimit:'Превышено число попыток. Запросите новый код позже.',
            verifyFailed:'Не удалось проверить код.'
        },
        en: {
            back:'Back to Muscle Map',testLabel:'STAGING SIGN-IN · NOT PRODUCTION',
            title:'Your Muscle Map account',
            lead:'Sign in to eventually sync your subscription and workouts across devices.',
            notice:'Existing Premium subscriptions are NOT automatically linked. Workout history stays on this device.',
            login:'Sign in',register:'Create account',name:'Your name',email:'Email',
            password:'Password',signedIn:'You are signed in',premium:'Premium',
            notConnected:'Subscription status will be available once the secured backend is connected.',
            claimWarn:'Your existing Premium subscription remains with its original account until independent payment ownership is verified.',
            logout:'Sign out',
            privacy:'Your password goes directly to Neon Auth. It is not saved in Muscle Map, localStorage or analytics.',
            busy:'Sending request…',missing:'Fill in all required fields. Password must be at least 8 characters.',
            signing:'Checking session…',created:'Account created. Sign in if no session was opened automatically.',
            loggedOut:'You are signed out.',unknown:'Sign-in failed. Check your credentials or try again later.',
            noSession:'Session cookie not available. Check browser permissions for Neon Auth cookies.',
            apiError:'The authentication service could not be reached. Please try again later.',
            premiumActive:'Premium active until',premiumFree:'Premium inactive',
            verifyTitle:'Verify your email',verifyHint:'We will send a one-time code to your email. Enter it below.',
            verifyCode:'Email code',verifyAction:'Verify email',verifyResend:'Resend code',verifyBack:'Back to sign-in',
            verifySent:'A new code was requested. Use the most recent email only.',verifySuccess:'Email verified. You can sign in now.',
            openVerify:'Verify email with a code',
            verifyAwait:'Check your inbox. If no code arrived, press “Resend code”.',
            verifyInvalid:'Incorrect or outdated code. Check the latest email.',
            verifyExpired:'The code has expired. Request a new one.',
            verifyLimit:'Too many attempts. Request a new code later.',
            verifyFailed:'Could not verify the code.'
        }
    };
    let savedLang = '';
    try { savedLang = localStorage.getItem('muscleMap_lang') || ''; } catch {}
    const lang = (new URLSearchParams(location.search).get('lang') || savedLang || navigator.language || 'ru')
        .toLowerCase().startsWith('en') ? 'en' : 'ru';
    const t = (k) => translations[lang][k] || k;
    document.documentElement.lang = lang;
    for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
    document.title = lang === 'en' ? 'Account | Muscle Map staging' : 'Аккаунт | Muscle Map тест';

    const byId = id => document.getElementById(id);
    const guest = byId('authGuest'), member = byId('authMember'), verify = byId('authVerify');
    const form = byId('authForm'), button = byId('authSubmit');
    const nameLabel = byId('nameLabel'), password = byId('accountPassword');
    const messageBox = byId('accountMessage');
    let mode = 'login', busy = false;

    function showBootError() {
        const el = document.getElementById('accountMessage');
        if (el) { el.textContent = 'Authentication configuration is unavailable'; el.classList.remove('hidden'); el.classList.add('error'); }
    }
    function message(str, isError = false) {
        if (!str) { messageBox.classList.add('hidden'); return; }
        messageBox.textContent = str;
        messageBox.classList.toggle('error', isError);
        messageBox.classList.remove('hidden');
    }
    function setBusy(value) {
        busy = value;
        button.disabled = value;
        byId('authLogout').disabled = value;
        button.textContent = value ? t('busy') : t(mode === 'login' ? 'login' : 'register');
    }
    function selectMode(next) {
        if (busy) return;
        mode = next === 'register' ? 'register' : 'login';
        nameLabel.classList.toggle('hidden', mode !== 'register');
        byId('accountName').required = mode === 'register';
        password.autocomplete = mode === 'register' ? 'new-password' : 'current-password';
        for (const tab of document.querySelectorAll('[data-mode]')) {
            const active = tab.dataset.mode === mode;
            tab.classList.toggle('selected', active);
            tab.setAttribute('aria-selected', String(active));
        }
        button.textContent = t(mode === 'login' ? 'login' : 'register');
        message('');
    }
    function showVerification(email) {
        member.classList.add('hidden');
        guest.classList.add('hidden');
        verify.classList.remove('hidden');
        byId('verifyEmail').value = email || byId('accountEmail').value.trim().toLowerCase();
        byId('verifyOtp').value = '';
        message('');
    }
    async function sendVerificationCode() {
        const email = byId('verifyEmail').value.trim().toLowerCase();
        if (!byId('verifyEmail').reportValidity()) return;
        const control = byId('verifyResend');
        control.disabled = true;
        try {
            await authRequest('/email-otp/send-verification-otp','POST',{ email, type:'email-verification' });
            message(t('verifySent'));
        } catch (err) {
            message(err.message || t('apiError'), true);
        } finally { control.disabled = false; }
    }
    async function authRequest(endpoint, method = 'GET', body) {
        const url = cfg.authUrl.replace(/\/$/, '') + endpoint;
        const headers = { Accept: 'application/json' };
        if (body) headers['Content-Type'] = 'application/json';
        let res;
        try {
            res = await fetch(url, {
                method,
                credentials: 'include',
                mode: 'cors',
                cache: 'no-store',
                headers,
                body: body ? JSON.stringify(body) : undefined
            });
        } catch {
            throw new Error(t('apiError'));
        }
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok) {
            // Avoid reflecting uncontrolled provider response into the page.
            const rawCode = typeof data?.code === 'string' ? data.code : data?.error?.code;
            const code = typeof rawCode === 'string' && /^[A-Z0-9_]{2,64}$/.test(rawCode) ? rawCode : '';
            if (code === 'EMAIL_NOT_VERIFIED') throw new Error('EMAIL_NOT_VERIFIED');
            if (endpoint === '/email-otp/verify-email') {
                const messageKey = code === 'TOO_MANY_ATTEMPTS' ? 'verifyLimit' :
                    /EXPIRED/.test(code) ? 'verifyExpired' :
                    /INVALID|NOT_FOUND|OTP/.test(code) ? 'verifyInvalid' : 'verifyFailed';
                throw new Error(t(messageKey) + ' (HTTP ' + res.status + (code ? ', ' + code : '') + ')');
            }
            if (endpoint === '/email-otp/send-verification-otp') {
                throw new Error(t('apiError') + ' (HTTP ' + res.status + (code ? ', ' + code : '') + ')');
            }
            if (res.status === 401 || res.status === 403 || res.status === 400) throw new Error(t('unknown'));
            if (res.status === 429) throw new Error('Too many requests. Please try again later.');
            throw new Error(t('apiError'));
        }
        return data;
    }
    async function refreshSession() {
        const data = await authRequest('/get-session');
        const user = data && data.user;
        const authenticated = Boolean(user && typeof user.id === 'string');
        if (authenticated && cfg.emailVerificationRequired === true && user.emailVerified === false) {
            showVerification(user.email || '');
            return false;
        }
        guest.classList.toggle('hidden', authenticated);
        member.classList.toggle('hidden', !authenticated);
        if (authenticated) {
            byId('accountIdentity').textContent = user.email || user.name || t('signedIn');
            byId('accountPremium').textContent = t('notConnected');
            if (cfg.enableBackendPremium === true) {
                // JWT is short lived; it is NEVER persisted by this client.
                // Only the server uses verified JWT claims as the owner identity.
                try {
                    // Staging tokens must never be sent to the LIVE backend,
                    // even if the feature flag is accidentally turned on.
                    const endpoint = typeof cfg.apiUrl === 'string'
                        ? new URL(cfg.apiUrl) : null;
                    if (!endpoint ||
                        !(endpoint.protocol === 'https:' ||
                          (endpoint.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(endpoint.hostname))) ||
                        endpoint.username || endpoint.password || endpoint.search || endpoint.hash ||
                        (cfg.stage === 'staging' && endpoint.hostname === 'muscle-map-backend.onrender.com')) {
                        throw new Error('Missing or unsafe staging Premium API endpoint');
                    }
                    const token = await authRequest('/token');
                    if (typeof token?.token === 'string') {
                        const res = await fetch(endpoint.origin + '/api/v2/me/premium', {
                            headers: { Authorization: 'Bearer ' + token.token },
                            cache: 'no-store',
                            redirect: 'error'
                        });
                        if (res.ok) {
                            const status = await res.json();
                            const date = status.expiresAt ? new Date(status.expiresAt) : null;
                            byId('accountPremium').textContent = status.premium &&
                                date && Number.isFinite(date.getTime())
                                ? t('premiumActive') + ' ' + date.toLocaleDateString(lang)
                                : (status.premium === false ? t('premiumFree') : t('notConnected'));
                        }
                    }
                } catch {
                    byId('accountPremium').textContent = t('notConnected');
                }
            }
        }
        return authenticated;
    }

    document.querySelectorAll('[data-mode]').forEach(tab => {
        tab.addEventListener('click', () => selectMode(tab.dataset.mode));
    });
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (busy) return;
        if (!form.reportValidity() || password.value.length < 8) {
            message(t('missing'), true);
            return;
        }
        const email = byId('accountEmail').value.trim().toLowerCase();
        const pass = password.value;
        const displayName = byId('accountName').value.trim();
        if (mode === 'register' && displayName.length < 2) {
            message(t('missing'), true);
            return;
        }
        setBusy(true);
        message('');
        try {
            if (mode === 'register') {
                await authRequest('/sign-up/email', 'POST', { name: displayName, email, password: pass });
                password.value = '';
                const hasSession = await refreshSession();
                if (!hasSession) {
                    setBusy(false);
                    if (cfg.emailVerificationRequired === true) {
                        showVerification(email);
                        message(t('verifyAwait'));
                    } else {
                        selectMode('login');
                        message(t('created'));
                    }
                }
            } else {
                await authRequest('/sign-in/email', 'POST', { email, password: pass });
                password.value = '';
                if (!await refreshSession()) message(t('noSession'), true);
            }
        } catch (err) {
            password.value = '';
            if (err.message === 'EMAIL_NOT_VERIFIED') {
                showVerification(email);
                message(t('verifyAwait'));
            } else {
                message(err.message || t('unknown'), true);
            }
        } finally {
            setBusy(false);
        }
    });
    byId('authOpenVerify').addEventListener('click', () => {
        if (busy) return;
        showVerification(byId('accountEmail').value.trim().toLowerCase());
        message(t('verifyAwait'));
    });
    byId('verifyResend').addEventListener('click', () => { void sendVerificationCode(); });
    byId('verifyBack').addEventListener('click', () => {
        verify.classList.add('hidden');
        guest.classList.remove('hidden');
        selectMode('login');
    });
    byId('verifyForm').addEventListener('submit', async event => {
        event.preventDefault();
        if (busy || !byId('verifyForm').reportValidity()) return;
        const email = byId('verifyEmail').value.trim().toLowerCase();
        const otp = byId('verifyOtp').value.trim();
        if (!/^[0-9]{4,10}$/.test(otp)) { message(t('unknown'), true); return; }
        const button = byId('verifySubmit');
        button.disabled = true;
        try {
            await authRequest('/email-otp/verify-email','POST',{email,otp});
            byId('verifyOtp').value = '';
            verify.classList.add('hidden');
            guest.classList.remove('hidden');
            selectMode('login');
            byId('accountEmail').value = email;
            message(t('verifySuccess'));
        } catch (err) { message(err.message || t('apiError'), true); }
        finally { button.disabled = false; }
    });
    byId('authLogout').addEventListener('click', async () => {
        if (busy) return;
        setBusy(true);
        try {
            await authRequest('/sign-out', 'POST', {});
            member.classList.add('hidden');
            guest.classList.remove('hidden');
            message(t('loggedOut'));
        } catch (err) {
            message(err.message || t('apiError'), true);
        } finally { setBusy(false); }
    });

    message(t('signing'));
    refreshSession().then(() => message('')).catch(err => message(err.message || t('apiError'), true));
})();
