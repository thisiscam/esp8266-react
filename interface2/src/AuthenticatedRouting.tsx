import { FC, useCallback, useContext, useEffect } from 'react';
import { Redirect, Switch } from 'react-router';
import { AxiosError } from 'axios';

import { AXIOS } from './api/endpoints';
import { getDefaultRoute, storeLoginRedirect } from './api/authentication';
import { Layout } from './components/layout';
import { FeaturesContext } from './contexts/features';
import { Route, useHistory, useLocation } from 'react-router-dom';
import { PROJECT_PATH } from './api/env';
import ProjectRouting from './project/ProjectRouting';

const AuthenticatedRouting: FC = () => {

  const { features } = useContext(FeaturesContext);
  const location = useLocation();
  const history = useHistory();

  const handleApiResponseError = useCallback((error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      storeLoginRedirect(location);
      history.push("/unauthorized");
    }
    return Promise.reject(error);
  }, [location, history]);

  useEffect(() => {
    const axiosHandlerId = AXIOS.interceptors.response.use((response) => response, handleApiResponseError);
    return () => AXIOS.interceptors.response.eject(axiosHandlerId);
  }, [handleApiResponseError]);

  return (
    <Layout title="TODO - REPLACE ME WITH CONTEXT">
      <Switch>
        {features.project && (
          <Route exact path={`/${PROJECT_PATH}/*`}>
            <ProjectRouting />
          </Route>
        )}
        <Route exact path="/wifi">
          WiFi screen
        </Route>
        <Route exact path="/ap">
          Access point screen
        </Route>
        {features.ntp && (
          <Route exact path="/ntp">
            Network time protocol screen
          </Route>
        )}
        {features.mqtt && (
          <Route exact path="/mqtt">
            MQTT screen
          </Route>
        )}
        {features.security && (
          <Route exact path="/security">
            Security screen
          </Route>
        )}
        <Route exact path="/system">
          System screen
        </Route>
        {
          /*
            <AuthenticatedRoute exact path="/wifi/*" component={WiFiConnection} />
            <AuthenticatedRoute exact path="/ap/*" component={AccessPoint} />
            {features.ntp && (
              <AuthenticatedRoute exact path="/ntp/*" component={NetworkTime} />
            )}
            {features.mqtt && (
              <AuthenticatedRoute exact path="/mqtt/*" component={Mqtt} />
            )}
            {features.security && (
              <AuthenticatedRoute exact path="/security/*" component={Security} />
            )}
            <AuthenticatedRoute exact path="/system/*" component={System} />
          */
        }
        <Redirect to={getDefaultRoute(features)} />
      </Switch>
    </Layout>
  );
};

export default AuthenticatedRouting;
