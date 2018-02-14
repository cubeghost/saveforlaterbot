import Connect from 'components/connect';
import Messages from 'components/messages';
import User from 'components/user';

import { actionTypes, actionCreators } from 'src/actions';

const routes = [
  { path: '/',
    exact: true,
    component: Connect,
  },
  {
    path: '/messages',
    component: Messages,
    preload: {
      actionType: actionTypes.FETCH_MESSAGES,
      actionCreator: actionCreators.fetchMessages,
      functionName: 'getDirectMessages'
    }
  },
  {
    path: '/messages',
    component: User,
    preload: {
      actionType: actionTypes.FETCH_USER,
      actionCreator: actionCreators.fetchUser,
      functionName: 'getUser'
    }
  },
];

export default routes;
