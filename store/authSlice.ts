import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean; // Solo se maneja el estado de autenticación
}

const initialState: AuthState = {
  isAuthenticated: false, // Valor inicial para 'isAuthenticated'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload; // Actualiza el estado de 'isAuthenticated'
    },
  },
});

export const { setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;
