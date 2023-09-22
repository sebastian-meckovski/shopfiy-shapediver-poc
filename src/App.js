import logo from "./logo.svg";
import "./App.css";
import { createPullUpBar, deletePullUpBar } from "./graphql/mutations";
import { Amplify, API } from "aws-amplify";
import awsExports from "./aws-exports";
import { useEffect, useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsExports);

const initialData = {
  name: "",
  description: "",
  userId: "",
};

function App({ signOut, user }) {
  const [pullUpBarList, setPullUpBarList] = useState();
  const [formData, setFormData] = useState(initialData);

  const listPullUpBarsByUser = /* GraphQL */ `
    query MyQuery {
      listPullUpBars(
        filter: { userID: { eq: "${user.username}" } }
      ) {
        items {
          id
          location
          name
          userID
          description
        }
      }
    }
  `;

  async function addPullUpBar(name, description) {
    try {
      await API.graphql({
        query: createPullUpBar,
        variables: {
          input: {
            name: name,
            description: description,
            userID: user.username,
          },
        },
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
        query: listPullUpBarsByUser,
      }).then((response) => {
        setPullUpBarList(response.data?.listPullUpBars?.items);
      });
    } catch {}
  }

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

  useEffect(() => {
    getAllPullUpBars();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h1>Hello {user?.attributes?.name}</h1>
        <button onClick={signOut}>Sign out</button>

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

export default withAuthenticator(App);
