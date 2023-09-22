import logo from "./logo.svg";
import "./App.css";
import { createPullUpBar, deletePullUpBar } from "./graphql/mutations";
import { listPullUpBars } from "./graphql/queries";
import { Amplify, API } from "aws-amplify";
import awsExports from "./aws-exports";
import { useEffect, useState } from "react";
Amplify.configure(awsExports);

const initialData = {
  name: "",
  description: "",
};

function App() {
  const [pullUpBarList, setPullUpBarList] = useState();
  const [formData, setFormData] = useState(initialData);

  async function addPullUpBar(name, description) {
    try {
      await API.graphql({
        query: createPullUpBar,
        variables: { input: { name: name, description: description } },
      }).then((result) => {
        setPullUpBarList((prev) => {
          return [...prev, result.data.createPullUpBar];
        });
      });
    } catch (err) {
      console.log("error creating pullUpBar:", err);
    }
  }

  async function getAllPullUpBars() {
    try {
      await API.graphql({
        query: listPullUpBars,
      }).then((response) => {
        setPullUpBarList(response.data?.listPullUpBars?.items);
      });
    } catch {}
  }
  useEffect(() => {
    getAllPullUpBars();
  }, []);

  async function removePullUpBar(id) {
    try {
      await API.graphql({
        query: deletePullUpBar,
        variables: {
          input: { id: id },
        },
      }).then((response) => {
        setPullUpBarList((prev) => {
          return prev.filter((x) => {
            return x?.id !== response?.data?.deletePullUpBar?.id;
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    addPullUpBar(formData.name, formData.description);
    setFormData(initialData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <form onSubmit={handleSubmit}>
          <input
            required
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            required
            type="text"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>

        {pullUpBarList &&
          pullUpBarList.map((x) => {
            return (
              <span key={x.id}>
                {x.name} - {x.description}{" "}
                <button
                  onClick={() => {
                    removePullUpBar(x.id);
                  }}
                >
                  X
                </button>
              </span>
            );
          })}
      </header>
    </div>
  );
}

export default App;
