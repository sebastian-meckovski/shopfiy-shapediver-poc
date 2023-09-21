import logo from "./logo.svg";
import "./App.css";
import { createBlog } from "./graphql/mutations";
import { Amplify, API } from "aws-amplify";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App() {
  async function addBlog() {
    try {
      await API.graphql({
        query: createBlog,
        variables: { input: { name: "hola againn", description: "ohh yaaa" } },
      });
    } catch (err) {
      console.log("error creating blog:", err);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={addBlog}>add blog</button>
      </header>
    </div>
  );
}

export default App;
