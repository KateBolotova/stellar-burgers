import {
  clearProfile,
  clearProfileError,
  fetchProfile,
  initialProfile,
  profileSlice,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  forgotPassword,
  resetPassword
} from '../../services/profile';
import { TUser } from '@utils-types';

const testUser: TUser = {
  email: 'exampl@example.com',
  name: 'John Doe'
};

const testPassword = 'pass';
const testToken = 'token';
const testPassWithToken = {
  password: testPassword,
  token: testToken
};
const testEmailPayload = {
  email: testUser.email
};
const testLoginData = {
  email: testEmailPayload.email,
  password: testPassword
};
const testRegisterData = {
  email: testUser.email,
  name: testUser.name,
  password: testPassword
};

describe('profile slice', () => {
  const reducer = profileSlice.reducer;

  test('При undefined state и неизвестном экшене возвращает initial state', () => {
    const next = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(next).toEqual(initialProfile);
  });

  test('clearProfileError сбрасывает поле error в null', () => {
    const stateWithError = { ...initialProfile, error: 'some error' };
    const next = reducer(stateWithError, clearProfileError());
    expect(next.error).toBeNull();
  });

  describe('clearProfile', () => {
    test('clearProfile сбрасывает пользователя в null', () => {
      const stateWithUser = {
        ...initialProfile,
        user: testUser
      };
      const next = reducer(stateWithUser, clearProfile());
      expect(next.user).toBeNull();
    });

    test('clearProfile сбрасывает поле error в null', () => {
      const stateWithUser = {
        ...initialProfile,
        error: 'some error'
      };
      const next = reducer(stateWithUser, clearProfile());
      expect(next.error).toBeNull();
    });
  });

  describe('fetchProfile', () => {
    test('fetchProfile.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialProfile, loading: false, error: 'err' };
      const action = fetchProfile.pending('reqId');
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('fetchProfile.fulfilled записывает payload в user и loading=false', () => {
      const action = fetchProfile.fulfilled(testUser, 'reqId');
      const next = reducer(initialProfile, action);
      expect(next.loading).toBe(false);
      expect(next.user).toEqual(testUser);
    });

    test('fetchProfile.rejected устанавливает ошибку и loading=false', () => {
      const action = fetchProfile.rejected(
        new Error('request rejected'),
        'reqId'
      );
      const next = reducer(initialProfile, action);
      expect(next.loading).toBe(false);
      expect(next.error).toBe('request rejected');
    });
  });

  describe('registerUser', () => {
    test('registerUser.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialProfile, loading: false, error: 'err' };
      const action = registerUser.pending('reqId', testRegisterData);
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('registerUser.fulfilled записывает payload в user и loading=false', () => {
      const action = registerUser.fulfilled(
        testUser,
        'reqId',
        testRegisterData
      );
      const next = reducer(initialProfile, action);
      expect(next.loading).toBe(false);
      expect(next.user).toEqual(testUser);
    });

    test('registerUser.rejected устанавливает сообщение ошибки', () => {
      const action = registerUser.rejected(
        new Error('request rejected'),
        'reqId',
        testRegisterData
      );
      const next = reducer(initialProfile, action);
      expect(next.loading).toBe(false);
      expect(next.error).toBe('request rejected');
    });
  });

  describe('loginUser', () => {
    test('loginUser.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialProfile, loading: false, error: 'err' };
      const action = loginUser.pending('reqId', testLoginData);
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('loginUser.fulfilled записывает payload в user и loading=false', () => {
      const action = loginUser.fulfilled(testUser, 'reqId', testLoginData);
      const next = reducer(initialProfile, action);
      expect(next.loading).toBe(false);
      expect(next.user).toEqual(testUser);
    });

    test('loginUser.rejected устанавливает сообщение ошибки', () => {
      const action = loginUser.rejected(
        new Error('request rejected'),
        'reqId',
        testLoginData
      );
      const next = reducer(initialProfile, action);
      expect(next.loading).toBe(false);
      expect(next.error).toBe('request rejected');
    });
  });

  describe('logoutUser', () => {
    test('logoutUser.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialProfile, loading: false, error: 'err' };
      const action = logoutUser.pending('reqId');
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('logoutUser.fulfilled обнуляет user и loading=false', () => {
      const stateWithUser = {
        ...initialProfile,
        user: testUser,
        loading: true
      };
      const action = logoutUser.fulfilled(undefined, 'reqId');
      const next = reducer(stateWithUser, action);
      expect(next.loading).toBe(false);
      expect(next.user).toBeNull();
    });

    test('logoutUser.rejected устанавливает сообщение ошибки', () => {
      const action = logoutUser.rejected(
        new Error('request rejected'),
        'reqId'
      );
      const next = reducer(initialProfile, action);
      expect(next.loading).toBe(false);
      expect(next.error).toBe('request rejected');
    });
  });

  describe('updateUser', () => {
    test('updateUser.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialProfile, loading: false, error: 'err' };
      const action = updateUser.pending('reqId', {});
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('updateUser.fulfilled обновляет user и loading=false', () => {
      const updated: TUser = { ...testUser, name: 'Jane' };
      const action = updateUser.fulfilled(updated, 'reqId', {});
      const next = reducer(initialProfile, action);
      expect(next.loading).toBe(false);
      expect(next.user).toEqual(updated);
    });

    test('updateUser.rejected устанавливает сообщение ошибки', () => {
      const action = updateUser.rejected(
        new Error('request rejected'),
        'reqId',
        {}
      );
      const next = reducer(initialProfile, action);
      expect(next.loading).toBe(false);
      expect(next.error).toBe('request rejected');
    });
  });

  describe('forgotPassword', () => {
    test('forgotPassword.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialProfile, loading: false, error: 'err' };
      const action = forgotPassword.pending('reqId', testEmailPayload);
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('forgotPassword.fulfilled ставит loading=false', () => {
      const action = forgotPassword.fulfilled(true, 'reqId', testEmailPayload);
      const next = reducer({ ...initialProfile, loading: true }, action);
      expect(next.loading).toBe(false);
    });

    test('forgotPassword.rejected устанавливает сообщение ошибки', () => {
      const actionWithMessage = forgotPassword.rejected(
        new Error('request rejected'),
        'reqId',
        testEmailPayload
      );
      const next = reducer(initialProfile, actionWithMessage);
      expect(next.error).toBe('request rejected');
    });
  });

  describe('resetPassword', () => {
    test('resetPassword.pending ставит loading=true и сбрасывает error', () => {
      const prev = { ...initialProfile, loading: false, error: 'err' };
      const action = resetPassword.pending('reqId', testPassWithToken);
      const next = reducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    test('resetPassword.fulfilled ставит loading=false', () => {
      const action = resetPassword.fulfilled(true, 'reqId', testPassWithToken);
      const next = reducer({ ...initialProfile, loading: true }, action);
      expect(next.loading).toBe(false);
    });

    test('resetPassword.rejected устанавливает сообщение ошибки', () => {
      const action = resetPassword.rejected(
        new Error('request rejected'),
        'reqId',
        testPassWithToken
      );
      const next = reducer(initialProfile, action);
      expect(next.loading).toBe(false);
      expect(next.error).toBe('request rejected');
    });
  });
});
