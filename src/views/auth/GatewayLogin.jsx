import React, { useEffect, useRef, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory, useLocation } from 'react-router-dom';
import CustomInput from '@/components/formik/CustomInput';
import loginWithPassword from '@/services/login';

const schema = Yup.object().shape({
  username: Yup.string().trim().required('Username is required.'),
  password: Yup.string().required('Password is required.')
});

const GatewayLogin = () => {
  const history = useHistory();
  const { state } = useLocation();
  const [error, setError] = useState('');
  const pending = useRef(null);
  const mounted = useRef(true);
  useEffect(() => () => {
    mounted.current = false;
    pending.current?.abort();
  }, []);

  const submit = async ({ username, password }, { setFieldValue, setSubmitting }) => {
    if (pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setError('');
    setFieldValue('password', '', false);
    try {
      await loginWithPassword(username.trim(), password, controller.signal);
      if (mounted.current && !controller.signal.aborted) {
        const from = state?.from;
        const path = from?.pathname?.startsWith('/') && !from.pathname.startsWith('//')
          ? `${from.pathname}${from.search || ''}${from.hash || ''}` : '/';
        history.replace(path);
      }
    } catch (e) {
      if (mounted.current) {
        setError(e.name === 'AbortError' ? 'Sign-in timed out. Please try again.' : e.message);
      }
    } finally {
      clearTimeout(timeout);
      pending.current = null;
      if (mounted.current) setSubmitting(false);
    }
  };

  return (
    <div className="auth-content">
      <div className="auth">
        <div className="auth-main">
          <h3>Sign in</h3>
          {error && <p role="alert" className="toast-error">{error}</p>}
          <Formik initialValues={{ username: '', password: '' }} validationSchema={schema} onSubmit={submit}>
            {({ isSubmitting }) => (
              <Form>
                <div className="auth-field">
                  <Field name="username" label="Username" aria-label="Username" autoComplete="username" component={CustomInput} disabled={isSubmitting} />
                </div>
                <div className="auth-field">
                  <Field name="password" label="Password" aria-label="Password" type="password" autoComplete="current-password" component={CustomInput} disabled={isSubmitting} />
                </div>
                <div className="auth-field auth-action">
                  <Link to={{ pathname: '/forgot_password', state }}>Forgot password?</Link>
                  <button className="button auth-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="auth-message"><Link to={{ pathname: '/signup', state }}>Create an account</Link></div>
    </div>
  );
};

export default GatewayLogin;
