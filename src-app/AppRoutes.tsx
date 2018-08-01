import createBrowserHistory from "history/createBrowserHistory";
import { map } from "lodash";
import * as React from "react";
import { Route, Router } from "react-router";
import { WithHighlight } from "../src-components/WithHighlight";

const history = createBrowserHistory();

const req = (require as any).context("../src-examples", true, /\.tsx/);

let routes: any[] = [];
req.keys().forEach((key: string) => {
  const module = req(key);

  const route = {
    path: key.split(".")[1],
    component: () =>
      map(module, (Comp, i) => {
        return (
          <React.Fragment key={i}>
            <Comp />
            <WithHighlight>
              <pre>
                <code>{require(`!!raw-loader!../src-examples/${Comp.name}.tsx`)}</code>
              </pre>
            </WithHighlight>
          </React.Fragment>
        );
      }),
  };
  routes = routes.concat(route);
});

export const Nav = () => {
  return (
    <div style={{ width: 200 }}>
      {req.keys().map((key: string) => {
        const path = key.split(".")[1];
        return (
          <div key={key}>
            <a href={path}>{path.split("/")[1]}</a>
          </div>
        );
      })}
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Router history={history}>
      <div>
        {routes.map((route, i) => (
          <Route key={i} {...route} />
        ))}
      </div>
    </Router>
  );
};
