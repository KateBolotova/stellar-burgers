import { TUser } from '@utils-types';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setCookie } from '../utils/cookie';
import { RootState } from './store';

interface ProfileState {
  user: TUser | null;
  loading: boolean;
  error: string | null;
}

export const initialProfile: ProfileState = {
  user: null,
  loading: false,
  error: null
};

export const fetchProfile = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await getUserApi(); // возвращает { user }
    return (data as any).user as TUser;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? 'Ошибка получения данных профиля');
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('auth/register', async (form, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(form);

    if (data.refreshToken)
      localStorage.setItem('refreshToken', data.refreshToken);
    if (data.accessToken) setCookie('accessToken', data.accessToken);
    return data.user;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? 'Регистрация не удалась');
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(credentials);
    if (data.refreshToken)
      localStorage.setItem('refreshToken', data.refreshToken);
    if (data.accessToken) setCookie('accessToken', data.accessToken);
    return data.user;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? 'Авторизация не удалась');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      setCookie('accessToken', '');
      return;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? 'Ошибка при логауте');
    }
  }
);

export const forgotPassword = createAsyncThunk<
  boolean,
  { email: string },
  { rejectValue: string }
>('auth/forgotPassword', async (payload, { rejectWithValue }) => {
  try {
    await forgotPasswordApi(payload);
    return true;
  } catch (err: any) {
    return rejectWithValue(
      err?.message ?? 'Ошибка запроса восстановления пароля'
    );
  }
});

export const resetPassword = createAsyncThunk<
  boolean,
  { password: string; token: string },
  { rejectValue: string }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    await resetPasswordApi(payload);
    return true;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? 'Ошибка сброса пароля');
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('auth/updateUser', async (userPatch, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(userPatch);
    return (data as any).user as TUser;
  } catch (err: any) {
    return rejectWithValue(err?.message ?? 'Ошибка обновления профиля');
  }
});

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initialProfile,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
    clearProfile(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProfile.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Unknown error';
    });

    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? action.error.message ?? 'Registration failed';
    });

    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Login failed';
    });

    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Logout failed';
    });

    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? action.error.message ?? 'Update profile failed';
    });

    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? action.error.message ?? 'Forgot password failed';
    });

    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? action.error.message ?? 'Reset password failed';
    });
  }
});

export const { clearProfileError, clearProfile } = profileSlice.actions;

export const selectUserProfile = (state: RootState) => state.profile.user;
export const selectUserProfileLoading = (state: RootState) =>
  state.profile.loading;
export const selectUserProfileError = (state: RootState) => state.profile.error;
