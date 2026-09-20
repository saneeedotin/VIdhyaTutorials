import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '',
  withCredentials: true, // Important for sending/receiving httpOnly cookies
});

// Intercept requests to attach access token if it exists in memory
let memoryAccessToken: string | null = null;
let impersonatedUserId: string | null = null;

export const setAccessToken = (token: string | null) => {
  memoryAccessToken = token;
};

export const setImpersonationHeader = (userId: string | null) => {
  impersonatedUserId = userId;
};

export const getAccessToken = () => memoryAccessToken;

apiClient.interceptors.request.use((config) => {
  if (memoryAccessToken) {
    config.headers.Authorization = `Bearer ${memoryAccessToken}`;
  }
  if (impersonatedUserId) {
    config.headers['X-Impersonate-UserId'] = impersonatedUserId;
  }
  return config;
}, (error) => Promise.reject(error));

// Intercept responses to handle 401 Unauthorized (expired token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token using the httpOnly cookie
        const { data } = await axios.post(`${apiClient.defaults.baseURL}/api/auth/refresh`, {}, {
          withCredentials: true
        });
        
        // Update memory token
        setAccessToken(data.accessToken);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed (cookie expired or invalid)
        setAccessToken(null);
        // Dispatch custom event to trigger logout in AuthContext
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
