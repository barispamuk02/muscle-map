'use strict';
/**
 * Account experience for isolated STAGING and explicitly approved PRODUCTION.
 * Passwords and sessions are handled by Managed Better Auth on Neon.
 * Do not mirror the password or session token into localStorage, analytics or logs.
 * NOTE: SameSite/third-party cookie behavior still requires genuine browser testing.
 */
(function () {
    const cfg = window.MUSCLE_MAP_ACCOUNT_CONFIG || {};
    // Fail closed: accidental publication of the Draft STAGING config must
    // NEVER submit sign-in credentials from the public production domain.
    const prodAuth = 'https://ep-muddy-rice-b1y5qbz8.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth';
    const stagingAuth = 'https://ep-summer-recipe-b1qi9f29.neonauth.c-5.eu-central-1.aws.neon.tech/neondb/auth';
    const prodApi = 'https://muscle-map-backend.onrender.com';
    const stagingApi = 'https://muscle-map-backend-staging.onrender.com';
    const isProductionHost = ['muscle-map.app', 'www.muscle-map.app'].includes(location.hostname.toLowerCase());
    const validConfiguration = (cfg.stage === 'production' && cfg.authUrl === prodAuth && cfg.apiUrl === prodApi) ||
        (cfg.stage === 'staging' && cfg.authUrl === stagingAuth && cfg.apiUrl === stagingApi && !isProductionHost);
    if (!validConfiguration) {
        return showBootError();
    }

    const translations = {
        ru: {
            back:'Вернуться к Muscle Map',testLabel:'ТЕСТОВЫЙ ВХОД · НЕ PRODUCTION',
            title:'Ваш аккаунт Muscle Map',
            lead:'Войдите, чтобы проверить подписку Premium. Дневник тренировок пока хранится на этом устройстве.',
            notice:'Существующие Premium-подписки пока НЕ привязываются автоматически. Текущий дневник остаётся на устройстве.',
            login:'Войти',register:'Регистрация',name:'Ваше имя',email:'Электронная почта',
            password:'Пароль', signedIn:'Вы вошли в Muscle Map', premium:'Premium',
            notConnected:'Проверка подписки пока недоступна.',
            premiumChecking:'Проверяем Premium…',premiumError:'Не удалось проверить Premium. Обновите страницу позже.',
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
            forgotPassword:'Забыли пароль?',resetTitle:'Восстановление пароля',
            resetHint:'Получите код на свою почту и установите новый пароль.',
            resetSend:'Отправить код',resetCode:'Код восстановления',
            resetNewPassword:'Новый пароль',resetRepeatPassword:'Повторите новый пароль',
            resetAction:'Изменить пароль',resetSent:'Если аккаунт существует, новый код отправлен. Используйте последнее письмо.',
            resetMismatch:'Пароли не совпадают или слишком короткие (минимум 12 символов).',
            resetSuccess:'Пароль изменён. Войдите с новым паролем.',
            resetError:'Не удалось изменить пароль. Проверьте новый код из последнего письма.',
            verifyAwait:'Проверьте почту. Если кода нет, нажмите «Отправить код повторно».',
            verifyInvalid:'Неверный или устаревший код. Проверьте последнее письмо.',
            verifyExpired:'Срок действия кода истёк. Запросите новый код.',
            verifyLimit:'Превышено число попыток. Запросите новый код позже.',
            verifyFailed:'Не удалось проверить код.',
            sendMailTest:'Отправить тестовое письмо',mailTestHint:'Только на ваш подтверждённый адрес, один раз в сутки. Не влияет на Premium.',
            mailTestSuccess:'Тестовое письмо принято к отправке. Проверьте почту.',mailTestLimit:'Проверка доступна один раз за 24 часа.',mailTestError:'Не удалось отправить тестовое письмо. Проверьте настройки Resend.'
        },
        en: {
            back:'Back to Muscle Map',testLabel:'STAGING SIGN-IN · NOT PRODUCTION',
            title:'Your Muscle Map account',
            lead:'Sign in to check your Premium subscription. Workout history currently stays on this device.',
            notice:'Existing Premium subscriptions are NOT automatically linked. Workout history stays on this device.',
            login:'Sign in',register:'Create account',name:'Your name',email:'Email',
            password:'Password',signedIn:'You are signed in',premium:'Premium',
            notConnected:'Subscription status is not available yet.',
            premiumChecking:'Checking Premium…',premiumError:'Could not check Premium. Please reload later.',
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
            forgotPassword:'Forgot password?',resetTitle:'Reset password',
            resetHint:'Receive a code by email and choose a new password.',
            resetSend:'Send recovery code',resetCode:'Recovery code',
            resetNewPassword:'New password',resetRepeatPassword:'Repeat new password',
            resetAction:'Reset password',resetSent:'If this account exists, a new code has been sent. Use the latest email.',
            resetMismatch:'Passwords must match and contain at least 12 characters.',
            resetSuccess:'Password changed. Sign in with the new password.',
            resetError:'Password reset failed. Check the newest recovery code.',
            verifyAwait:'Check your inbox. If no code arrived, press “Resend code”.',
            verifyInvalid:'Incorrect or outdated code. Check the latest email.',
            verifyExpired:'The code has expired. Request a new one.',
            verifyLimit:'Too many attempts. Request a new code later.',
            verifyFailed:'Could not verify the code.',
            sendMailTest:'Send test email',mailTestHint:'Only to your verified address, once every 24 hours. Premium is unaffected.',
            mailTestSuccess:'Test email accepted for delivery. Check your inbox.',mailTestLimit:'One test per 24 hours is allowed.',mailTestError:'Could not send test email. Check Resend configuration.'
        }
    };
    let savedLang = '';
    try { savedLang = localStorage.getItem('muscleMap_lang') || ''; } catch {}
    const lang = (new URLSearchParams(location.search).get('lang') || savedLang || navigator.language || 'ru')
        .toLowerCase().startsWith('en') ? 'en' : 'ru';
    const t = (k) => translations[lang][k] || k;
    document.documentElement.lang = lang;
    for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
    document.title = lang === 'en'
        ? (cfg.stage === 'production' ? 'Account | Muscle Map' : 'Account | Muscle Map staging')
        : (cfg.stage === 'production' ? 'Аккаунт | Muscle Map' : 'Аккаунт | Muscle Map тест');

    const byId = id => document.getElementById(id);
    byId('accountStageLabel').classList.toggle('hidden', cfg.stage === 'production');
    byId('stagingMailTest').classList.toggle('hidden', cfg.stage !== 'staging');
    byId('stagingMailTestHint').classList.toggle('hidden', cfg.stage !== 'staging');
    const guest = byId('authGuest'), member = byId('authMember'), verify = byId('authVerify');
    const recovery = byId('authRecovery');
    const form = byId('authForm'), button = byId('authSubmit');
    const nameLabel = byId('nameLabel'), password = byId('accountPassword');
    const messageBox = byId('accountMessage');
    const legacyPremiumNotices = [byId('legacyPremiumNotice'), byId('legacyPremiumWarning')];
    // Owner's historical test purchases are not a warning for new paid customers.
    // Retain the old-account migration notes only in the isolated STAGING UI.
    if (cfg.stage === 'staging') legacyPremiumNotices[0].classList.remove('hidden');
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
        if (authenticated && cfg.emailVerificationRequired === true && user.emailVerified !== true) {
            showVerification(user.email || '');
            return false;
        }
        guest.classList.toggle('hidden', authenticated);
        member.classList.toggle('hidden', !authenticated);
        if (authenticated) {
            byId('accountIdentity').textContent = user.email || user.name || t('signedIn');
            const premiumEl = byId('accountPremium');
            premiumEl.textContent = cfg.enableBackendPremium === true ? t('premiumChecking') : t('notConnected');
            for (const notice of legacyPremiumNotices)
                notice.classList.toggle('hidden', cfg.stage !== 'staging');
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
                        endpoint.origin !== cfg.apiUrl) {
                        throw new Error('Missing or unsafe Premium API endpoint');
                    }
                    const token = await authRequest('/token');
                    if (typeof token?.token !== 'string' || !token.token) throw new Error('Missing session token');
                    const res = await fetch(endpoint.origin + '/api/v2/me/premium', {
                        headers: { Authorization: 'Bearer ' + token.token },
                        cache: 'no-store',
                        redirect: 'error'
                    });
                    if (!res.ok) throw new Error('Premium status request failed');
                    const status = await res.json();
                    const date = status.expiresAt ? new Date(status.expiresAt) : null;
                    const active = status.premium === true && date &&
                        Number.isFinite(date.getTime()) && date > new Date();
                    premiumEl.textContent = active
                        ? t('premiumActive') + ' ' + date.toLocaleDateString(lang)
                        : (status.premium === false ? t('premiumFree') : t('premiumError'));
                    // Historical-linking notices are irrelevant once a paid identity is verified.
                    if (active) for (const notice of legacyPremiumNotices) notice.classList.add('hidden');
                } catch {
                    premiumEl.textContent = t('premiumError');
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
    // User-facing password recovery uses the actual tested Neon Better Auth
    // email-OTP reset endpoints; no login password or OTP is saved locally.
    byId('authOpenRecovery').addEventListener('click', () => {
        if (busy) return;
        member.classList.add('hidden');
        guest.classList.add('hidden');
        verify.classList.add('hidden');
        recovery.classList.remove('hidden');
        byId('recoveryEmail').value = byId('accountEmail').value.trim().toLowerCase();
        byId('recoveryFinishForm').classList.add('hidden');
        byId('recoveryOtp').value = '';
        byId('recoveryPassword').value = '';
        byId('recoveryRepeatPassword').value = '';
        message('');
    });
    byId('recoveryBack').addEventListener('click', () => {
        if (busy) return;
        recovery.classList.add('hidden');
        guest.classList.remove('hidden');
        selectMode('login');
    });
    byId('recoveryRequestForm').addEventListener('submit', async event => {
        event.preventDefault();
        if (busy || !byId('recoveryRequestForm').reportValidity()) return;
        const email = byId('recoveryEmail').value.trim().toLowerCase();
        const control = byId('recoveryRequestSubmit');
        setBusy(true); control.disabled = true;
        try {
            await authRequest('/email-otp/request-password-reset', 'POST', {email});
            byId('recoveryFinishForm').classList.remove('hidden');
            message(t('resetSent'));
        } catch {
            message(t('apiError'), true);
        } finally {
            setBusy(false); control.disabled = false;
        }
    });
    byId('recoveryFinishForm').addEventListener('submit', async event => {
        event.preventDefault();
        if (busy || !byId('recoveryFinishForm').reportValidity()) return;
        const email = byId('recoveryEmail').value.trim().toLowerCase();
        const otp = byId('recoveryOtp').value.trim();
        const pass = byId('recoveryPassword').value;
        if (!/^[0-9]{4,10}$/.test(otp) || pass.length < 12 ||
            pass.length > 128 || pass !== byId('recoveryRepeatPassword').value) {
            message(t('resetMismatch'), true);
            return;
        }
        const control = byId('recoveryResetSubmit');
        setBusy(true); control.disabled = true;
        try {
            await authRequest('/email-otp/reset-password', 'POST', {email,otp,password:pass});
            byId('recoveryOtp').value = '';
            byId('recoveryPassword').value = '';
            byId('recoveryRepeatPassword').value = '';
            recovery.classList.add('hidden');
            guest.classList.remove('hidden');
            selectMode('login');
            byId('accountEmail').value = email;
            message(t('resetSuccess'));
        } catch {
            // Avoid provider response reflection and account enumeration.
            message(t('resetError'), true);
        } finally {
            byId('recoveryPassword').value = '';
            byId('recoveryRepeatPassword').value = '';
            setBusy(false); control.disabled = false;
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
    byId('stagingMailTest').addEventListener('click', async () => {
        const btn=byId('stagingMailTest');
        if(busy||btn.disabled)return;
        btn.disabled=true;
        message('');
        try {
            // This is the isolated, dedicated staging API. Never send a JWT
            // to the production backend or any redirected destination.
            if(cfg.stage!=='staging' ||
                cfg.apiUrl!=='https://muscle-map-backend-staging.onrender.com'){
                throw Error(t('mailTestError'));
            }
            const token=await authRequest('/token');
            if(typeof token?.token!=='string'||!token.token){
                throw Error(t('mailTestError'));
            }
            const response=await fetch(cfg.apiUrl+'/api/staging/me/mail-test',{
                method:'POST',headers:{Authorization:'Bearer '+token.token},
                cache:'no-store',redirect:'error'
            });
            if(response.status===429)throw Error(t('mailTestLimit'));
            if(response.status!==202)throw Error(t('mailTestError'));
            message(t('mailTestSuccess'));
        }catch(error){
            message(error.message||t('mailTestError'),true);
        }finally{btn.disabled=false;}
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
