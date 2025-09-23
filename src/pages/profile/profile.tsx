import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUserProfileLoading,
  selectUserProfile,
  updateUser,
  fetchProfile
} from '../../services/profile';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectUserProfileLoading);
  const user = useSelector(selectUserProfile);

  if (isLoading || !user) {
    return <Preloader />;
  }

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      updateUser({
        name: formValue.name !== user.name ? formValue.name : undefined,
        email: formValue.email !== user.email ? formValue.email : undefined,
        password: !!formValue.password ? formValue.password : undefined
      })
    );

    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
    dispatch(fetchProfile());
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('changed value of ', e.target.name, ' to ', e.target.value);
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
