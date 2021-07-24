import React from "react";
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch } from "react-router-dom";
import Edit from "./components/Edit";
import TemplateList from "./components/TemplateList";
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Switch>
        <Route path="/template/:id" component={() => <Edit/>}/>
        <Route path="/create">
          <Edit/>
        </Route>
        <Route exact path="/">
          <TemplateList />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
