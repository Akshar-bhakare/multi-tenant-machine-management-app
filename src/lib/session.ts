export const SESSION_KEY = "mock_user_session" 

export function saveSession(email: string) {
    localStorage.setItem(SESSION_KEY, email)
}

export function getSession() {
    return localStorage.getItem(SESSION_KEY)
}

export function clearSession() {
    return localStorage.removeItem(SESSION_KEY)
}