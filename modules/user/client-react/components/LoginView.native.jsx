import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Linking, Platform } from 'react-native';
import { WebBrowser } from 'expo';
import { translate } from '@gqlapp/i18n-client-react';
import { lookStyles } from '@gqlapp/look-client-react-native';
import { setItem } from '@gqlapp/core-common/clientStorage';
import authentication from '@gqlapp/authentication-client-react';

import LoginForm from './LoginForm';

const LoginView = ({ client, navigation, onSubmit, t }) => {
  useEffect(() => {
    Linking.addEventListener('url', handleOpenURL);
    return () => Linking.removeEventListener('url', handleOpenURL);
  }, []);

  const handleOpenURL = async ({ url }) => {
    const dataRegExp = /data=([^#]+)/;
    if (!url.match(dataRegExp)) return;

    // Extract stringified user string out of the URL
    const [, data] = url.match(dataRegExp);
    const decodedData = JSON.parse(decodeURI(data));

    if (decodedData.tokens) {
      await setItem('accessToken', decodedData.tokens.accessToken);
      await setItem('refreshToken', decodedData.tokens.refreshToken);

      await authentication.doLogin(client);
    }

    if (Platform.OS === 'ios') {
      WebBrowser.dismissBrowser();
    }
  };

  const renderAvailableLogins = () => (
    <View style={styles.examplesArea}>
      <Text style={styles.title}>{t('login.cardTitle')}:</Text>
      <Text style={styles.exampleText}>admin@example.com: admin123</Text>
      <Text style={styles.exampleText}>user@example.com: user1234</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.examplesContainer}>{renderAvailableLogins()}</View>
      <View style={styles.loginContainer}>
        <LoginForm onSubmit={onSubmit} navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 10
  },
  examplesArea: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: lookStyles.placeholderColor,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    padding: 10
  },
  examplesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: lookStyles.placeholderColor
  },
  exampleText: {
    fontSize: 14,
    fontWeight: '400',
    color: lookStyles.placeholderColor
  },
  loginContainer: {
    flex: 3
  }
});

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
  t: PropTypes.func,
  onSubmit: PropTypes.func,
  client: PropTypes.object,
  error: PropTypes.string,
  navigation: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default translate('user')(LoginView);
