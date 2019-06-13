import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { translate } from '@gqlapp/i18n-client-react';
import { Loading } from '@gqlapp/look-client-react-native';

import UserForm from './UserForm';
import { withLoadedUser } from '../containers/Auth';

const UserEditView = ({ loading, user, t, currentUser, onSubmit }) => {
  if (loading && !user) {
    return <Loading text={t('userEdit.loadMsg')} />;
  } else {
    const isNotSelf = !user || (user && user.id !== currentUser.id);
    return (
      <View style={styles.container}>
        <UserForm
          onSubmit={onSubmit}
          shouldDisplayRole={isNotSelf}
          shouldDisplayActive={isNotSelf}
          initialValues={user || {}}
        />
      </View>
    );
  }
};

UserEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  currentUser: PropTypes.object,
  t: PropTypes.func,
  onSubmit: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default withLoadedUser(translate('user')(UserEditView));
